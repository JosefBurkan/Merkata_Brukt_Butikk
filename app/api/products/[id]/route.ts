import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";
import { cloudinary } from "@/lib/cloudinary";
import { categories } from "@/lib/categories";

// GET PRODUCT

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Find the product where the database ID
  // matches the ID from the URL
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


// UPDATE PRODUCT

// Updates a product and removes its old
// Cloudinary image if the image was replaced
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);


  // CHECK ADMIN

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


  // READ REQUEST BODY

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Ugyldig request body" },
      { status: 400 }
    );
  }


  // GET CURRENT PRODUCT

  // We need the current image ID so we can remove
  // the old Cloudinary image after a successful update.
  const {
    data: currentProduct,
    error: fetchError,
  } = await supabase
    .from("Product")
    .select("image_public_id")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return Response.json(
      { error: fetchError.message },
      { status: 500 }
    );
  }

  if (!currentProduct) {
    return Response.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }


  // VALIDATE NAME

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


  // VALIDATE PRICE

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


  // VALIDATE AGE

  let age: number | null = null;

  if (
    body.age !== null &&
    body.age !== undefined
  ) {
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


  // VALIDATE DESCRIPTION

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


  // VALIDATE CATEGORY

  if (
  typeof body.category !== "string" ||
  !categories.includes(
    body.category as (typeof categories)[number]
  )
) {
  return Response.json(
    { error: "Ugyldig kategori" },
    { status: 400 }
  );
}

  const category = body.category;


  // VALIDATE SUBCATEGORY

  if (
    typeof body.sub_category !== "string" ||
    body.sub_category.trim().length === 0
  ) {
    return Response.json(
      { error: "Underkategori er påkrevd" },
      { status: 400 }
    );
  }

  const subCategory =
    body.sub_category.trim();


  // Make sure that the selected subcategory
  // actually belongs to the selected category.
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
      {
        error:
          "Kunne ikke kontrollere underkategori",
      },
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


  // VALIDATE IMAGE VALUES

  const imageUrl =
    typeof body.image_url === "string"
      ? body.image_url
      : null;

  const imagePublicId =
    typeof body.image_public_id === "string"
      ? body.image_public_id
      : null;


  // CREATE SAFE UPDATE OBJECT

  // Do not pass the original body directly to Supabase.
  // Only these fields are allowed to be updated.
  const updatedProduct = {
    name,
    age,
    price,
    description,
    category,
    sub_category: subCategory,
    image_url: imageUrl,
    image_public_id: imagePublicId,
  };


  // UPDATE PRODUCT

  const { data, error } = await supabase
    .from("Product")
    .update(updatedProduct)
    .eq("id", id)
    .select()
    .single();

  if (error) {

    // If a new image was already uploaded but the
    // database update failed, remove the new image
    // so it does not remain unused in Cloudinary.
    if (
      imagePublicId &&
      imagePublicId !== currentProduct.image_public_id
    ) {
      try {
        await cloudinary.uploader.destroy(
          imagePublicId
        );
      } catch (cloudinaryError) {
        console.error(
          "Could not delete unused new image from Cloudinary:",
          cloudinaryError
        );
      }
    }

    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }


  // DELETE OLD IMAGE

  const oldImagePublicId =
    currentProduct.image_public_id;

  const newImagePublicId =
    imagePublicId;

  // If the image changed, remove the old image
  // from Cloudinary after the database update succeeds.
  if (
    oldImagePublicId &&
    newImagePublicId &&
    oldImagePublicId !== newImagePublicId
  ) {
    try {
      await cloudinary.uploader.destroy(
        oldImagePublicId
      );
    } catch (cloudinaryError) {
      console.error(
        "Could not delete old image from Cloudinary:",
        cloudinaryError
      );
    }
  }

  return Response.json(data);
}


// DELETE PRODUCT

// Deletes the product and its Cloudinary image
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);


  // CHECK ADMIN

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


  // GET PRODUCT

  // Get the product first so we know which
  // Cloudinary image belongs to it.
  const {
    data: product,
    error: fetchError,
  } = await supabase
    .from("Product")
    .select("image_public_id")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return Response.json(
      { error: fetchError.message },
      { status: 500 }
    );
  }

  if (!product) {
    return Response.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  
  // DELETE FROM SUPABASE

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


  // DELETE CLOUDINARY IMAGE

  if (product.image_public_id) {
    try {
      await cloudinary.uploader.destroy(
        product.image_public_id
      );
    } catch (cloudinaryError) {
      console.error(
        "Could not delete image from Cloudinary:",
        cloudinaryError
      );
    }
  }

  return Response.json(data);
}