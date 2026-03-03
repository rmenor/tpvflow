import { ShoppingCart, Eye, FileText, Search, SettingsTabs } from "lucide-react";

export default function OrdersAdminPage() {
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
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition-all"
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
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        <span className="font-mono font-bold text-gray-900">#3204</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    14 Feb 2026, 20:45
                                </td>
                                <td className="p-4">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800">
                                        DOMICILIO
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-sm font-medium text-gray-700">PAGADO</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <span className="font-bold text-gray-900">€24.50</span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center gap-1 text-sm font-medium">
                                        <Eye className="w-4 h-4" />
                                        Ver
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors bg-gray-50/30">
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        <span className="font-mono font-bold text-gray-900">#3203</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    14 Feb 2026, 20:10
                                </td>
                                <td className="p-4">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800">
                                        LOCAL
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                        <span className="text-sm font-medium text-gray-700">EN PROGRESO</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <span className="font-bold text-gray-900">€9.00</span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center gap-1 text-sm font-medium">
                                        <Eye className="w-4 h-4" />
                                        Ver
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
