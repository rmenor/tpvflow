import { useState } from "react";
import { Customer, OrderItem } from "../../types";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    total: number;
    onConfirmPayment: (method: "EFECTIVO" | "TARJETA", tendered: string) => void;
}

export function PaymentModal({ isOpen, onClose, total, onConfirmPayment }: PaymentModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<"EFECTIVO" | "TARJETA">("EFECTIVO");
    const [tenderedAmount, setTenderedAmount] = useState<string>("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col sm:flex-row">
                {/* Panel Izquierdo: Resumen y Cambio */}
                <div className="w-full sm:w-2/5 bg-slate-50 p-8 border-r border-slate-100 flex flex-col">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total a Pagar</h2>
                    <div className="text-4xl font-black text-slate-900 tracking-tight mb-8">
                        {total.toFixed(2)} <span className="text-2xl text-slate-400">&euro;</span>
                    </div>

                    <div className="flex-1">
                        {paymentMethod === "EFECTIVO" && (
                            <div className="animate-in fade-in duration-300">
                                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Entregado</h2>
                                <div className="text-3xl font-black text-indigo-600 tracking-tight mb-6">
                                    {tenderedAmount ? Number(tenderedAmount).toFixed(2) : "0.00"} <span className="text-xl text-indigo-400">&euro;</span>
                                </div>

                                <div className="h-px w-full bg-slate-200 mb-6"></div>

                                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Cambio</h2>
                                <div className={`text-4xl font-black tracking-tight ${Number(tenderedAmount) >= total ? "text-emerald-500" : "text-slate-300"}`}>
                                    {tenderedAmount && Number(tenderedAmount) >= total ? (Number(tenderedAmount) - total).toFixed(2) : "0.00"} <span className="text-2xl opacity-60">&euro;</span>
                                </div>
                            </div>
                        )}

                        {paymentMethod === "TARJETA" && (
                            <div className="animate-in fade-in duration-300 h-full flex flex-col justify-center items-center text-center opacity-60">
                                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                </div>
                                <p className="font-bold text-slate-500">Pago por datáfono</p>
                                <p className="text-sm font-medium text-slate-400 mt-1">No requiere cálculo de cambio</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Panel Derecho: Métodos y Teclado */}
                <div className="w-full sm:w-3/5 bg-white p-8 flex flex-col">
                    {/* Selector de Método */}
                    <div className="flex bg-slate-100/80 p-1.5 rounded-[20px] mb-8">
                        <button
                            onClick={() => setPaymentMethod("EFECTIVO")}
                            className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${paymentMethod === "EFECTIVO"
                                ? "bg-white text-indigo-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            Efectivo
                        </button>
                        <button
                            onClick={() => {
                                setPaymentMethod("TARJETA");
                                setTenderedAmount("");
                            }}
                            className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${paymentMethod === "TARJETA"
                                ? "bg-white text-indigo-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            Tarjeta
                        </button>
                    </div>

                    {paymentMethod === "EFECTIVO" ? (
                        <>
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {[5, 10, 20, 50].map((bill) => (
                                    <button
                                        key={bill}
                                        onClick={() => setTenderedAmount(bill.toString())}
                                        className="py-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-200 border border-emerald-100 font-bold rounded-[16px] text-lg transition-colors flex flex-col items-center justify-center"
                                    >
                                        <span className="text-xs opacity-60 mb-0.5">Billete</span>
                                        {bill}&euro;
                                    </button>
                                ))}
                            </div>

                            {/* Teclado Numérico Custom */}
                            <div className="grid grid-cols-3 gap-2 flex-1 mb-6">
                                {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "C"].map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            if (key === "C") {
                                                setTenderedAmount("");
                                            } else if (key === ".") {
                                                if (!tenderedAmount.includes(".")) setTenderedAmount(prev => prev + key);
                                            } else {
                                                if (tenderedAmount.length < 6) setTenderedAmount(prev => prev + key);
                                            }
                                        }}
                                        className={`py-3 text-xl font-bold rounded-[16px] transition-alls flex items-center justify-center ${key === "C" ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-slate-50 border border-slate-100 text-slate-700 hover:bg-slate-100"
                                            }`}
                                    >
                                        {key === "C" ? (
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" /></svg>
                                        ) : key}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center gap-4 mb-6">
                            <div className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[20px] p-8 text-center flex flex-col items-center justify-center">
                                <span className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                    <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </span>
                                <p className="text-slate-500 font-bold mb-1">Pase la tarjeta por el lector</p>
                                <p className="text-slate-400 font-medium text-sm">Esperando conformación del TPV datáfono...</p>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 mt-auto">
                        <button
                            onClick={onClose}
                            className="w-1/3 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-[20px] hover:bg-slate-50 hover:border-slate-300 transition-colors"
                        >
                            Atrás
                        </button>
                        <button
                            disabled={paymentMethod === "EFECTIVO" && Number(tenderedAmount) < total}
                            onClick={() => onConfirmPayment(paymentMethod, tenderedAmount)}
                            className={`flex-1 py-4 font-bold rounded-[20px] shadow-lg transition-colors flex items-center justify-center gap-2 ${(paymentMethod === "EFECTIVO" && Number(tenderedAmount) < total)
                                ? 'bg-indigo-300 text-white shadow-none cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/25'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            Confirmar Cobro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
