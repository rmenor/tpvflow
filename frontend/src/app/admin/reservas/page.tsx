"use client";

import { useEffect, useState } from "react";
import { Calendar, Trash2, Search, FileText } from "lucide-react";
import { API_URL } from "../../../config/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Reservation = {
    id: string;
    ticketId: number;
    type: string;
    status: string;
    date: string;
    time: string;
    tableNumber: string;
    dinersCount: number;
    customer?: { name: string, phone: string };
    createdAt: string;
};

export default function ReservasAdminPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/orders?status=reservado`)
            .then((res) => res.json())
            .then((data) => {
                setReservations(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching reservations:", err);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que quieres eliminar esta reserva?")) return;
        try {
            await fetch(`${API_URL}/api/orders/${id}`, { method: "DELETE" });
            setReservations(reservations.filter((r) => r.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-indigo-500" />
                        Gestión de Reservas
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Administra y audita las reservas de las mesas de tu restaurante.
                    </p>
                </div>

                <div className="relative w-full md:w-auto">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar reserva..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm font-semibold uppercase tracking-wider">
                                <th className="p-4">Fecha/Hora</th>
                                <th className="p-4">Cliente</th>
                                <th className="p-4">Mesa</th>
                                <th className="p-4">Comensales</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4 rounded-tr-2xl text-right">Detalle</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">
                                        Cargando reservas...
                                    </td>
                                </tr>
                            ) : reservations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">
                                        No hay reservas activas en la base de datos.
                                    </td>
                                </tr>
                            ) : (
                                reservations.map((res) => (
                                    <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">
                                                    {res.date ? format(new Date(res.date), "dd MMM yyyy", { locale: es }) : "Sin fecha"}
                                                </span>
                                                <span className="text-sm text-indigo-600 font-semibold">{res.time || "Sin hora"}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">{res.customer?.name || "Sin Nombre"}</span>
                                                <span className="text-sm text-gray-500">{res.customer?.phone || ""}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-black bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                Mesa {res.tableNumber}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-gray-700 font-medium">
                                                {res.dinersCount} px
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800">
                                                RESERVADA
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleDelete(res.id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                    title="Eliminar reserva"
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
