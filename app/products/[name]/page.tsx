import { createClient } from '@/supabase/server'
import { cookies } from 'next/headers'

// Hent den siste delen av URL-en
export default async function Products({
    params, }:
{
    params: Promise<{ name: string }>;
}) {
    const { name } = await params;

    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore);

    const { data: products, error } = await supabase
        .from("Product")
        .select("*")
        .eq("category", name);
    

    if (error) {
      console.error(error);
    }
  
    // Her skrives dataen til kategoriene ut
    console.log("Products:", products);
    console.log("Error:", error);

    // Lager et kort for hver rad i databasetabellen som har lik kategori
    return (
        <main>
            <h1 className="text-3xl font-bold text-center p-10">{name}</h1>

        
            <div className="product-list grid-cols-1 lg:grid-cols-3 justify-items-center mx-auto gap-50">
                {products?.map((data) => (
                    <p className="product-card" key={data.id}>{data.name}</p>
                ))}
            </div>
            
        </main>
    );
}