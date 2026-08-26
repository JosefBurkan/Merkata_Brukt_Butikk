import { createClient } from '@/supabase/server'
import { cookies } from 'next/headers'
import SearchBar from '@/app/components/SearchBar';

// params for når man går inn på siden (kategorien)
// seachParams for når du søker på noe etter du er inne på siden (navn på produkt)
export default async function Products({
    params,
    searchParams,
}: {
    params: Promise<{ name: string }>;
    searchParams: Promise<{ search?: string }>;
}) {
    const { name } = await params;
    const { search } = await searchParams;

    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    let query = supabase
        .from("Product")
        .select("*")
        .eq("category", name);

    // Sjekk om noe har blitt søkt på
    if (search) {
        query = query.ilike("name", `%${search}%`);
    }

    const { data: products, error } = await query;

    if (error) {
        console.error(error);
    }

    return (
        <main>
            <p className="p-5 text-black">
                Forside / Produkter / {name}
            </p>

            <div className="flex items-center justify-center">
                <SearchBar className="text-center" />   
            </div>

            <h1 className="text-3xl font-bold text-center p-10">
                {name}
            </h1>

            <div className="product-list grid-cols-1 lg:grid-cols-3 justify-items-center mx-auto gap-50">
                {products?.map((data) => (
                    <div className="product-card" key={data.id}>

                        <img
                            src={data.image_url}
                            alt={data.name}
                            className="h-[200px] w-full shrink-0 object-cover rounded-t-lg"
                        />

                        <p className="text-2xl font-bold text-center">
                            {data.name}
                        </p>

                        <p className="text-1xl font-bold text-center">
                            {data.price},-
                        </p>

                    </div>
                ))}
            </div>
        </main>
    );
}