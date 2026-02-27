import Link from "next/link";
import { OrderItem } from "../../types";

interface HeaderProps {
    currentEmployee: any;
    onOpenEmployeeModal: () => void;
    cart: OrderItem[];
    onNavigateToListados: (e: React.MouseEvent) => void;
}

export function Header({ currentEmployee, onOpenEmployeeModal, cart, onNavigateToListados }: HeaderProps) {
    return (
        <header className="h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-10">
            <div className="flex items-center gap-6">
                <div className="font-black flex flex-col leading-none">
                    <span className="text-indigo-600 text-xl tracking-tighter">TpvFlow</span>
                    <span className="text-slate-400 text-xs tracking-widest uppercase">Pizza</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl">
                    <Link href="/tpv" className="px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 bg-white text-indigo-900 shadow-sm">
                        TPV
                    </Link>
                    <button onClick={onNavigateToListados} className="px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50">
                        Listados
                    </button>
                    <Link href="/reservas" className="px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50">
                        Reservas
                    </Link>
                </nav>
                <div className="w-px h-8 bg-slate-200 hidden lg:block"></div>
                <div
                    onClick={onOpenEmployeeModal}
                    className="flex items-center gap-3 bg-white border border-slate-200/80 pl-2 pr-4 py-1.5 rounded-full shadow-sm cursor-pointer hover:border-slate-300 transition-colors"
                >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${currentEmployee ? currentEmployee.color : 'from-slate-400 to-slate-500'} flex items-center justify-center text-white font-bold text-xs shadow-inner`}>
                        {currentEmployee ? currentEmployee.initials : 'TP'}
                    </div>
                    <span className="text-sm font-bold text-slate-700">{currentEmployee ? currentEmployee.name.split(' ')[0] : 'Bloqueado'}</span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
            </div>
        </header>
    );
}
