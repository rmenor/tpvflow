import { Product } from "../../types";

interface ProductGridProps {
    products: Product[];
    activeCategory: string;
    onProductClick: (product: Product) => void;
}

export function ProductGrid({ products, activeCategory, onProductClick }: ProductGridProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products
                .filter((p) => p.categoryId === activeCategory)
                .map((prod) => (
                    <button
                        key={prod.id}
                        onClick={() => onProductClick(prod)}
                        className="group bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg hover:shadow-indigo-100/60 hover:border-indigo-100 transition-all duration-300 flex flex-col text-left overflow-hidden transform hover:-translate-y-1 relative"
                    >
                        <div className="h-28 w-full bg-slate-100 relative overflow-hidden">
                            <img
                                src={`https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=300&h=200`}
                                alt=""
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-2 left-3 right-3">
                                <h3 className="font-extrabold text-white text-[15px] leading-tight drop-shadow-md truncate">
                                    {prod.name}
                                </h3>
                            </div>
                        </div>

                        <div className="p-3 w-full bg-white flex items-center justify-between">
                            <span className="font-black text-lg text-slate-700 group-hover:text-indigo-600 transition-colors tracking-tight">
                                {prod.price.toFixed(2)} <span className="text-sm font-bold">&euro;</span>
                            </span>
                            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all duration-300">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                        </div>
                    </button>
                ))}
        </div>
    );
}
