import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  // Create a server-side Supabase client using the current session
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Verify the authenticated user
  const { data, error: authError } = await supabase.auth.getClaims();

  // Only the actual shop owner is allowed to upload product images
  if (
    authError ||
    !data?.claims ||
    data.claims.sub !== process.env.ADMIN_USER_ID
  ) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Read the multipart/form-data sent by the browser
  const formData = await request.formData();

  const file = formData.get("image");

  // Make sure an actual file was sent
  if (!(file instanceof File)) {
    return Response.json(
      { error: "No image provided" },
      { status: 400 }
    );
  }

  // Only allow image files
  if (!file.type.startsWith("image/")) {
    return Response.json(
      { error: "File must be an image" },
      { status: 400 }
    );
  }

  // Limit uploads to 5 MB
  if (file.size > 5 * 1024 * 1024) {
    return Response.json(
      { error: "Image must be smaller than 5 MB" },
      { status: 400 }
    );
  }

  // Convert the uploaded file into a format Cloudinary can receive
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString("base64");

  const dataUri = `data:${file.type};base64,${base64}`;

  try {
    // Upload the image to a dedicated Cloudinary folder
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "merkata-products",
      resource_type: "image",
    });

    // Return the values that will later be stored in Supabase
    return Response.json({
      image_url: result.secure_url,
      image_public_id: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    return Response.json(
      { error: "Could not upload image" },
      { status: 500 }
    );
  }
}