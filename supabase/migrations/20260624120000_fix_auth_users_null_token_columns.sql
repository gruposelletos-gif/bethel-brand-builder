-- Corrige registros existentes com tokens NULL em auth.users.
-- GoTrue falha ao carregar usuário: "converting NULL to string is unsupported".
UPDATE auth.users SET confirmation_token = '' WHERE confirmation_token IS NULL;
UPDATE auth.users SET recovery_token = '' WHERE recovery_token IS NULL;
UPDATE auth.users SET email_change_token_new = '' WHERE email_change_token_new IS NULL;
UPDATE auth.users SET email_change_token_current = '' WHERE email_change_token_current IS NULL;
UPDATE auth.users SET email_change = '' WHERE email_change IS NULL;
UPDATE auth.users SET phone_change_token = '' WHERE phone_change_token IS NULL;
UPDATE auth.users SET reauthentication_token = '' WHERE reauthentication_token IS NULL;

-- Normaliza tokens após admin.createUser (evita o mesmo erro em novos usuários).
CREATE OR REPLACE FUNCTION public.normalize_auth_user_tokens(_user_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = auth, public
AS $$
  UPDATE auth.users SET
    confirmation_token = COALESCE(confirmation_token, ''),
    recovery_token = COALESCE(recovery_token, ''),
    email_change_token_new = COALESCE(email_change_token_new, ''),
    email_change_token_current = COALESCE(email_change_token_current, ''),
    email_change = COALESCE(email_change, ''),
    phone_change_token = COALESCE(phone_change_token, ''),
    reauthentication_token = COALESCE(reauthentication_token, '')
  WHERE id = _user_id;
$$;

REVOKE ALL ON FUNCTION public.normalize_auth_user_tokens(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.normalize_auth_user_tokens(uuid) TO service_role;
