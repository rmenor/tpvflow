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

    const daysInMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay();
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const calendarGrid = [];
    for (let i = 0; i < startOffset; i++) {
        calendarGrid.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const dateObj = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), i);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        calendarGrid.push({ dateObj, dateString, day: i });
    }

    const prevMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
    const nextMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));

    const dailyReservations = reservations.filter((r) => r.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time));

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 h-screen overflow-hidden">
            <Header
                currentEmployee={currentEmployee}
                onOpenEmployeeModal={() => setIsEmployeeModalOpen(true)}
            />

            <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-0">
                {/* Calendario a pantalla completa */}
                <section className="flex-1 p-8 flex flex-col h-full bg-white border-r border-slate-200/60 overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Calendario de Reservas</h2>
                            <p className="text-slate-500 font-medium">Gestiona las reservas del restaurante en la vista mensual.</p>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                            <button onClick={prevMonth} className="w-12 h-12 flex items-center justify-center text-slate-600 bg-white rounded-xl shadow-sm hover:text-indigo-600 hover:bg-indigo-50 transition-colors border border-slate-200/60">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <span className="font-black text-2xl text-slate-800 tracking-tight min-w-[200px] text-center">
                                {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                            </span>
                            <button onClick={nextMonth} className="w-12 h-12 flex items-center justify-center text-slate-600 bg-white rounded-xl shadow-sm hover:text-indigo-600 hover:bg-indigo-50 transition-colors border border-slate-200/60">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col border border-slate-200/60 rounded-3xl overflow-hidden bg-slate-50 shadow-sm">
                        <div className="grid grid-cols-7 bg-slate-100/50 border-b border-slate-200/60 shrink-0">
                            {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((day, i) => (
                                <div key={`header-${i}`} className={`py-4 text-center text-sm font-black uppercase tracking-widest ${i >= 5 ? 'text-indigo-600' : 'text-slate-500'}`}>
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 auto-rows-fr bg-slate-200/50 gap-[1px] flex-1">
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
                                        className={`relative bg-white flex flex-col p-3 transition-all hover:bg-indigo-50/50 group ${isSelected ? 'ring-2 ring-indigo-600 ring-inset bg-indigo-50/30' : ''}`}
                                    >
                                        <div className="flex justify-between w-full items-start">
                                            <span className={`text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isToday && !isSelected
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : isSelected
                                                    ? 'text-indigo-700 bg-indigo-100'
                                                    : 'text-slate-700 group-hover:text-indigo-600'
                                                }`}>
                                                {day}
                                            </span>
                                            {dayReservations.length > 0 && (
                                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                                                    {dayReservations.length} res
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-2 flex-1 w-full flex flex-col gap-1 overflow-y-auto no-scrollbar">
                                            {dayReservations.slice(0, 3).map(res => (
                                                <div key={res.id} className="text-left bg-slate-50 border border-slate-100 rounded-lg p-1.5 flex justify-between items-center group-hover:bg-white transition-colors">
                                                    <span className="font-bold text-slate-700 text-xs truncate max-w-[60%]">{res.time} {res.name}</span>
                                                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200/50 px-1.5 py-0.5 rounded">M{res.tableNumber}</span>
                                                </div>
                                            ))}
                                            {dayReservations.length > 3 && (
                                                <div className="text-xs font-bold text-indigo-500 text-center mt-1">
                                                    +{dayReservations.length - 3} más
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Panel lateral del día seleccionado */}
                <aside className="w-[450px] bg-slate-50 relative flex flex-col shrink-0 z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
                    <div className="p-8 pb-4 flex-1 flex flex-col overflow-y-auto no-scrollbar">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {new Date(selectedDate).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="mt-4 w-full px-6 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                                Nueva Reserva
                            </button>
                        </div>

                        {dailyReservations.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                <svg className="w-16 h-16 mb-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <p className="font-medium text-lg text-slate-500">No hay reservas para este día.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 pb-20">
                                {dailyReservations.map((res) => (
                                    <div key={res.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100/30 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>

                                        <div className="flex justify-between items-start mb-4">
                                            <span className="bg-indigo-600 text-white font-black text-xl px-3 py-1 rounded-xl shadow-sm">
                                                {res.time}
                                            </span>
                                            <div className="flex gap-2">
                                                <span className="bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                                    {res.partySize} PAX
                                                </span>
                                            </div>
                                        </div>

                                        <h4 className="text-lg font-bold text-slate-900 mb-1">{res.name}</h4>
                                        <p className="text-sm font-medium text-slate-500 mb-4 flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                            {res.phone || "Sin teléfono"}
                                        </p>

                                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mesa</span>
                                            <span className="text-lg font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl">{res.tableNumber}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>
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
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Hora</label>
                                    <input type="time" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-5 py-3.5 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all shadow-inner" value={newReservation.time} onChange={(e) => setNewReservation({ ...newReservation, time: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Mesa Asignada</label>
                                    <input type="text" placeholder="Ej. 10" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-5 py-3.5 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all shadow-inner" value={newReservation.tableNumber} onChange={(e) => setNewReservation({ ...newReservation, tableNumber: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Cliente</label>
                                <input type="text" placeholder="Ej. Familia Rodríguez" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-5 py-3.5 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all shadow-inner" value={newReservation.name} onChange={(e) => setNewReservation({ ...newReservation, name: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Comensales</label>
                                    <div className="flex bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden p-1.5 shadow-inner">
                                        <button onClick={() => setNewReservation(prev => ({ ...prev, partySize: Math.max(1, prev.partySize - 1) }))} className="w-12 h-12 bg-white rounded-xl shadow-sm text-slate-600 font-black">-</button>
                                        <div className="flex-1 flex items-center justify-center font-black text-2xl text-slate-800">{newReservation.partySize}</div>
                                        <button onClick={() => setNewReservation(prev => ({ ...prev, partySize: prev.partySize + 1 }))} className="w-12 h-12 bg-indigo-50 rounded-xl shadow-sm text-indigo-600 font-black">+</button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Teléfono</label>
                                    <input type="tel" placeholder="600 123 456" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-5 py-3.5 h-[60px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all shadow-inner" value={newReservation.phone} onChange={(e) => setNewReservation({ ...newReservation, phone: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-4">
                            <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm">Cancelar</button>
                            <button onClick={handleSaveReservation} disabled={!newReservation.name || !newReservation.time || !newReservation.tableNumber} className={`flex-1 py-4 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${(!newReservation.name || !newReservation.time || !newReservation.tableNumber) ? 'bg-slate-300 text-slate-50 shadow-none cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

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
