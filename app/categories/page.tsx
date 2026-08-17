export default function Categories() {
    return (
        <main className="categories">
            <section className="news-section">
                <h2 className="pb-10">Kategorier</h2>

                <div className="product-list grid grid-cols-3 gap-x-50 ml-30">
                    <div className="product-card">elektronikk</div>
                    <div className="product-card">møbler</div>
                    <div className="product-card">fritid</div>
                    <div className="product-card">klær</div>
                    <div className="product-card">musikk</div>
                    <div className="product-card">annet</div>
                </div>
            </section>
        </main>
    );
}