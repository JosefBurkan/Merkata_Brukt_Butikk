import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";

// GET request handler for /api/products
export async function GET() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("Product")
    .select("*");

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return Response.json(data);
}

// POST request handler for /api/products
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const body = await request.json();

  const { data, error } = await supabase
    .from("Product")
    .insert(body)
    .select();

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return Response.json(data, { status: 201 });
}