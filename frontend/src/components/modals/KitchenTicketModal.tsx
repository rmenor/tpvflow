interface KitchenTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
    onPrint: () => void;
}

export function KitchenTicketModal({ isOpen, onClose, order, onPrint }: KitchenTicketModalProps) {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:p-0 print:block print:bg-white">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm print:hidden" onClick={onClose}></div>

            <div className="relative w-full max-w-[420px] bg-[#fdfbf7] border-t-8 border-indigo-600 rounded-b-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col font-mono text-slate-900 p-8 print:max-w-none print:w-full print:border-none print:shadow-none print:rounded-none">
                <div className="mb-4 pt-2 border-b-2 border-dashed border-slate-300 pb-4">
                    <h2 className="text-3xl font-black text-center mb-2 uppercase break-words leading-tight">COMANDA COCINA</h2>
                    <div className="text-center font-bold text-xl uppercase tracking-wider mb-2">
                        {order.orderType === "DOMICILIO" ? "DOMICILIO" : "LOCAL"}
                    </div>
                    <div className="text-center text-sm font-bold opacity-80">
                        Ticket: #{order.id.slice(-4)}
                    </div>
                </div>

                {order.tableNumber && (
                    <div className="text-center mb-6 text-xl p-3 bg-slate-200/50 rounded-xl font-black border border-slate-300 shadow-inner">
                        MESA: {order.tableNumber} | PAX: {order.dinersCount}
                    </div>
                )}

                <div className="flex-1 overflow-auto no-scrollbar mb-6 min-h-[150px]">
                    <table className="w-full text-lg text-left font-bold">
                        <thead>
                            <tr className="border-b-2 border-slate-300">
                                <th className="pb-2 w-12 text-center">Un.</th>
                                <th className="pb-2 text-left">Artículo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {order.items.map((item: any, idx: number) => (
                                <tr key={idx} className="align-top">
                                    <td className="py-4 text-center text-2xl font-black">{item.quantity}</td>
                                    <td className="py-4 pr-2">
                                        <div className="text-xl uppercase font-black tracking-tight leading-none">{item.name}</div>
                                        {item.customIngredients && item.customIngredients.length > 0 && (
                                            <div className="text-sm font-black text-indigo-700 leading-tight mt-1.5 p-1.5 bg-indigo-50/50 rounded-md border border-indigo-100">
                                                {item.customIngredients.join(', ')}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto print:hidden">
                    <button
                        onClick={onClose}
                        className="py-3 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-xl shadow-sm transition-colors border border-slate-200"
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={onPrint}
                        className="py-3 bg-indigo-600 text-white font-black rounded-xl shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Imprimir
                    </button>
                </div>
            </div>
        </div>
    );
}
