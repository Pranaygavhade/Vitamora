/*
# Revoke public execute on handle_new_user trigger function

The handle_new_user() function is a trigger function that auto-creates a profile
when a new auth user signs up. It should only be called by the database trigger,
not by any client via the REST API. Revoke EXECUTE from anon and authenticated roles.
*/

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
