"use client";

import { useEffect, useState } from "react";
import { CircleDollarSign, PackageSearch, Users, ShoppingBag } from "lucide-react";
import { API_URL } from "../../config/api";
import { isSameDay, startOfDay } from "date-fns";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        todayRevenue: 0,
        completedOrders: 0,
        productsCount: 0,
        employeesCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [ordersRes, productsRes, employeesRes] = await Promise.all([
                    fetch(`${API_URL}/api/orders`),
                    fetch(`${API_URL}/api/products`),
                    fetch(`${API_URL}/api/employees`)
                ]);

                const orders = await ordersRes.json();
                const products = await productsRes.json();
                const employees = await employeesRes.json();

                // Calculate stats
                const today = new Date();
                let revenue = 0;
                let completed = 0;

                if (Array.isArray(orders)) {
                    orders.forEach(order => {
                        const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();

                        // Si la orden está pagada, sumamos al total de completadas
                        if (order.status === 'PAGADO') {
                            completed++;
                            // Si además es de hoy, sumamos los ingresos
                            if (isSameDay(orderDate, today)) {
                                revenue += (order.totalNeto ?? order.total ?? order.totalBruto ?? 0);
                            }
                        }
                    });
                }

                setStats({
                    todayRevenue: revenue,
                    completedOrders: completed,
                    productsCount: Array.isArray(products) ? products.length : 0,
                    employeesCount: Array.isArray(employees) ? employees.length : 0
                });
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Resumen General
                </h1>
                <p className="text-gray-500">
                    Bienvenido al centro de control de TpvFlow.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Metric 1 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                            <CircleDollarSign className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-4xl font-extrabold text-gray-900">
                            {loading ? "..." : `€${stats.todayRevenue.toFixed(2)}`}
                        </p>
                        <p className="text-sm font-medium text-gray-500 mt-1">Ingresos de hoy</p>
                    </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-4xl font-extrabold text-gray-900">
                            {loading ? "..." : stats.completedOrders}
                        </p>
                        <p className="text-sm font-medium text-gray-500 mt-1">Comandas completadas</p>
                    </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                            <PackageSearch className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-4xl font-extrabold text-gray-900">
                            {loading ? "..." : stats.productsCount}
                        </p>
                        <p className="text-sm font-medium text-gray-500 mt-1">Productos en carta</p>
                    </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-4xl font-extrabold text-gray-900">
                            {loading ? "..." : stats.employeesCount}
                        </p>
                        <p className="text-sm font-medium text-gray-500 mt-1">Empleados activos</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mt-12 bg-gradient-to-br from-indigo-50 to-white">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Conexión con la Base de Datos</h2>
                <p className="text-gray-600 max-w-lg mx-auto">Estas métricas se alimentan en tiempo real de tu base de datos de Supabase. El sistema TPV completo está operativo.</p>
            </div>

        </div>
    );
}
