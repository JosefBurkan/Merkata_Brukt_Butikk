import { createClient } from '@/supabase/server'
import { cookies } from 'next/headers'
import SearchBar from '@/app/components/SearchBar';
import Filter from '@/app/components/Filter';

// params for når man går inn på siden (kategorien)
// seachParams for når du søker på noe etter du er inne på siden (navn på produkt)
export default async function Products({
    params,
    searchParams,
}: {
    params: Promise<{ name: string }>;
    searchParams: Promise<{
        search?: string;
        maxPrice?: string;
        minPrice?: string;
        sub_category?: string;
    }>;
}) {
    const { name } = await params;
    const { search, maxPrice, minPrice, sub_category } = await searchParams;

    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    let query = supabase
        .from("Product")
        .select("*")
        .eq("category", name);

    // Søk
    if (search) {
        query = query.ilike("name", `%${search}%`);
    }

    // Makspris
    if (maxPrice) {
        query = query.lte("price", Number(maxPrice));
    }

    if (minPrice) {
        query = query.lte("price", Number(maxPrice));
    }

    if (sub_category) {
        query = query.eq("sub_category", sub_category);
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

            <div className="filter-container">
                <div className="filter">
                    <Filter name={name} />
                </div>
            </div>

            <div className="flex items-center justify-center -mt-50">
                <SearchBar className="text-center" />   
            </div>

            <h1 className="text-3xl font-bold text-center p-5">
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