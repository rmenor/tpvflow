"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Edit2, Trash2, MapPin, Phone } from "lucide-react";
import { API_URL } from "../../../config/api";
import CustomerModal from "../../../components/modals/admin/CustomerModal";

type Customer = {
    id: string;
    name: string;
    phone: string | null;
    address: string | null;
    points: number;
};

export default function CustomersAdminPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Customer | null>(null);

    const handleSave = async (data: Omit<Customer, 'id'> & { id?: string }) => {
        try {
            const method = data.id ? 'PUT' : 'POST';
            const url = data.id ? `${API_URL}/api/customers/${data.id}` : `${API_URL}/api/customers`;
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Error al guardar');
            const savedItem = await res.json();
            if (data.id) {
                setCustomers(customers.map(c => c.id === savedItem.id ? savedItem : c));
            } else {
                setCustomers([...customers, savedItem]);
            }
            setIsModalOpen(false);
            setEditingItem(null);
        } catch (err) {
            console.error(err);
            alert('Error al guardar');
        }
    };

    const handleEdit = (customer: Customer) => {
        setEditingItem(customer);
        setIsModalOpen(true);
    };

    useEffect(() => {
        fetch(`${API_URL}/api/customers`)
            .then((res) => res.json())
            .then((data) => {
                setCustomers(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching customers:", err);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que quieres eliminar este cliente?")) return;
        try {
            await fetch(`${API_URL}/api/customers/${id}`, { method: "DELETE" });
            setCustomers(customers.filter((c) => c.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        <Users className="w-8 h-8 text-indigo-500" />
                        Base de Datos de Clientes
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Gestiona la información de tus clientes y sus direcciones de envío.
                    </p>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-colors active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Añadir Cliente
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm font-semibold uppercase tracking-wider">
                                <th className="p-4">Cliente</th>
                                <th className="p-4">Contacto</th>
                                <th className="p-4 text-center">Puntos</th>
                                <th className="p-4 rounded-tr-2xl text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400">
                                        Cargando clientes...
                                    </td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400">
                                        No hay clientes registrados.
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-semibold text-gray-900">{customer.name}</p>
                                            {customer.address && (
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {customer.address}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {customer.phone && (
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    {customer.phone}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
                                                {customer.points} pts
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(customer)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(customer.id)}
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

            <CustomerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingItem}
            />
        </div>
    );
}
