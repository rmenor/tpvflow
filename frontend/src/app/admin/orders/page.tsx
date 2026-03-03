"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Eye, FileText, Search, Trash2 } from "lucide-react";
import { API_URL } from "../../../config/api";
import { format } from "date-fns";

type Order = {
    id: string;
    ticketId: number;
    type: string;
    status: string;
    totalNeto?: number;
    total?: number;
    createdAt: string;
};

export default function OrdersAdminPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/orders`)
            .then((res) => res.json())
            .then((data) => {
                setOrders(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching orders:", err);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que quieres eliminar esta comanda?")) return;
        try {
            await fetch(`${API_URL}/api/orders/${id}`, { method: "DELETE" });
            setOrders(orders.filter((o) => o.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        <ShoppingCart className="w-8 h-8 text-indigo-500" />
                        Histórico de Comandas
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Revisa tickets pasados, cancelados o audita transacciones.
                    </p>
                </div>

                {/* Mock Search Bar */}
                <div className="relative w-full md:w-auto">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar ticket (#0000)"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white text-slate-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm font-semibold uppercase tracking-wider">
                                <th className="p-4">Ticket</th>
                                <th className="p-4">Fecha y Hora</th>
                                <th className="p-4">Tipo</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4 text-right">Total</th>
                                <th className="p-4 rounded-tr-2xl text-right">Detalle</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">
                                        Cargando histórico de comandas...
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">
                                        No hay comandas registradas.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-gray-400" />
                                                <span className="font-mono font-bold text-gray-900">#{order.ticketId}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${order.type === 'LOCAL' ? 'bg-slate-100 text-slate-800' : 'bg-emerald-100 text-emerald-800'
                                                }`}>
                                                {order.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-2 h-2 rounded-full ${order.status === 'PAGADO' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                                                <span className="text-sm font-medium text-gray-700">{order.status}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="font-bold text-gray-900">€{((order.totalNeto ?? order.total) || 0).toFixed(2)}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center gap-1 text-sm font-medium">
                                                    <Eye className="w-4 h-4" />
                                                    Ver
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(order.id)}
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
