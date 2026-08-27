import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";
import { categories } from "@/lib/categories";

// GET SUBCATEGORIES

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // /api/subcategories?category=Elektronikk
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  if (!category) {
    return Response.json(
      { error: "Category is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("SubCategory")
    .select("*")
    .eq("category", category)
    .order("name", { ascending: true });

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return Response.json(data);
}

// CREATE SUBCATEGORY

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Check who is logged in
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  // Only the actual owner/admin may create subcategories
  if (
    claimsError ||
    !claimsData?.claims ||
    claimsData.claims.sub !== process.env.ADMIN_USER_ID
  ) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();

  // Remove whitespace around the name
  // " Spill " becomes "Spill"
  const name =
    typeof body.name === "string"
      ? body.name.trim()
      : "";

  const category =
    typeof body.category === "string"
      ? body.category
      : "";

  // Subcategory cannot be empty
  if (!name) {
    return Response.json(
      { error: "Underkategori må ha et navn" },
      { status: 400 }
    );
  }

  // Category must be one of our actual categories
  if (
  !categories.includes(
    category as (typeof categories)[number]
  )
) {
  return Response.json(
    { error: "Ugyldig kategori" },
    { status: 400 }
  );
}

  // Create the new subcategory
  const { data, error } = await supabase
    .from("SubCategory")
    .insert({
      name,
      category,
    })
    .select()
    .single();

  if (error) {
    // PostgreSQL error 23505 = unique constraint violation.
    // This happens if e.g. "Spill" already exists under Elektronikk.
    if (error.code === "23505") {
      return Response.json(
        {
          error:
            "Denne underkategorien finnes allerede i kategorien",
        },
        { status: 409 }
      );
    }

    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return Response.json(data, { status: 201 });
}