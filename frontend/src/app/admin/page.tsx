import { CircleDollarSign, PackageSearch, Users, ShoppingBag } from "lucide-react";

export default function AdminDashboardPage() {
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
                        <p className="text-4xl font-extrabold text-gray-900">€2,450</p>
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
                        <p className="text-4xl font-extrabold text-gray-900">124</p>
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
                        <p className="text-4xl font-extrabold text-gray-900">32</p>
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
                        <p className="text-4xl font-extrabold text-gray-900">4</p>
                        <p className="text-sm font-medium text-gray-500 mt-1">Empleados activos</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mt-12 bg-gradient-to-br from-indigo-50 to-white">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuración Inicial Exitosa</h2>
                <p className="text-gray-600 max-w-lg mx-auto">Selecciona una de las opciones del menú lateral para administrar tus catálogos u operaciones del restaurante.</p>
            </div>

        </div>
    );
}
