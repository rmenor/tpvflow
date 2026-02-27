"use client";

import { useState, useEffect } from "react";
import { EmployeeModal } from "../../components/modals/EmployeeModal";
import { Header } from "../../components/layout/Header";
import { useCustomers } from "../../hooks/useCustomers";
import { ClientModal, NewClientModal } from "../../components/modals/ClientModal";
import { Customer, Employee } from "../../types";
import { format, startOfWeek, addDays, getDaysInMonth, startOfMonth, addMonths, subMonths, isSameDay, startOfDay, addWeeks, subWeeks, addDays as addDaysToDate, subDays } from "date-fns";
import { es } from "date-fns/locale";

interface Reservation {
    id: string;
    date: string;
    time: string;
    name: string;
    partySize: number;
    tableNumber: string;
    phone: string;
    status?: string;
}

type ViewMode = "month" | "week" | "day";

export default function ReservasPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
    const [currentDate, setCurrentDate] = useState<Date>(startOfDay(new Date()));
    const [viewMode, setViewMode] = useState<ViewMode>("day");

    // Employee State
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [currentEmployee, setCurrentEmployee] = useState<any>(null);
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(true);

    const [reservations, setReservations] = useState<Reservation[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newReservation, setNewReservation] = useState<{
        date: string; // The selected date for the new reservation
        time: string;
        partySize: number;
        tableNumber: string;
    }>({
        date: format(new Date(), 'yyyy-MM-dd'),
        time: "14:00",
        partySize: 2,
        tableNumber: "",
    });

    const {
        clientsList, selectedClient, setSelectedClient, deselectClient,
        isClientModalOpen, setIsClientModalOpen,
        isNewClientModalOpen, setIsNewClientModalOpen,
        clientSearchQuery, setClientSearchQuery,
        newClientData, setNewClientData, handleSaveNewClient
    } = useCustomers();

    useEffect(() => {
        const savedEmp = localStorage.getItem("current_employee");
        if (savedEmp) {
            setCurrentEmployee(JSON.parse(savedEmp));
            setIsEmployeeModalOpen(false);
        }
    }, []);

    // Load reservations from parked_orders
    useEffect(() => {
        const savedParked = localStorage.getItem("parked_orders");
        if (savedParked) {
            const parked = JSON.parse(savedParked);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const validRes = parked.filter((o: any) => (o.status === 'reservado' || o.status === 'aparcado') && o.date).map((o: any) => ({
                id: o.id,
                date: o.date,
                time: o.time || "14:00",
                name: o.client?.name || "Sin nombre",
                partySize: o.dinersCount || 2,
                tableNumber: o.tableNumber || "",
                phone: o.client?.phone || "",
                status: o.status
            }));
            setReservations(validRes);
        }
    }, [isModalOpen]);

    // When opening the modal, default the reservation date to the currently inspected date
    const handleOpenModal = () => {
        setNewReservation(prev => ({ ...prev, date: format(selectedDate, 'yyyy-MM-dd') }));
        setIsModalOpen(true);
    };

    const handleSaveReservation = (client: Customer) => {
        if (!newReservation.time || !newReservation.tableNumber || !newReservation.date) return;

        const newResId = Date.now().toString();

        const newRes: Reservation = {
            id: newResId,
            date: newReservation.date,
            time: newReservation.time,
            name: client.name,
            partySize: newReservation.partySize,
            tableNumber: newReservation.tableNumber,
            phone: client.phone || "",
            status: "reservado"
        };

        // EXTRA LOGIC FOR TICKETING: Park this reservation as a ticket
        const newOrder = {
            id: newResId,
            items: [],
            itemsCount: 0,
            total: 0,
            orderType: "LOCAL",
            client: client,
            tableNumber: newReservation.tableNumber,
            dinersCount: newReservation.partySize,
            status: "reservado",
            date: newReservation.date,
            time: newReservation.time
        };
        const savedParked = localStorage.getItem("parked_orders");
        const parkedFlow = savedParked ? JSON.parse(savedParked) : [];
        localStorage.setItem("parked_orders", JSON.stringify([newOrder, ...parkedFlow]));

        // Immediately update state so it shows up wihout waiting for effect
        setReservations((prev) => [...prev, newRes]);
        setIsModalOpen(false);

        setNewReservation({
            date: format(selectedDate, 'yyyy-MM-dd'),
            time: "14:00",
            partySize: 2,
            tableNumber: "",
        });
        deselectClient();
    };

    const handleSelectClient = (client: Customer) => {
        setSelectedClient(client);
        setIsClientModalOpen(false);
        handleSaveReservation(client);
    };

    const onSaveNewClientAndReserve = () => {
        handleSaveNewClient();
        const createdClient = { id: Date.now().toString(), name: newClientData.name, address: newClientData.address, phone: newClientData.phone };
        handleSaveReservation(createdClient);
    }

    const goToClientSelection = () => {
        setIsModalOpen(false);
        setIsClientModalOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("current_employee");
        setCurrentEmployee(null);
    };

    // --- Navigation Logic ---
    const goPrev = () => {
        if (viewMode === "month") setCurrentDate(subMonths(currentDate, 1));
        if (viewMode === "week") setCurrentDate(subWeeks(currentDate, 1));
        if (viewMode === "day") {
            const prev = subDays(currentDate, 1);
            setCurrentDate(prev);
            setSelectedDate(prev);
        }
    };

    const goNext = () => {
        if (viewMode === "month") setCurrentDate(addMonths(currentDate, 1));
        if (viewMode === "week") setCurrentDate(addWeeks(currentDate, 1));
        if (viewMode === "day") {
            const next = addDaysToDate(currentDate, 1);
            setCurrentDate(next);
            setSelectedDate(next);
        }
    };

    const goToday = () => {
        const today = startOfDay(new Date());
        setCurrentDate(today);
        setSelectedDate(today);
    };

    // --- Render Helpers ---

    const getDailyReservations = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return reservations.filter((r) => r.date === dateStr).sort((a, b) => a.time.localeCompare(b.time));
    };

    const renderMonthView = () => {
        const firstDay = startOfMonth(currentDate);
        const daysInMonth = getDaysInMonth(currentDate);
        const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // 0 is Monday

        const grid = [];
        for (let i = 0; i < startOffset; i++) grid.push(null);
        for (let i = 1; i <= daysInMonth; i++) {
            grid.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
        }

        return (
            <div className="flex-1 flex flex-col border border-slate-200/60 rounded-3xl overflow-hidden bg-white shadow-sm mt-6">
                <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200/60">
                    {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day, i) => (
                        <div key={i} className={`py-4 text-center text-sm font-black uppercase tracking-widest ${i >= 5 ? 'text-indigo-600' : 'text-slate-500'}`}>
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 auto-rows-[6rem] bg-slate-100/50 gap-[1px] flex-1">
                    {grid.map((date, index) => {
                        if (!date) return <div key={`empty-${index}`} className="bg-white/40"></div>;

                        const isSelected = isSameDay(date, selectedDate);
                        const isToday = isSameDay(date, new Date());
                        const dayRes = getDailyReservations(date);

                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    setSelectedDate(date);
                                    // Optionally switch to day view when a day is clicked
                                    // setViewMode("day"); 
                                    // setCurrentDate(date);
                                }}
                                className={`relative bg-white flex flex-col p-2 transition-all hover:bg-indigo-50 group border border-transparent ${isSelected ? 'ring-2 ring-indigo-600 ring-inset bg-indigo-50/30 font-bold' : ''}`}
                            >
                                <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-1 transition-colors ${isToday && !isSelected ? 'bg-indigo-600 text-white shadow-sm' : isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
                                    {format(date, 'd')}
                                </span>
                                <div className="flex flex-col gap-1 w-full overflow-hidden text-left">
                                    {dayRes.slice(0, 2).map((r, i) => (
                                        <div key={i} className="text-[10px] font-bold text-slate-600 bg-slate-100 rounded px-1.5 py-0.5 truncate border border-slate-200">
                                            {r.time} - {r.partySize}p
                                        </div>
                                    ))}
                                    {dayRes.length > 2 && (
                                        <div className="text-[10px] font-bold text-indigo-500 pl-1">+{dayRes.length - 2} más</div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
        const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i));

        return (
            <div className="flex-1 flex flex-col border border-slate-200/60 rounded-3xl overflow-hidden bg-white shadow-sm mt-6">
                <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200/60">
                    {days.map((date, i) => {
                        const isToday = isSameDay(date, new Date());
                        return (
                            <div key={i} className={`py-4 text-center border-l first:border-l-0 border-slate-200/60 ${isToday ? 'bg-indigo-50/50' : ''}`}>
                                <div className={`text-xs font-black uppercase tracking-widest mb-1 ${i >= 5 ? 'text-indigo-600' : 'text-slate-500'}`}>
                                    {format(date, 'E', { locale: es })}
                                </div>
                                <div className={`text-2xl font-black ${isToday ? 'text-indigo-600' : 'text-slate-800'}`}>
                                    {format(date, 'd')}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="grid grid-cols-7 flex-1 bg-slate-100/50 gap-[1px]">
                    {days.map((date, i) => {
                        const dayRes = getDailyReservations(date);
                        return (
                            <div key={i} className="bg-white p-2 overflow-y-auto relative h-full min-h-[400px]">
                                <div className="flex flex-col gap-2">
                                    {dayRes.map(res => (
                                        <div key={res.id} onClick={() => { setSelectedDate(date); }} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-black text-indigo-600 text-sm">{res.time}</span>
                                                <span className="bg-white border border-slate-200 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded-md">M{res.tableNumber}</span>
                                            </div>
                                            <div className="font-bold text-slate-800 text-sm truncate">{res.name}</div>
                                            <div className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-1">
                                                <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                                {res.partySize} px
                                            </div>
                                        </div>
                                    ))}
                                    {dayRes.length === 0 && (
                                        <div className="text-center text-slate-300 text-xs font-medium py-4">Sin reservas</div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    };

    const renderDayView = () => {
        const dayRes = getDailyReservations(selectedDate);
        return (
            <div className="flex-1 overflow-y-auto mt-6">
                {dayRes.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/60 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Día libre de reservas</h3>
                        <p className="text-slate-500 font-medium max-w-sm">No se han encontrado reservas para este día. Haz clic en &quot;Nueva Reserva&quot; para añadir una.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                        {dayRes.map((res) => (
                            <div key={res.id} className="bg-white border border-slate-200/80 rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50/80 to-indigo-100/30 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110"></div>

                                <div className="flex justify-between items-start mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-indigo-600 text-white font-black text-2xl tracking-tighter px-4 py-2 rounded-[18px] shadow-sm flex items-center gap-2">
                                            <svg className="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            {res.time}
                                        </div>
                                        {res.status === 'aparcado' && (
                                            <span className="bg-emerald-100 text-emerald-700 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
                                                VINO
                                            </span>
                                        )}
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
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 h-screen overflow-hidden">
            <Header
                currentEmployee={currentEmployee}
                onOpenEmployeeModal={() => setIsEmployeeModalOpen(true)}
            />

            <main className="flex-1 flex flex-col p-8 overflow-hidden relative z-0">

                {/* Header Controls */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-2 shrink-0">
                    <div className="flex items-center gap-4 bg-white p-2 rounded-[20px] shadow-sm border border-slate-200/60">
                        <button onClick={goPrev} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        <div className="flex flex-col items-center min-w-[200px]">
                            {viewMode === "month" && (
                                <span className="font-black text-2xl text-slate-800 tracking-tight capitalize">
                                    {format(currentDate, "MMMM yyyy", { locale: es })}
                                </span>
                            )}
                            {viewMode === "week" && (
                                <span className="font-black text-xl text-slate-800 tracking-tight">
                                    {format(startOfWeek(currentDate, { weekStartsOn: 1 }), "d MMM", { locale: es })} - {format(addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 6), "d MMM yyyy", { locale: es })}
                                </span>
                            )}
                            {viewMode === "day" && (
                                <span className="font-black text-2xl text-slate-800 tracking-tight capitalize">
                                    {format(currentDate, "EEEE, d 'de' MMMM", { locale: es })}
                                </span>
                            )}
                        </div>

                        <button onClick={goNext} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                        </button>

                        <div className="w-px h-8 bg-slate-200 mx-2"></div>
                        <button onClick={goToday} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors">
                            Hoy
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex bg-slate-200/50 p-1.5 rounded-[20px]">
                            <button
                                onClick={() => { setViewMode("day"); setCurrentDate(selectedDate); }}
                                className={`px-6 py-2.5 text-sm font-bold rounded-2xl transition-all ${viewMode === "day" ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Día
                            </button>
                            <button
                                onClick={() => setViewMode("week")}
                                className={`px-6 py-2.5 text-sm font-bold rounded-2xl transition-all ${viewMode === "week" ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Semana
                            </button>
                            <button
                                onClick={() => setViewMode("month")}
                                className={`px-6 py-2.5 text-sm font-bold rounded-2xl transition-all ${viewMode === "month" ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Mes
                            </button>
                        </div>
                        <button
                            onClick={handleOpenModal}
                            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-[20px] shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors flex items-center gap-2 h-[52px]"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                            Nueva Reserva
                        </button>
                    </div>
                </div>

                {/* View Container */}
                {viewMode === "month" && renderMonthView()}
                {viewMode === "week" && renderWeekView()}
                {viewMode === "day" && renderDayView()}

            </main>

            {/* New Reservation Modal - WITH DATE SELECTOR */}
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

                            {/* NEW: Date Selector */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Fecha de la Reserva</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-5 py-3.5 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-inner"
                                    value={newReservation.date}
                                    onChange={(e) => setNewReservation({ ...newReservation, date: e.target.value })}
                                />
                            </div>

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
                                onClick={goToClientSelection}
                                disabled={!newReservation.time || !newReservation.tableNumber || !newReservation.date}
                                className={`flex-1 py-4 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${(!newReservation.time || !newReservation.tableNumber || !newReservation.date)
                                    ? 'bg-slate-300 text-slate-50 shadow-none cursor-not-allowed'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-600/30'
                                    }`}
                            >
                                Siguiente: Elegir Cliente
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Cliente y Nuevo Cliente (integrado de TPV) */}
            <ClientModal
                isOpen={isClientModalOpen}
                onClose={() => setIsClientModalOpen(false)}
                clientsList={clientsList}
                clientSearchQuery={clientSearchQuery}
                setClientSearchQuery={setClientSearchQuery}
                onSelectClient={handleSelectClient}
                onOpenNewClient={() => {
                    setIsClientModalOpen(false);
                    setIsNewClientModalOpen(true);
                }}
            />

            <NewClientModal
                isOpen={isNewClientModalOpen}
                onClose={() => setIsNewClientModalOpen(false)}
                newClientData={newClientData}
                setNewClientData={setNewClientData}
                onSave={onSaveNewClientAndReserve}
            />

            {/* Employee Modal */}
            <EmployeeModal
                isOpen={isEmployeeModalOpen}
                currentEmployee={currentEmployee}
                onClose={() => setIsEmployeeModalOpen(false)}
                onLogin={(emp: Employee) => {
                    setCurrentEmployee(emp);
                    localStorage.setItem("current_employee", JSON.stringify(emp));
                    setIsEmployeeModalOpen(false);
                }}
                onLogout={handleLogout}
            />
        </div>
    );
}

