import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";

// Nested layout only for routes beneath beneath the (protected) folder.
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}