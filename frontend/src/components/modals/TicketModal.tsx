import { Customer, OrderItem } from "../../types";

interface TicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderType: "LOCAL" | "DOMICILIO";
    tableNumber: string;
    dinersCount: number;
    cart: OrderItem[];
    total: number;
    onPrint: () => void;
}

export function TicketModal({ isOpen, onClose, orderType, tableNumber, dinersCount, cart, total, onPrint }: TicketModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:p-0 print:block print:bg-white">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm print:hidden" onClick={onClose}></div>

            <div className="relative w-full max-w-[420px] bg-[#0E7D42] rounded-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col font-mono text-white p-8 print:max-w-none print:w-full print:border-none print:shadow-none print:rounded-none print:bg-white print:text-black">
                {/* Cabecera del Recibo */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black mb-1">TpvFlow - Gandía</h2>
                    <p className="text-sm font-bold opacity-90"></p>
                    <p className="text-xs opacity-80 mt-1">C.I.F: 1234567-J - Telf: 999999999</p>
                    <p className="text-xs opacity-80">Calle Falsa, 123</p>
                    <p className="text-xs opacity-80 mb-2">46700 Gandía</p>

                    <div className="mt-4 pt-4 border-t-2 border-dashed border-white/30">
                        <h3 className="text-xl font-bold">Factura simplificada</h3>
                        <h3 className="text-xl font-bold mt-1">Ticket: Nuevo</h3>
                        <div className="flex justify-between items-center mt-2 text-sm opacity-90 font-bold">
                            <span>{new Date().toLocaleDateString('es-ES')}</span>
                            <span>{new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                </div>

                <div className="text-center bg-white/20 py-2 font-black text-xl mb-6 uppercase tracking-wider">
                    {orderType === "DOMICILIO" ? "ENVIO A DOMICILIO" : "RECOGE EN LOCAL"}
                </div>

                {tableNumber && (
                    <div className="text-center mb-6 text-sm font-bold bg-white/10 py-1.5 border-y border-white/20">
                        MESA: {tableNumber} | COMENSALES: {dinersCount}
                    </div>
                )}

                {/* Lista de Compra */}
                <div className="flex-1 overflow-auto no-scrollbar mb-6 min-h-[150px]">
                    <table className="w-full text-sm text-left font-bold">
                        <thead>
                            <tr className="border-b-2 border-white/40">
                                <th className="pb-2 w-12">Ca.</th>
                                <th className="pb-2">Artículo</th>
                                <th className="pb-2 text-right">Importe</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/20">
                            {cart.map((item, idx) => (
                                <tr key={idx} className="align-top">
                                    <td className="py-2.5">{item.quantity}</td>
                                    <td className="py-2.5 max-w-[120px] pr-2">
                                        <div className="truncate">{item.name}</div>
                                        {item.customIngredients && item.customIngredients.length > 0 && (
                                            <div className="text-[10px] opacity-70 font-medium leading-tight mt-0.5">
                                                {item.customIngredients.map(i => i.startsWith('+') ? i : `SIN ${i}`).join(', ')}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-2.5 text-right font-black">{(item.price * item.quantity).toFixed(2)} &euro;</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Total */}
                <div className="pt-4 border-t-2 border-dashed border-white/40text-right mb-8">
                    <div className="flex justify-between items-end">
                        <span className="text-sm font-bold opacity-90">(IVA incluido)</span>
                        <span className="text-2xl font-black">Total: {total.toFixed(2)} &euro;</span>
                    </div>
                </div>

                <div className="text-center font-bold text-lg mb-8 tracking-wide">
                    GRACIAS POR SU VISITA
                </div>

                {/* Acciones */}
                <div className="grid grid-cols-2 gap-3 mt-auto print:hidden">
                    <button
                        onClick={onClose}
                        className="py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded shadow-none transition-colors border border-white/30"
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={onPrint}
                        className="py-3 bg-white text-[#0E7D42] font-black rounded shadow-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Imprimir
                    </button>
                </div>
            </div>
        </div>
    );
}
