import { cookies } from "next/headers";
import { createClient } from "@/supabase/server";

// DELETE SUBCATEGORY

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

  // GET SUBCATEGORY

  const {
    data: subCategory,
    error: fetchError,
  } = await supabase
    .from("SubCategory")
    .select("id, name, category")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return Response.json(
      { error: fetchError.message },
      { status: 500 }
    );
  }

  if (!subCategory) {
    return Response.json(
      { error: "Underkategorien finnes ikke" },
      { status: 404 }
    );
  }

  // PROTECT "ANNET"
 
  if (subCategory.name === "Annet") {
    return Response.json(
      {
        error:
          "Annet kan ikke slettes fordi den brukes som standard underkategori",
      },
      { status: 400 }
    );
  }

  // CHECK FALLBACK
 
  // Make sure "Annet" actually exists
  // under the same main category.
  const {
    data: fallbackSubCategory,
    error: fallbackError,
  } = await supabase
    .from("SubCategory")
    .select("id")
    .eq("category", subCategory.category)
    .eq("name", "Annet")
    .maybeSingle();

  if (fallbackError) {
    return Response.json(
      { error: fallbackError.message },
      { status: 500 }
    );
  }

  if (!fallbackSubCategory) {
    return Response.json(
      {
        error:
          "Fant ikke underkategorien Annet for denne kategorien",
      },
      { status: 400 }
    );
  }

  // MOVE PRODUCTS TO "ANNET"
 
  const { error: updateError } = await supabase
    .from("Product")
    .update({
      sub_category: "Annet",
    })
    .eq("category", subCategory.category)
    .eq("sub_category", subCategory.name);

  if (updateError) {
    return Response.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  // DELETE SUBCATEGORY
 
  const { error: deleteError } = await supabase
    .from("SubCategory")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return Response.json(
      { error: deleteError.message },
      { status: 500 }
    );
  }


  return Response.json({
    message: "Underkategori slettet",
  });
}