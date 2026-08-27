import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";
import { categories } from "@/lib/categories";


// =========================
// GET PRODUCTS
// =========================

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


// =========================
// CREATE PRODUCT
// =========================

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);


  // =========================
  // CHECK ADMIN
  // =========================

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

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


  // =========================
  // READ REQUEST BODY
  // =========================

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Ugyldig request body" },
      { status: 400 }
    );
  }


  // =========================
  // VALIDATE NAME
  // =========================

  if (
    typeof body.name !== "string" ||
    body.name.trim().length === 0
  ) {
    return Response.json(
      { error: "Produktet må ha et navn" },
      { status: 400 }
    );
  }

  const name = body.name.trim();


  // =========================
  // VALIDATE PRICE
  // =========================

  if (
    typeof body.price !== "number" ||
    !Number.isFinite(body.price) ||
    body.price < 0
  ) {
    return Response.json(
      { error: "Ugyldig pris" },
      { status: 400 }
    );
  }

  const price = body.price;


  // =========================
  // VALIDATE AGE
  // =========================

  let age: number | null = null;

  if (body.age !== null && body.age !== undefined) {
    if (
      typeof body.age !== "number" ||
      !Number.isInteger(body.age) ||
      body.age < 0
    ) {
      return Response.json(
        { error: "Ugyldig alder" },
        { status: 400 }
      );
    }

    age = body.age;
  }


  // =========================
  // VALIDATE DESCRIPTION
  // =========================

  let description: string | null = null;

  if (
    body.description !== null &&
    body.description !== undefined &&
    body.description !== ""
  ) {
    if (typeof body.description !== "string") {
      return Response.json(
        { error: "Ugyldig beskrivelse" },
        { status: 400 }
      );
    }

    description = body.description.trim();
  }


  // =========================
  // VALIDATE CATEGORY
  // =========================

  if (
  typeof body.category !== "string" ||
  !categories.includes(body.category as (typeof categories)[number])
) {
    return Response.json(
      { error: "Ugyldig kategori" },
      { status: 400 }
    );
  }

  const category = body.category;


  // =========================
  // VALIDATE SUBCATEGORY
  // =========================

  if (
    typeof body.sub_category !== "string" ||
    body.sub_category.trim().length === 0
  ) {
    return Response.json(
      { error: "Underkategori er påkrevd" },
      { status: 400 }
    );
  }

  const subCategory = body.sub_category.trim();


  // Check that the subcategory actually exists
  // under the selected main category.
  const {
    data: existingSubCategory,
    error: subCategoryError,
  } = await supabase
    .from("SubCategory")
    .select("id")
    .eq("category", category)
    .eq("name", subCategory)
    .maybeSingle();

  if (subCategoryError) {
    return Response.json(
      { error: "Kunne ikke kontrollere underkategori" },
      { status: 500 }
    );
  }

  if (!existingSubCategory) {
    return Response.json(
      {
        error:
          "Underkategorien finnes ikke i den valgte kategorien",
      },
      { status: 400 }
    );
  }


  // =========================
  // VALIDATE IMAGE VALUES
  // =========================

  const imageUrl =
    typeof body.image_url === "string"
      ? body.image_url
      : null;

  const imagePublicId =
    typeof body.image_public_id === "string"
      ? body.image_public_id
      : null;


  // =========================
  // CREATE SAFE PRODUCT OBJECT
  // =========================

  const product = {
    name,
    age,
    price,
    description,
    category,
    sub_category: subCategory,
    image_url: imageUrl,
    image_public_id: imagePublicId,
  };


  // =========================
  // INSERT PRODUCT
  // =========================

  const { data, error } = await supabase
    .from("Product")
    .insert(product)
    .select()
    .single();

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return Response.json(
    data,
    { status: 201 }
  );
}