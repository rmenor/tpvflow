import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

type Category = {
    id?: string;
    name: string;
    order: number | null;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Category) => void;
    initialData?: Category | null;
};

export default function CategoryModal({ isOpen, onClose, onSave, initialData }: Props) {
    const [name, setName] = useState("");
    const [order, setOrder] = useState<number | "">("");

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setOrder(initialData.order ?? "");
        } else {
            setName("");
            setOrder("");
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: initialData?.id,
            name,
            order: order === "" ? null : Number(order),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-slate-800">
                        {initialData ? "Editar Categoría" : "Nueva Categoría"}
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
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            placeholder="Ej. Entrantes"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Orden de visualización (opcional)</label>
                        <input
                            type="number"
                            value={order}
                            onChange={(e) => setOrder(e.target.value === "" ? "" : Number(e.target.value))}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            placeholder="Ej. 1"
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
