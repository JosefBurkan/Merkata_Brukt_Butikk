import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/supabase/server";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } =
    await supabase.auth.getClaims();

  /*
   * User must:
   *
   * 1. Be authenticated.
   * 2. Have valid claims.
   * 3. Match the configured admin user ID.
   */
  if (
    error ||
    !data?.claims ||
    data.claims.sub !==
      process.env.ADMIN_USER_ID
  ) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}