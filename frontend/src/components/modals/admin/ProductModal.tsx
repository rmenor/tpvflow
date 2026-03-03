import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { API_URL } from "../../../config/api";

type CategoryRef = {
    id: string;
    name: string;
};

type Product = {
    id?: string;
    name: string;
    price: number;
    categoryId: string;
    ingredients: string[];
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Product) => void;
    initialData?: Product | null;
};

export default function ProductModal({ isOpen, onClose, onSave, initialData }: Props) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState<number | "">("");
    const [categoryId, setCategoryId] = useState("");
    const [ingredientsText, setIngredientsText] = useState("");
    const [categories, setCategories] = useState<CategoryRef[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetch(`${API_URL}/api/categories`)
                .then((res) => res.json())
                .then((data) => setCategories(data))
                .catch(console.error);
        }
    }, [isOpen]);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setPrice(initialData.price);
            setCategoryId(initialData.categoryId || "");
            setIngredientsText(initialData.ingredients?.join(", ") || "");
        } else {
            setName("");
            setPrice("");
            setCategoryId("");
            setIngredientsText("");
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: initialData?.id,
            name,
            price: Number(price),
            categoryId,
            ingredients: ingredientsText.split(",").map(i => i.trim()).filter(i => i),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-slate-800">
                        {initialData ? "Editar Producto" : "Nuevo Producto"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            placeholder="Ej. Pizza Margarita"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Precio (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={price}
                                onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                            <select
                                required
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            >
                                <option value="" disabled>Selecciona...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Ingredientes (separados por coma)</label>
                        <textarea
                            value={ingredientsText}
                            onChange={(e) => setIngredientsText(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none h-20"
                            placeholder="Tomate, Queso Mozzarella, Orégano"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
