"use client";

import { useState, useEffect } from "react";
import { EmployeeModal } from "../../components/modals/EmployeeModal";
import { Header } from "../../components/layout/Header";

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
    const [calendarDate, setCalendarDate] = useState<Date>(new Date());

    // Employee State
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [currentEmployee, setCurrentEmployee] = useState<any>(null);
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(true);

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

    useEffect(() => {
        const savedEmp = localStorage.getItem("current_employee");
        if (savedEmp) {
            setCurrentEmployee(JSON.parse(savedEmp));
            setIsEmployeeModalOpen(false);
        }
    }, []);

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

    const handleLogout = () => {
        localStorage.removeItem("current_employee");
        setCurrentEmployee(null);
    };

    // Calendar logic
    const daysInMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay();
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // 0 for Monday, 6 for Sunday
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const calendarGrid = [];
    for (let i = 0; i < startOffset; i++) {
        calendarGrid.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const dateObj = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), i);
        // Correct time zone offset issues by constructing ISO string manually
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        calendarGrid.push({ dateObj, dateString, day: i });
    }

    const prevMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
    const nextMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 h-screen overflow-hidden">
            <Header
                currentEmployee={currentEmployee}
                onOpenEmployeeModal={() => setIsEmployeeModalOpen(true)}
            />

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden relative z-0">
                {/* Sidebar / Full Calendar */}
                <aside className="w-[500px] bg-white border-r border-slate-200/60 p-6 flex flex-col gap-6 overflow-y-auto shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 mb-1">Calendario de Reservas</h2>
                        <p className="text-sm font-medium text-slate-500 mb-6">Selecciona el día para organizar los comensales.</p>

                        {/* Selector de mes */}
                        <div className="flex items-center justify-between mb-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                            <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center text-slate-600 bg-white rounded-xl shadow-sm hover:text-indigo-600 hover:bg-indigo-50 transition-colors border border-slate-200/60">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <span className="font-black text-lg text-slate-800 tracking-tight flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                            </span>
                            <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center text-slate-600 bg-white rounded-xl shadow-sm hover:text-indigo-600 hover:bg-indigo-50 transition-colors border border-slate-200/60">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>

                        {/* Cuadrícula del mes */}
                        <div className="border border-slate-200/60 rounded-3xl overflow-hidden bg-white shadow-sm">
                            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200/60">
                                {["L", "M", "X", "J", "V", "S", "D"].map((day, i) => (
                                    <div key={`header-${i}`} className={`py-3 text-center text-xs font-black uppercase tracking-widest ${i >= 5 ? 'text-indigo-600' : 'text-slate-400'}`}>
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 auto-rows-[4rem] bg-slate-100/50 gap-[1px]">
                                {calendarGrid.map((item, index) => {
                                    if (!item) {
                                        return <div key={`empty-${index}`} className="bg-white/40"></div>;
                                    }
                                    const { dateString, day } = item;
                                    const isSelected = selectedDate === dateString;
                                    const isToday = new Date().toISOString().split("T")[0] === dateString;
                                    const dayReservations = reservations.filter(r => r.date === dateString);

                                    return (
                                        <button
                                            key={dateString}
                                            onClick={() => setSelectedDate(dateString)}
                                            className={`relative bg-white flex flex-col items-center justify-center transition-all p-1 hover:bg-indigo-50 group hover:z-10 ${isSelected ? 'ring-2 ring-indigo-600 ring-inset bg-indigo-50/50 shadow-inner' : ''}`}
                                        >
                                            <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-1 transition-colors ${isToday && !isSelected
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : isSelected
                                                    ? 'text-indigo-700'
                                                    : 'text-slate-700 group-hover:text-indigo-600'
                                                }`}>
                                                {day}
                                            </span>

                                            {/* Indicadores de reserva */}
                                            {dayReservations.length > 0 && (
                                                <div className="flex gap-0.5 justify-center flex-wrap px-1 max-w-full">
                                                    {dayReservations.slice(0, 3).map((_, i) => (
                                                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-indigo-600' : 'bg-slate-400 group-hover:bg-indigo-400'}`}></div>
                                                    ))}
                                                    {dayReservations.length > 3 && (
                                                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-indigo-600' : 'bg-slate-400 group-hover:bg-indigo-400'} flex items-center justify-center text-[5px] text-white font-bold leading-none`}>+</div>
                                                    )}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-600 rounded-3xl p-6 flex-1 flex flex-col justify-center items-center text-center text-white relative overflow-hidden shadow-lg shadow-indigo-600/20">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-900/30 rounded-full blur-2xl"></div>

                        <h3 className="font-bold text-indigo-100 mb-1 z-10">Total Reservas del Día</h3>
                        <p className="text-white text-sm font-medium opacity-90 mb-4 z-10">
                            {new Date(selectedDate).toLocaleDateString("es-ES", { weekday: "long", day: "numeric" })} de {monthNames[new Date(selectedDate).getMonth()]}
                        </p>
                        <div className="z-10 flex items-center gap-3">
                            <span className="text-5xl font-black">{dailyReservations.length}</span>
                        </div>
                    </div>
                </aside>

                {/* Reservations List */}
                <section className="flex-1 p-8 overflow-y-auto bg-slate-50/50 h-full relative z-0">
                    <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-slate-100/50 to-transparent pointer-events-none z-10"></div>
                    <div className="max-w-4xl mx-auto relative z-20 pb-20">
                        <div className="flex justify-between items-center mb-8 sticky top-0 bg-slate-50/80 backdrop-blur-md pt-2 pb-6 z-30">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                Reservas Programadas
                            </h1>
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
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Día libre de reservas</h3>
                                <p className="text-slate-500 font-medium max-w-sm">No se han encontrado reservas para este día. Haz clic en "Nueva Reserva" para añadir una y empezar a llenar la mesa.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {dailyReservations.map((res) => (
                                    <div key={res.id} className="bg-white border border-slate-200/80 rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50/80 to-indigo-100/30 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110"></div>

                                        <div className="flex justify-between items-start mb-5">
                                            <div className="bg-indigo-600 text-white font-black text-2xl tracking-tighter px-4 py-2 rounded-[18px] shadow-sm flex items-center gap-2">
                                                <svg className="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {res.time}
                                            </div>
                                            <div className="bg-slate-100 text-slate-600 font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 border border-slate-200/50">
                                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                {res.partySize} PAX
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 mb-1">{res.name}</h3>
                                        <p className="text-slate-500 font-medium mb-6 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                            {res.phone || "Sin teléfono"}
                                        </p>

                                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-auto">
                                            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                                                Mesa Asignada
                                            </span>
                                            <span className="text-2xl font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-[14px] shadow-inner">{res.tableNumber}</span>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200/50">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                Nueva Reserva
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-500 rounded-full hover:bg-slate-100 hover:text-slate-800 transition-colors shadow-sm">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Hora</label>
                                    <input
                                        type="time"
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-5 py-3.5 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-inner"
                                        value={newReservation.time}
                                        onChange={(e) => setNewReservation({ ...newReservation, time: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Mesa Asignada</label>
                                    <input
                                        type="text"
                                        placeholder="Ej. Mesa 10"
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-5 py-3.5 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-inner"
                                        value={newReservation.tableNumber}
                                        onChange={(e) => setNewReservation({ ...newReservation, tableNumber: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Cliente</label>
                                <input
                                    type="text"
                                    placeholder="Ej. Familia Rodríguez"
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-5 py-3.5 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-inner"
                                    value={newReservation.name}
                                    onChange={(e) => setNewReservation({ ...newReservation, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Comensales</label>
                                    <div className="flex bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden p-1.5 shadow-inner">
                                        <button
                                            onClick={() => setNewReservation(prev => ({ ...prev, partySize: Math.max(1, prev.partySize - 1) }))}
                                            className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.05)] text-slate-600 font-black hover:bg-slate-100 hover:text-indigo-600 transition-colors border border-slate-100"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                                        </button>
                                        <div className="flex-1 flex items-center justify-center font-black text-2xl text-slate-800">
                                            {newReservation.partySize}
                                        </div>
                                        <button
                                            onClick={() => setNewReservation(prev => ({ ...prev, partySize: prev.partySize + 1 }))}
                                            className="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.05)] text-indigo-600 font-black hover:bg-indigo-100 transition-colors border border-indigo-100/50"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Teléfono de Contacto</label>
                                    <input
                                        type="tel"
                                        placeholder="Ej. 600 123 456"
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-5 py-3.5 h-[60px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-inner"
                                        value={newReservation.phone}
                                        onChange={(e) => setNewReservation({ ...newReservation, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveReservation}
                                disabled={!newReservation.name || !newReservation.time || !newReservation.tableNumber}
                                className={`flex-1 py-4 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${(!newReservation.name || !newReservation.time || !newReservation.tableNumber)
                                    ? 'bg-slate-300 text-slate-50 shadow-none cursor-not-allowed'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-600/30'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                Confirmar Reserva
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Employee Modal */}
            <EmployeeModal
                isOpen={isEmployeeModalOpen}
                currentEmployee={currentEmployee}
                onClose={() => setIsEmployeeModalOpen(false)}
                onLogin={(emp: any) => {
                    setCurrentEmployee(emp);
                    localStorage.setItem("current_employee", JSON.stringify(emp));
                    setIsEmployeeModalOpen(false);
                }}
                onLogout={handleLogout}
            />
        </div>
    );
}
