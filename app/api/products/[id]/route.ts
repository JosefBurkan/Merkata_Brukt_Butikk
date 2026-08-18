import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";

// GET request handler for /api/products/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Find the product where the database ID matches the ID from the URL
  const { data, error } = await supabase
    .from("Product")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  if (!data) {
    return Response.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  return Response.json(data);
}

// UPDATE request handler for /api/products/[id]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const body = await request.json();

  // Update only the product whose ID matches the URL
  // RLS in Supabase decides whether the current user is allowed to update it
  const { data, error } = await supabase
    .from("Product")
    .update(body)
    .eq("id", id)
    .select();

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return Response.json(data);
}

// DELETE request handler for /api/products/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Delete only the product whose ID matches the URL
  // Supabase RLS verifies whether the current user has permission to delete
  const { data, error } = await supabase
    .from("Product")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return Response.json(data);
}