import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

type Employee = {
    id?: string;
    name: string;
    initials: string;
    pin: string;
    role: string;
    color: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Employee) => void;
    initialData?: Employee | null;
};

const COLORS = [
    "#4f46e5", "#ec4899", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"
];

export default function EmployeeAdminModal({ isOpen, onClose, onSave, initialData }: Props) {
    const [name, setName] = useState("");
    const [initials, setInitials] = useState("");
    const [pin, setPin] = useState("");
    const [role, setRole] = useState("Camarero");
    const [color, setColor] = useState(COLORS[0]);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setInitials(initialData.initials);
            setPin(initialData.pin);
            setRole(initialData.role);
            setColor(initialData.color || COLORS[0]);
        } else {
            setName("");
            setInitials("");
            setPin("");
            setRole("Camarero");
            setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
        }
    }, [initialData, isOpen]);

    // Handle auto-initials
    useEffect(() => {
        if (!initialData && name && !initials) {
            const parts = name.split(" ");
            if (parts.length >= 2) {
                setInitials(parts[0][0].toUpperCase() + parts[1][0].toUpperCase());
            } else {
                setInitials(name.substring(0, 2).toUpperCase());
            }
        }
    }, [name, initialData, initials]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: initialData?.id,
            name,
            initials: initials || name.substring(0, 2).toUpperCase(),
            pin,
            role,
            color,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-slate-800">
                        {initialData ? "Editar Empleado" : "Nuevo Empleado"}
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
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            placeholder="Ej. Carlos Perez"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
                            <select
                                required
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            >
                                <option value="Administrador">Administrador</option>
                                <option value="Camarero">Camarero</option>
                                <option value="Repartidor">Repartidor</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">PIN de Acceso</label>
                            <input
                                type="text"
                                required
                                maxLength={4}
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow tracking-widest font-mono"
                                placeholder="0000"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Iniciales (Avatar)</label>
                            <input
                                type="text"
                                required
                                maxLength={2}
                                value={initials}
                                onChange={(e) => setInitials(e.target.value.toUpperCase())}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow font-mono"
                                placeholder="CP"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Color (Avatar)</label>
                            <div className="flex gap-2 mt-2">
                                {COLORS.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c ? 'border-gray-800 scale-110' : 'border-transparent hover:scale-105'}`}
                                        style={{ backgroundColor: c }}
                                        onClick={() => setColor(c)}
                                    />
                                ))}
                            </div>
                        </div>
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
