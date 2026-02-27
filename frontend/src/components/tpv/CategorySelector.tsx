import { Category } from "../../types";

interface CategorySelectorProps {
    categories: Category[];
    activeCategory: string;
    setActiveCategory: (id: string) => void;
}

export function CategorySelector({ categories, activeCategory, setActiveCategory }: CategorySelectorProps) {
    return (
        <div className="flex items-center gap-3 overflow-x-auto pt-4 pb-8 -mt-4 px-2 -mx-2 no-scrollbar">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex-shrink-0 px-7 py-3.5 rounded-2xl text-[15px] font-bold transition-all duration-300 border ${activeCategory === cat.id
                        ? "bg-slate-900 text-white border-slate-900 shadow-[0_8px_16px_rgba(0,0,0,0.1)] transform -translate-y-1"
                        : "bg-white text-slate-500 border-slate-200/80 hover:border-indigo-200 hover:text-indigo-700 shadow-sm hover:shadow-md"
                        }`}
                >
                    <span className="capitalize">{cat.name.toLowerCase()}</span>
                </button>
            ))}
        </div>
    );
}
