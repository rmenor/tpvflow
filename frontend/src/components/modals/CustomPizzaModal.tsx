import { useState, useEffect } from "react";
import { Product } from "../../types";

const EXTRA_INGREDIENTS = [
    { name: "Extra Queso", price: 1.50 },
    { name: "Bacon", price: 1.20 },
    { name: "Champiñones", price: 1.00 },
    { name: "Cebolla", price: 0.80 },
    { name: "Atún", price: 1.50 },
    { name: "Pepperoni", price: 1.20 },
    { name: "Aceitunas", price: 0.80 },
    { name: "Huevo", price: 1.00 },
    { name: "Pollo", price: 1.80 },
    { name: "Salsa BBQ", price: 0.50 },
    { name: "Carne Picada", price: 1.20 },
    { name: "Jamón York", price: 1.00 },
];

interface CustomPizzaModalProps {
    isOpen: boolean;
    pizza: Product | null;
    onClose: () => void;
    onConfirm: (pizza: Product, customIngredients: string[], extraCost: number) => void;
}

export function CustomPizzaModal({ isOpen, pizza, onClose, onConfirm }: CustomPizzaModalProps) {
    const [removedBaseIngredients, setRemovedBaseIngredients] = useState<string[]>([]);
    const [addedExtraIngredients, setAddedExtraIngredients] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            setRemovedBaseIngredients([]);
            setAddedExtraIngredients([]);
        }
    }, [isOpen]);

    if (!isOpen || !pizza) return null;

    const handleConfirm = () => {
        const customIngredientsList = [
            ...removedBaseIngredients.map(ing => `SIN ${ing}`),
            ...addedExtraIngredients.map(ing => `+ ${ing.name}`)
        ];
        const extraCost = addedExtraIngredients.reduce((acc, ing) => acc + ing.price, 0);

        onConfirm(pizza, customIngredientsList, extraCost);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-end">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Personalizar {pizza.name}</h2>
                        <p className="text-sm font-medium text-slate-500 mt-1">Personaliza tu pizza a tu gusto</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-black text-indigo-600">
                            {(pizza.price + addedExtraIngredients.reduce((acc: number, ing: any) => acc + ing.price, 0)).toFixed(2)} &euro;
                        </div>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[60vh] bg-slate-50/50">
                    {pizza.ingredients && pizza.ingredients.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Quitar Ingredientes Base (Gratis)
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {pizza.ingredients.map((ing: string) => {
                                    const isRemoved = removedBaseIngredients.includes(ing);
                                    return (
                                        <button
                                            key={ing}
                                            onClick={() => {
                                                if (isRemoved) {
                                                    setRemovedBaseIngredients(prev => prev.filter(i => i !== ing));
                                                } else {
                                                    setRemovedBaseIngredients(prev => [...prev, ing]);
                                                }
                                            }}
                                            className={`px-4 py-2.5 rounded-xl border-2 font-bold text-[13px] transition-all flex items-center gap-2 shadow-sm ${isRemoved
                                                ? 'border-red-200 bg-red-50 text-red-500 line-through opacity-80'
                                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            {isRemoved && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>}
                                            {ing}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Añadir Extras (Tienen Coste)
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {EXTRA_INGREDIENTS.filter(ing => !(pizza.ingredients || []).includes(ing.name)).map(ing => {
                                const isAdded = addedExtraIngredients.some(i => i.name === ing.name);
                                return (
                                    <button
                                        key={ing.name}
                                        onClick={() => {
                                            if (isAdded) {
                                                setAddedExtraIngredients(prev => prev.filter(i => i.name !== ing.name));
                                            } else {
                                                setAddedExtraIngredients(prev => [...prev, ing]);
                                            }
                                        }}
                                        className={`p-3.5 rounded-xl border-2 font-bold text-sm transition-all text-left flex justify-between items-center shadow-sm ${isAdded
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-inner ring-2 ring-indigo-600/20'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md'
                                            }`}
                                    >
                                        <span className="truncate pr-2">{ing.name}</span>
                                        <span className={`text-xs px-2 py-1 rounded-md shrink-0 ${isAdded ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>+{ing.price.toFixed(2)}&euro;</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] relative z-10">
                    <button
                        onClick={onClose}
                        className="px-6 py-3.5 font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-8 py-3.5 font-bold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Confirmar y Añadir
                    </button>
                </div>
            </div>
        </div>
    );
}
