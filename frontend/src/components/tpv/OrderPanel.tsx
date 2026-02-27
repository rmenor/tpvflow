import { Customer, OrderItem } from "../../types";

interface OrderPanelProps {
    orderType: "LOCAL" | "DOMICILIO";
    setOrderType: React.Dispatch<React.SetStateAction<"LOCAL" | "DOMICILIO">>;
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    cart: OrderItem[];
    addToCart: (item: OrderItem) => void;
    removeFromCart: (item: OrderItem) => void;
    selectedClient: Customer | null;
    deselectClient: () => void;
    setIsClientModalOpen: (open: boolean) => void;
    setIsNewClientModalOpen: (open: boolean) => void;
    tableNumber: string;
    setTableNumber: React.Dispatch<React.SetStateAction<string>>;
    dinersCount: number;
    setDinersCount: React.Dispatch<React.SetStateAction<number>>;
    total: number;
    onParkOrder: () => void;
    onConfirmPayment: () => void;
}

export function OrderPanel({
    orderType, setOrderType, activeTab, setActiveTab, cart, addToCart, removeFromCart,
    selectedClient, deselectClient, setIsClientModalOpen, setIsNewClientModalOpen,
    tableNumber, setTableNumber, dinersCount, setDinersCount, total,
    onParkOrder, onConfirmPayment
}: OrderPanelProps) {

    return (
        <div className="w-[320px] bg-white border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-10 shrink-0 print:hidden">
            {/* Cabecera del Sidebar */}
            <div className="p-4 pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Orden en curso</p>
                        <h1 className="text-xl font-black tracking-tight text-slate-900">Ticket #Nuevo</h1>
                    </div>
                    <button
                        onClick={() => setOrderType(prev => prev === "LOCAL" ? "DOMICILIO" : "LOCAL")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${orderType === "LOCAL"
                            ? "bg-indigo-50/80 text-indigo-600 hover:bg-indigo-100"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse transition-colors ${orderType === "LOCAL" ? "bg-indigo-500" : "bg-amber-500"}`}></span>
                        {orderType}
                    </button>
                </div>

                {/* Selector Segmentado Moderno */}
                <div className="flex bg-slate-100/80 p-1 rounded-2xl">
                    {["COMANDA", "CLIENTE", "MESA"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${activeTab === tab
                                ? "bg-white text-indigo-900 shadow-sm transform scale-[1.02]"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Contenido Dinámico del Sidebar según el Tab */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-50/30">

                {/* TAB COMANDA */}
                {activeTab === "COMANDA" && (
                    <>
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-60">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                                    <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-semibold text-slate-500">Añade productos a la orden</p>
                            </div>
                        ) : (
                            cart.map((item, idx) => (
                                <div key={idx} className="flex flex-col mb-1 group transition-all bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 pr-3">
                                            <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1">{item.name}</h3>
                                            {item.customIngredients && item.customIngredients.length > 0 && (
                                                <p className="text-[10px] text-slate-500 font-semibold leading-tight line-clamp-2 mb-1.5 flex flex-wrap gap-1">
                                                    {item.customIngredients.map((ing: string, i: number) => (
                                                        <span key={i} className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-md border border-amber-100">+ {ing}</span>
                                                    ))}
                                                </p>
                                            )}
                                            <p className="text-indigo-600 font-black text-xs">{item.price.toFixed(2)} &euro;</p>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <div className="text-right font-black text-slate-900 text-[15px]">
                                                {(item.price * item.quantity).toFixed(2)} <span className="text-[11px] text-slate-400">&euro;</span>
                                            </div>

                                            {/* Controles de Cantidad */}
                                            <div className="flex items-center gap-2 bg-white rounded-full p-1 border border-slate-200/60 shadow-sm transition-all group-hover:border-indigo-100">
                                                <button
                                                    onClick={() => removeFromCart(item)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg>
                                                </button>
                                                <span className="w-5 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                                                <button
                                                    onClick={() => addToCart(item)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                )}

                {/* TAB CLIENTE */}
                {activeTab === "CLIENTE" && (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Tarjeta de Cliente Actual */}
                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-4 rounded-2xl shadow-lg shadow-indigo-600/20 mb-4">
                            <div className="flex items-center justify-between mb-4 opacity-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex flex-shrink-0 items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-100">Cliente Asignado</span>
                                </div>
                                {/* Botón para Desmarcar Cliente */}
                                {selectedClient && selectedClient.name !== "Sin nombre" && (
                                    <button
                                        onClick={deselectClient}
                                        className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white hover:text-indigo-600 transition-colors"
                                        title="Desmarcar cliente"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                )}
                            </div>

                            <h2 className="text-2xl font-black tracking-tight mb-2 truncate">{selectedClient?.name || "Sin nombre"}</h2>

                            <div className="space-y-2">
                                <div className="flex items-start gap-2 text-indigo-100">
                                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <p className="text-sm leading-snug font-medium line-clamp-2">{selectedClient?.address || "Sin dirección"}</p>
                                </div>
                                {selectedClient?.phone && (
                                    <div className="flex items-start gap-2 text-indigo-100">
                                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        <p className="text-sm leading-snug font-medium line-clamp-2">{selectedClient.phone}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Acciones de Cliente */}
                        <div className="space-y-3 mt-2">
                            <button
                                onClick={() => setIsClientModalOpen(true)}
                                className="w-full bg-white border border-slate-200/80 p-4 rounded-2xl text-slate-700 font-bold hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-md flex items-center justify-between transition-all group"
                            >
                                <span className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    </div>
                                    Seleccionar Cliente
                                </span>
                                <svg className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>

                            <button
                                onClick={() => setIsNewClientModalOpen(true)}
                                className="w-full bg-white border border-slate-200/80 p-4 rounded-2xl text-slate-700 font-bold hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-md flex items-center justify-between transition-all group"
                            >
                                <span className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 text-slate-400 group-hover:border-indigo-600 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                    </div>
                                    Nuevo Cliente
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                {/* TAB MESA */}
                {activeTab === "MESA" && (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white border text-center border-slate-200/80 pt-6 pb-4 px-4 rounded-2xl mb-2 shadow-sm flex-1 flex flex-col justify-start">
                            <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">Número de Mesa</h3>
                            <div className="flex justify-center mb-4">
                                <input
                                    type="text"
                                    value={tableNumber}
                                    readOnly
                                    placeholder="0"
                                    className="w-20 h-20 text-center text-[36px] font-black text-indigo-700 bg-indigo-50/50 rounded-2xl border border-indigo-100 placeholder:text-indigo-200 transition-all shadow-inner"
                                />
                            </div>

                            {/* Pad numérico táctil */}
                            <div className="grid grid-cols-3 gap-2 px-2 mb-6">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setTableNumber(prev => prev.length < 3 ? prev + num : prev)}
                                        className="h-12 bg-slate-100 rounded-xl font-black text-xl hover:bg-slate-200 active:scale-95 transition-all text-slate-700 shadow-sm border border-slate-200/60"
                                    >
                                        {num}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setTableNumber("")}
                                    className="h-12 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 active:scale-95 transition-all shadow-sm border border-red-100 flex items-center justify-center"
                                >
                                    DEL
                                </button>
                                <button
                                    onClick={() => setTableNumber(prev => prev.length < 3 ? prev + "0" : prev)}
                                    className="h-12 bg-slate-100 rounded-xl font-black text-xl hover:bg-slate-200 active:scale-95 transition-all text-slate-700 shadow-sm border border-slate-200/60"
                                >
                                    0
                                </button>
                                <button
                                    onClick={() => setTableNumber(prev => prev.slice(0, -1))}
                                    className="h-12 bg-amber-50 rounded-xl hover:bg-amber-100 active:scale-95 transition-all text-amber-600 shadow-sm flex items-center justify-center font-bold border border-amber-100"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" /></svg>
                                </button>
                            </div>

                            <div className="w-full h-px bg-slate-100 mb-4"></div>

                            <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">Comensales</h3>
                            <div className="flex items-center justify-center gap-6">
                                <button
                                    onClick={() => setDinersCount(Math.max(1, dinersCount - 1))}
                                    className="w-14 h-14 rounded-[16px] bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 hover:shadow-sm flex items-center justify-center transition-all text-3xl font-black active:scale-95 border border-slate-200/80"
                                >
                                    -
                                </button>
                                <span className="text-[36px] font-black text-slate-800 w-16 text-center">{dinersCount}</span>
                                <button
                                    onClick={() => setDinersCount(dinersCount + 1)}
                                    className="w-14 h-14 rounded-[16px] bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 hover:shadow-sm flex items-center justify-center transition-all text-3xl font-black active:scale-95 border border-indigo-100"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Zona de Pago (Footer) */}
            <div className="p-4 bg-white border-t border-slate-100 relative z-20 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-end mb-4">
                    <span className="text-slate-500 font-bold uppercase text-xs tracking-wider">Total a pagar</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tight">{total.toFixed(2)} <span className="text-lg text-slate-400">&euro;</span></span>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onParkOrder}
                        disabled={cart.length === 0}
                        className={`w-1/3 relative overflow-hidden group rounded-[20px] py-4.5 font-bold text-base shadow-lg flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.98] ${cart.length === 0
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                            : "bg-white border border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600 focus:ring-4 focus:ring-slate-100"
                            }`}
                        title="Aparcar Comanda"
                    >
                        <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                        <span className="relative z-10 text-[11px] uppercase tracking-wider">Aparcar</span>
                    </button>

                    <button
                        onClick={onConfirmPayment}
                        disabled={cart.length === 0}
                        className={`w-2/3 relative overflow-hidden group rounded-[20px] py-4.5 font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${cart.length === 0
                            ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                            : "bg-indigo-600 text-white shadow-indigo-600/25 hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-100"
                            }`}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                        <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <span className="relative z-10">Cobrar Pedido</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
