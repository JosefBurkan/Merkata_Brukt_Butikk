import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";
import { cloudinary } from "@/lib/cloudinary";

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
// UPDATE request handler for /api/products/[id]
// Updates a product and removes its old Cloudinary image if the image was replaced
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Get the product ID from the URL
  const { id } = await params;

  // Create the authenticated server-side Supabase client
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Read the updated product data sent by the client
  const body = await request.json();

  // Get the current image ID before updating the product
  const { data: currentProduct, error: fetchError } = await supabase
    .from("Product")
    .select("image_public_id")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return Response.json(
      { error: fetchError.message },
      { status: 400 }
    );
  }

  if (!currentProduct) {
    return Response.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  // Update the product in Supabase
  // RLS checks whether the current user has permission to update it
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

  // Check whether a new Cloudinary image replaced the old one
  const oldImagePublicId = currentProduct.image_public_id;
  const newImagePublicId = body.image_public_id;

  if (
    oldImagePublicId &&
    newImagePublicId &&
    oldImagePublicId !== newImagePublicId
  ) {
    try {
      // Remove the old image from Cloudinary so unused files do not remain
      await cloudinary.uploader.destroy(oldImagePublicId);
    } catch (cloudinaryError) {
      console.error(
        "Could not delete old image from Cloudinary:",
        cloudinaryError
      );
    }
  }

  // Return the updated product
  return Response.json(data);
}

// DELETE request handler for /api/products/[id]
// Deletes the product and its Cloudinary image
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Get the product ID from the URL
  const { id } = await params;

  // Create the authenticated server-side Supabase client
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Get the product first so we know which Cloudinary image belongs to it
  const { data: product, error: fetchError } = await supabase
    .from("Product")
    .select("image_public_id")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return Response.json(
      { error: fetchError.message },
      { status: 400 }
    );
  }

  if (!product) {
    return Response.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  // Delete the product from Supabase
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

  // If the product had an image, delete it from Cloudinary as well
  if (product.image_public_id) {
    try {
      await cloudinary.uploader.destroy(product.image_public_id);
    } catch (cloudinaryError) {
      console.error(
        "Could not delete image from Cloudinary:",
        cloudinaryError
      );
    }
  }

  return Response.json(data);
}