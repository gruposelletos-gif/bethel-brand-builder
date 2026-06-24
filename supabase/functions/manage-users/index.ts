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

      if (!email || !password || !role) return json({ error: "Preencha e-mail, senha e perfil" }, 400);
      if (!VALID_ROLES.includes(role)) return json({ error: "Perfil inválido" }, 400);
      if (password.length < 6) return json({ error: "A senha deve ter no mínimo 6 caracteres" }, 400);

      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: full_name ? { full_name } : {},
      });

      if (createError || !newUser.user) {
        return json({ error: createError?.message ?? "Erro ao criar usuário" }, 400);
      }

      const { error: profileError } = await supabaseAdmin.from("profiles").insert({
        id: newUser.user.id,
        email,
        full_name,
      });
      if (profileError) {
        await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
        return json({ error: profileError.message }, 400);
      }

      const { error: roleError } = await supabaseAdmin.from("user_roles").insert({
        user_id: newUser.user.id,
        role,
      });
      if (roleError) {
        await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
        return json({ error: roleError.message }, 400);
      }

      return json({
        user: { id: newUser.user.id, email, full_name, role },
      });
    }

    if (action === "update_role") {
      const user_id = String(body?.user_id ?? "");
      const role = body?.role as AppRole;

      if (!user_id || !role) return json({ error: "Dados incompletos" }, 400);
      if (!VALID_ROLES.includes(role)) return json({ error: "Perfil inválido" }, 400);

      await supabaseAdmin.from("user_roles").delete().eq("user_id", user_id);
      const { error } = await supabaseAdmin.from("user_roles").insert({ user_id, role });
      if (error) return json({ error: error.message }, 400);

      return json({ success: true });
    }

    return json({ error: "Ação inválida" }, 400);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro interno";
    return json({ error: message }, 500);
  }
});
