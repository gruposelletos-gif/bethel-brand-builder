import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VALID_ROLES = ["admin", "viewer", "client"] as const;
type AppRole = (typeof VALID_ROLES)[number];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

/** Erros de validação/regra de negócio retornam 200 para o cliente ler `error` no corpo. */
const fail = (message: string) => json({ error: message });

const authErrorMessage = (error: { message?: string; msg?: string; code?: string; error_description?: string }) => {
  const message = [error.message, error.msg, error.error_description]
    .find((value) => typeof value === "string" && value.trim()) ?? "";
  if (message) {
    if (message.toLowerCase().includes("weak") || message.toLowerCase().includes("pwned")) {
      return "Senha fraca ou muito comum. Use letras, números e símbolos (ex.: Bethel@2026).";
    }
    if (message.toLowerCase().includes("different from the old")) {
      return "A nova senha deve ser diferente da senha atual.";
    }
    return message;
  }
  if (error.code) return `Erro de autenticação (${error.code})`;
  return "Não foi possível alterar a senha";
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Não autorizado" }, 401);

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) return json({ error: "Não autorizado" }, 401);

    const { data: isAdmin } = await supabaseUser.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) return json({ error: "Acesso negado" }, 403);

    const body = await req.json();
    const action = body?.action as string;

    if (action === "create") {
      const email = String(body?.email ?? "").trim().toLowerCase();
      const password = String(body?.password ?? "");
      const full_name = body?.full_name ? String(body.full_name).trim() : null;
      const role = body?.role as AppRole;

      if (!email || !password || !role) return fail("Preencha e-mail, senha e perfil");
      if (!VALID_ROLES.includes(role)) return fail("Perfil inválido");
      if (password.length < 8) return fail("A senha deve ter no mínimo 8 caracteres");

      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: full_name ? { full_name } : {},
      });

      if (createError || !newUser.user) {
        return fail(authErrorMessage(createError ?? { message: "Erro ao criar usuário" }));
      }

      await supabaseAdmin.rpc("normalize_auth_user_tokens", { _user_id: newUser.user.id });

      const { error: profileError } = await supabaseAdmin.from("profiles").insert({
        id: newUser.user.id,
        email,
        full_name,
      });
      if (profileError) {
        await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
        return fail(profileError.message);
      }

      const { error: roleError } = await supabaseAdmin.from("user_roles").insert({
        user_id: newUser.user.id,
        role,
      });
      if (roleError) {
        await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
        return fail(roleError.message);
      }

      return json({
        user: { id: newUser.user.id, email, full_name, role },
      });
    }

    if (action === "update_role") {
      const user_id = String(body?.user_id ?? "");
      const role = body?.role as AppRole;

      if (!user_id || !role) return fail("Dados incompletos");
      if (!VALID_ROLES.includes(role)) return fail("Perfil inválido");

      await supabaseAdmin.from("user_roles").delete().eq("user_id", user_id);
      const { error } = await supabaseAdmin.from("user_roles").insert({ user_id, role });
      if (error) return fail(error.message);

      return json({ success: true });
    }

    if (action === "reset_password") {
      const user_id = String(body?.user_id ?? "");
      const password = String(body?.password ?? "");

      if (!user_id || !password) return fail("Informe o usuário e a nova senha");
      if (password.length < 8) return fail("A senha deve ter no mínimo 8 caracteres");

      const { error: resetError } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
        password,
      });

      if (resetError) {
        return fail(authErrorMessage(resetError));
      }

      return json({ success: true });
    }

    return fail("Ação inválida");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro interno";
    return json({ error: message }, 500);
  }
});
