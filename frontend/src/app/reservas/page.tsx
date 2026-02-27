"use client";

import { useState } from "react";
import Link from "next/link";

interface Reservation {
    id: string;
    date: string;
    time: string;
    name: string;
    partySize: number;
    tableNumber: string;
    phone: string;
}

export default function ReservasPage() {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [reservations, setReservations] = useState<Reservation[]>([
        {
            id: "1",
            date: new Date().toISOString().split("T")[0],
            time: "14:00",
            name: "Juan Pérez",
            partySize: 4,
            tableNumber: "1",
            phone: "600 123 456",
        },
        {
            id: "2",
            date: new Date().toISOString().split("T")[0],
            time: "21:30",
            name: "Maria García",
            partySize: 2,
            tableNumber: "5",
            phone: "611 987 654",
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newReservation, setNewReservation] = useState<{
        time: string;
        name: string;
        partySize: number;
        tableNumber: string;
        phone: string;
    }>({
        time: "14:00",
        name: "",
        partySize: 2,
        tableNumber: "",
        phone: "",
    });

    const dailyReservations = reservations.filter((r) => r.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time));

    const handleSaveReservation = () => {
        if (!newReservation.name || !newReservation.time || !newReservation.tableNumber) return;

        const newRes: Reservation = {
            id: Date.now().toString(),
            date: selectedDate,
            ...newReservation,
        };

        setReservations((prev) => [...prev, newRes]);
        setIsModalOpen(false);
        setNewReservation({
            time: "14:00",
            name: "",
            partySize: 2,
            tableNumber: "",
            phone: "",
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100">
            {/* Header */}
            <header className="h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-10">
                <div className="flex items-center gap-6">
                    <div className="font-black flex flex-col leading-none">
                        <span className="text-indigo-600 text-xl tracking-tighter">TpvFlow</span>
                        <span className="text-slate-400 text-xs tracking-widest uppercase">Pizza</span>
                    </div>
                </div>
                <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl">
                    <Link href="/tpv" className="px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50">
                        TPV
                    </Link>
                    <Link href="/listados" className="px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50">
                        Listados
                    </Link>
                    <span className="px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 bg-white text-indigo-900 shadow-sm">
                        Reservas
                    </span>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar / Date Selector */}
                <aside className="w-80 bg-white border-r border-slate-200/60 p-6 flex flex-col gap-6">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 mb-2">Calendario</h2>
                        <p className="text-sm font-medium text-slate-500 mb-4">Selecciona una fecha para ver o añadir reservas.</p>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex-1 flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-indigo-600">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-indigo-900 mb-1">Día seleccionado</h3>
                        <p className="text-indigo-700/80 text-sm font-medium">{new Date(selectedDate).toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                        <div className="mt-4 pt-4 border-t border-indigo-200/50 w-full">
                            <span className="text-3xl font-black text-indigo-600">{dailyReservations.length}</span>
                            <span className="text-indigo-700/80 font-bold ml-2">Reservas</span>
                        </div>
                    </div>
                </aside>

                {/* Reservations List */}
                <section className="flex-1 p-8 overflow-y-auto bg-slate-50/50">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reservas del día</h1>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                                Nueva Reserva
                            </button>
                        </div>

                        {dailyReservations.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/60 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">No hay reservas</h3>
                                <p className="text-slate-500 font-medium max-w-sm">No se han encontrado reservas para este día. Haz clic en "Nueva Reserva" para añadir una.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {dailyReservations.map((res) => (
                                    <div key={res.id} className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110"></div>

                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-indigo-600 text-white font-black text-xl px-4 py-2 rounded-2xl shadow-sm">
                                                {res.time}
                                            </div>
                                            <div className="bg-slate-100 text-slate-600 font-bold px-3 py-1.5 rounded-xl text-sm flex items-center gap-1.5">
                                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                {res.partySize} PAX
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 mb-1">{res.name}</h3>
                                        <p className="text-slate-500 font-medium mb-4">{res.phone}</p>

                                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Mesa Asignada</span>
                                            <span className="text-lg font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl">{res.tableNumber}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* New Reservation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">Nueva Reserva</h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 hover:text-slate-800 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Hora</label>
                                    <input
                                        type="time"
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                        value={newReservation.time}
                                        onChange={(e) => setNewReservation({ ...newReservation, time: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Mesa</label>
                                    <input
                                        type="text"
                                        placeholder="Ej. 10"
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                        value={newReservation.tableNumber}
                                        onChange={(e) => setNewReservation({ ...newReservation, tableNumber: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    placeholder="Ej. Familia Rodríguez"
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                    value={newReservation.name}
                                    onChange={(e) => setNewReservation({ ...newReservation, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Comensales</label>
                                    <div className="flex bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden p-1">
                                        <button
                                            onClick={() => setNewReservation(prev => ({ ...prev, partySize: Math.max(1, prev.partySize - 1) }))}
                                            className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-600 font-black hover:bg-slate-100 transition-colors"
                                        >
                                            -
                                        </button>
                                        <div className="flex-1 flex items-center justify-center font-black text-xl text-slate-800">
                                            {newReservation.partySize}
                                        </div>
                                        <button
                                            onClick={() => setNewReservation(prev => ({ ...prev, partySize: prev.partySize + 1 }))}
                                            className="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-xl shadow-sm text-indigo-600 font-black hover:bg-indigo-100 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Teléfono</label>
                                    <input
                                        type="tel"
                                        placeholder="Ej. 600 123 456"
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-3 h-[56px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                        value={newReservation.phone}
                                        onChange={(e) => setNewReservation({ ...newReservation, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveReservation}
                                disabled={!newReservation.name || !newReservation.time || !newReservation.tableNumber}
                                className={`flex-1 py-4 font-bold rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2 ${(!newReservation.name || !newReservation.time || !newReservation.tableNumber)
                                    ? 'bg-indigo-300 text-white cursor-not-allowed shadow-none'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    }`}
                            >
                                Guardar Reserva
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
