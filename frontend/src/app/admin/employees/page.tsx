"use client";

import { useEffect, useState } from "react";
import { Briefcase, Plus, Edit2, Trash2 } from "lucide-react";
import { API_URL } from "../../../config/api";

type Employee = {
    id: string;
    name: string;
    initials: string;
    pin: string;
    role: string;
    color: string;
};

export default function EmployeesAdminPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/employees`)
            .then((res) => res.json())
            .then((data) => {
                setEmployees(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching employees:", err);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que quieres eliminar este empleado?")) return;
        try {
            await fetch(`${API_URL}/api/employees/${id}`, { method: "DELETE" });
            setEmployees(employees.filter((e) => e.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        <Briefcase className="w-8 h-8 text-indigo-500" />
                        Control de Empleados
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Gestiona los accesos, PINs y roles de tu personal.
                    </p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-colors active:scale-95">
                    <Plus className="w-5 h-5" />
                    Nuevo Empleado
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm font-semibold uppercase tracking-wider">
                                <th className="p-4">Staff</th>
                                <th className="p-4">Rol</th>
                                <th className="p-4 text-center">PIN</th>
                                <th className="p-4 rounded-tr-2xl text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400">
                                        Cargando empleados...
                                    </td>
                                </tr>
                            ) : employees.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400">
                                        No hay empleados registrados.
                                    </td>
                                </tr>
                            ) : (
                                employees.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                                                    style={{ backgroundColor: employee.color || '#4f46e5' }}
                                                >
                                                    {employee.initials}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{employee.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
                                                {employee.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="font-mono text-gray-600 tracking-widest text-sm bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                                                {employee.pin}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(employee.id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
