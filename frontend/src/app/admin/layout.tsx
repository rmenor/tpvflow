import Link from "next/link";
import {
    LayoutDashboard,
    Grid,
    Package,
    Users,
    Briefcase,
    ShoppingCart,
    LogOut,
} from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl">
                <div className="h-20 flex items-center justify-center border-b border-slate-800">
                    <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-sm">
                            TF
                        </span>
                        TpvFlow <span className="text-indigo-400 font-normal">Admin</span>
                    </h1>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-indigo-600 hover:shadow-md active:scale-95 text-slate-300 hover:text-white"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </Link>

                    <div className="pt-4 pb-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4">
                            Catálogo
                        </p>
                    </div>
                    <Link
                        href="/admin/categories"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800 text-slate-300 hover:text-white"
                    >
                        <Grid className="w-5 h-5" />
                        <span className="font-medium">Categorías</span>
                    </Link>
                    <Link
                        href="/admin/products"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800 text-slate-300 hover:text-white"
                    >
                        <Package className="w-5 h-5" />
                        <span className="font-medium">Productos</span>
                    </Link>

                    <div className="pt-4 pb-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4">
                            Operaciones
                        </p>
                    </div>
                    <Link
                        href="/admin/orders"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800 text-slate-300 hover:text-white"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span className="font-medium">Comandas</span>
                    </Link>
                    <Link
                        href="/admin/customers"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800 text-slate-300 hover:text-white"
                    >
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Clientes</span>
                    </Link>
                    <Link
                        href="/admin/employees"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800 text-slate-300 hover:text-white"
                    >
                        <Briefcase className="w-5 h-5" />
                        <span className="font-medium">Empleados</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Link
                        href="/tpv"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-800 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-semibold text-slate-400"
                    >
                        <LogOut className="w-4 h-4" />
                        Volver al TPV
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/50">
                <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between shadow-sm z-10">
                    <h2 className="text-xl font-bold tracking-tight text-gray-800">
                        Panel de Administración
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-semibold text-gray-900">
                                Admin User
                            </span>
                            <span className="text-xs text-gray-500">Administrador</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shadow-inner">
                            AD
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
