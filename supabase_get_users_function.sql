-- Secure Function to fetch all registered users for Admin Dashboard
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  id uuid,
  email varchar,
  raw_user_meta_data jsonb,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Strict Check: Only the authorized admin email can execute this
  IF auth.jwt() ->> 'email' != 'imvanand1@gmail.com' THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY SELECT u.id, u.email::varchar, u.raw_user_meta_data, u.created_at FROM auth.users u;
END;
$$;
