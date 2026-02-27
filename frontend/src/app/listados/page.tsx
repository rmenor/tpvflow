"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "../../components/layout/Header";
const MOCK_EMPLOYEES = [
  { id: "1", name: "Ramon Menor", initials: "RM", pin: "1234", role: "Manager", color: "from-indigo-500 to-purple-500" },
  { id: "2", name: "Maria Garcia", initials: "MG", pin: "4321", role: "Cajera", color: "from-emerald-500 to-teal-500" },
  { id: "3", name: "Carlos Perez", initials: "CP", pin: "0000", role: "Camarero", color: "from-amber-500 to-orange-500" }
];

export default function ListadosPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [parkedOrders, setParkedOrders] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [paidOrders, setPaidOrders] = useState<any[]>([]);
  const [activeList, setActiveList] = useState<"APARCADAS" | "COBRADAS">("APARCADAS");

  // Estados de Empleado y Acceso
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(true); // Bloqueado por defecto
  const [selectedEmployeeToUnlock, setSelectedEmployeeToUnlock] = useState<any>(null);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    const savedEmp = localStorage.getItem("current_employee");
    if (savedEmp) {
      setCurrentEmployee(JSON.parse(savedEmp));
      setIsEmployeeModalOpen(false);
    }

    const savedParked = localStorage.getItem("parked_orders");
    if (savedParked) {

      setParkedOrders(JSON.parse(savedParked));
    }

    const savedPaid = localStorage.getItem("paid_orders");
    if (savedPaid) {

      setPaidOrders(JSON.parse(savedPaid));
    }
  }, []);

  const recoverOrder = (id: string) => {
    router.push(`/tpv?recover=${id}`);
  };

  const deleteOrder = (id: string) => {
    const updated = parkedOrders.filter(o => o.id !== id);
    setParkedOrders(updated);
    localStorage.setItem("parked_orders", JSON.stringify(updated));
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden selection:bg-indigo-100 flex-col">
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Barra de Navegación Superior */}
      <Header
        currentEmployee={currentEmployee}
        onOpenEmployeeModal={() => {
          setIsEmployeeModalOpen(true);
          setSelectedEmployeeToUnlock(null);
          setEnteredPin("");
          setPinError(false);
        }}
      />

      {/* Contenido Principal Ocupando Todo el Ancho y Alto */}
      <main className="flex-1 overflow-auto p-8 relative flex flex-col bg-slate-50/50">

        {/* Cabecera del Dashboard */}
        <div className="mb-6 flex flex-col md:flex-row items-center justify-between shrink-0 gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Listados de Comandas
            </h2>
            <p className="text-slate-500 font-medium text-[15px] mt-1">
              {activeList === "APARCADAS"
                ? "Selecciona una comanda aparcada para continuar operando en el Terminal."
                : "Historial de todas las comandas cobradas en la caja actual."}
            </p>
          </div>

          <div className="flex bg-slate-200/50 p-1.5 rounded-2xl shrink-0">
            <button
              onClick={() => setActiveList("APARCADAS")}
              className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 flex items-center gap-2 ${activeList === "APARCADAS"
                ? "bg-white text-indigo-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
            >
              Aparcadas
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeList === "APARCADAS" ? "bg-indigo-100 text-indigo-700 font-black" : "bg-slate-200 text-slate-500"}`}>
                {parkedOrders.length}
              </span>
            </button>
            <button
              onClick={() => setActiveList("COBRADAS")}
              className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 flex items-center gap-2 ${activeList === "COBRADAS"
                ? "bg-white text-emerald-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
            >
              Cobradas
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeList === "COBRADAS" ? "bg-emerald-100 text-emerald-700 font-black" : "bg-slate-200 text-slate-500"}`}>
                {paidOrders.length}
              </span>
            </button>
          </div>
        </div>

        {/* Contenedor de la Tabla Full Screen */}
        <div className="w-full flex-1 bg-white border border-slate-200/70 shadow-sm rounded-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header Tarjeta */}
          <div className="p-5 flex justify-between items-center border-b border-slate-100/80 bg-slate-50/50 shrink-0">
            <h3 className="font-bold text-slate-800 text-[14px] flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Caja del Día - {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
          </div>

          <div className="flex-1 overflow-auto">
            {activeList === "APARCADAS" && (
              parkedOrders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 font-medium">
                  <svg className="w-16 h-16 mb-4 text-slate-200 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span className="text-lg">No hay comandas aparcadas en este momento.</span>
                </div>
              ) : (
                <table className="w-full text-left text-[14px]">
                  <thead className="sticky top-0 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] z-10">
                    <tr className="border-b border-slate-100 text-[11px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/80 backdrop-blur-md">
                      <th className="px-6 py-4 w-48">Acciones</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">Tipo</th>
                      <th className="px-6 py-4">Importe</th>
                      <th className="px-6 py-4 text-right">Borrar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/60">
                    {parkedOrders.map((row) => (
                      <tr key={row.id} className="hover:bg-indigo-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <button onClick={() => recoverOrder(row.id)} className="px-5 py-2 bg-indigo-600 text-white hover:bg-indigo-700 font-bold rounded-xl text-[12px] shadow-[0_4px_14px_rgba(79,70,229,0.25)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.25)] transition-all focus:ring-4 focus:ring-indigo-100 flex items-center gap-2">
                            Abrir
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-black border px-2.5 py-1 rounded-md tracking-wider ${row.status === 'reservado' ? 'text-indigo-600 bg-indigo-50 border-indigo-200/60' : 'text-amber-600 bg-amber-50 border-amber-200/60'}`}>
                            {row.status === 'reservado' ? 'RESERVADA' : 'APARCADA'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{row.client?.name || "Sin nombre"}</p>
                          <p className="text-[12px] text-slate-500 font-medium mt-0.5">
                            {row.itemsCount} artículos en la orden
                            {row.tableNumber && <span className="text-indigo-600 font-bold"> &bull; Mesa {row.tableNumber} ({row.dinersCount} pax)</span>}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-600 text-[12px] tracking-wide bg-slate-100 px-3 py-1 rounded-lg">{row.orderType}</span>
                        </td>
                        <td className="px-6 py-4 font-black text-slate-900 text-[16px]">{row.total.toFixed(2)} &euro;</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3">
                            <button onClick={() => deleteOrder(row.id)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 font-bold rounded-xl text-[12px] shadow-sm transition-all focus:ring-4 focus:ring-slate-100">
                              Borrar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}

            {activeList === "COBRADAS" && (
              paidOrders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 font-medium">
                  <svg className="w-16 h-16 mb-4 text-slate-200 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg">No hay comandas cobradas en esta caja.</span>
                </div>
              ) : (
                <table className="w-full text-left text-[14px]">
                  <thead className="sticky top-0 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] z-10">
                    <tr className="border-b border-slate-100 text-[11px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/80 backdrop-blur-md">
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">Cliente / Tipo</th>
                      <th className="px-6 py-4">Método de Pago</th>
                      <th className="px-6 py-4 text-right">Importe Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/60">
                    {paidOrders.map((row) => (
                      <tr key={row.id} className="hover:bg-emerald-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 border border-emerald-200/60 px-2.5 py-1 rounded-md tracking-wider">COBRADA</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-600 text-[10px] tracking-wide bg-slate-100 px-2 py-1 rounded shadow-sm">{row.orderType}</span>
                            <div>
                              <p className="font-bold text-slate-800">{row.client?.name || "Sin nombre"}</p>
                              <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                                <span>Ticket #{row.id.slice(-4)}</span>
                                {row.tableNumber && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                    <span className="text-emerald-600 font-bold">Mesa {row.tableNumber} ({row.dinersCount} pax)</span>
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-bold text-[11px] tracking-widest uppercase px-3 py-1.5 rounded-xl border flex inline-flex items-center gap-2 ${row.paymentMethod === 'TARJETA' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                            {row.paymentMethod === 'TARJETA' ? (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            )}
                            {row.paymentMethod}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-slate-900 text-[18px]">
                          {row.total.toFixed(2)} <span className="text-slate-400 font-bold text-sm">&euro;</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>
      </main >

      {/* MODAL DE ACCESO / EMPLEADO */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
          <div className="bg-white rounded-[32px] w-full max-w-4xl min-h-[500px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col md:flex-row relative">

            {/* Si ya hay un usuario y se quiere salir sin cambiar, un botón de cerrado */}
            {currentEmployee && (
              <button onClick={() => setIsEmployeeModalOpen(false)} className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 hover:text-slate-800 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}

            {/* Panel Izquierdo: Selección de Empleado */}
            <div className={`w-full ${selectedEmployeeToUnlock ? 'md:w-1/2 hidden md:flex' : 'md:w-full flex'} p-8 lg:p-12 transition-all duration-300 flex-col`}>
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Acceso Empleados</h2>
                  <p className="text-slate-500 font-medium mt-2 text-lg">Selecciona tu usuario para acceder al TPV</p>
                </div>
                {currentEmployee && !selectedEmployeeToUnlock && (
                  <button
                    onClick={() => {
                      localStorage.removeItem("current_employee");
                      setCurrentEmployee(null);
                    }}
                    className="mt-1 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors border border-red-100 shadow-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Cerrar sesión activa
                  </button>
                )}
              </div>

              <div className={`flex-1 grid grid-cols-1 ${selectedEmployeeToUnlock ? 'sm:grid-cols-1 lg:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-4 auto-rows-max`}>
                {MOCK_EMPLOYEES.map(emp => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setSelectedEmployeeToUnlock(emp);
                      setEnteredPin("");
                      setPinError(false);
                    }}
                    className={`p-6 rounded-2xl border-2 text-left transition-all group flex flex-col items-center justify-center gap-4 ${selectedEmployeeToUnlock?.id === emp.id
                      ? 'border-indigo-600 bg-indigo-50 shadow-inner ring-4 ring-indigo-600/10'
                      : 'border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-lg hover:-translate-y-1'
                      }`}
                  >
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${emp.color} flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-110 transition-transform`}>
                      {emp.initials}
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-slate-800 text-lg">{emp.name}</h3>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{emp.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Panel Derecho: PIN Pad (Aparece al seleccionar empleado) */}
            {selectedEmployeeToUnlock && (
              <div className="w-full md:w-1/2 bg-slate-50 p-8 lg:p-12 border-l border-slate-200 flex flex-col animate-in fade-in slide-in-from-right-8 duration-300">
                <div className="text-center mb-8">
                  <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-tr ${selectedEmployeeToUnlock.color} flex items-center justify-center text-white font-black text-3xl shadow-lg mb-4`}>
                    {selectedEmployeeToUnlock.initials}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Hola, {selectedEmployeeToUnlock.name.split(' ')[0]}</h3>
                  <p className="text-slate-500 font-medium mt-1">Introduce tu PIN de acceso</p>
                </div>

                {/* PIN Dots */}
                <div className="flex justify-center gap-4 mb-8">
                  {[0, 1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded-full transition-all duration-200 ${enteredPin.length > i
                        ? 'bg-indigo-600 scale-110 shadow-md'
                        : pinError
                          ? 'bg-red-400 scale-95'
                          : 'bg-slate-200'
                        }`}
                    ></div>
                  ))}
                </div>

                {pinError && (
                  <div className="text-center text-red-500 font-bold mb-4 animate-[bounce_0.5s_ease-in-out]">
                    PIN Incorrecto
                  </div>
                )}

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto w-full">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                      key={num}
                      onClick={() => {
                        if (enteredPin.length < 4) {
                          setPinError(false);
                          const newPin = enteredPin + num;
                          setEnteredPin(newPin);
                          if (newPin.length === 4) {
                            if (newPin === selectedEmployeeToUnlock.pin) {
                              setCurrentEmployee(selectedEmployeeToUnlock);
                              localStorage.setItem("current_employee", JSON.stringify(selectedEmployeeToUnlock));
                              setIsEmployeeModalOpen(false);
                            } else {
                              setPinError(true);
                              setTimeout(() => setEnteredPin(""), 600);
                            }
                          }
                        }
                      }}
                      className="h-16 bg-white rounded-2xl font-black text-2xl hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 transition-all text-slate-700 shadow-sm border border-slate-200/60"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedEmployeeToUnlock(null);
                      setEnteredPin("");
                      setPinError(false);
                    }}
                    className="h-16 bg-slate-200 rounded-2xl font-bold text-sm hover:bg-slate-300 active:scale-95 transition-all text-slate-600 shadow-sm border border-slate-300 flex items-center justify-center uppercase tracking-wider"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={() => {
                      if (enteredPin.length < 4) {
                        setPinError(false);
                        const newPin = enteredPin + "0";
                        setEnteredPin(newPin);
                        if (newPin.length === 4) {
                          if (newPin === selectedEmployeeToUnlock.pin) {
                            setCurrentEmployee(selectedEmployeeToUnlock);
                            localStorage.setItem("current_employee", JSON.stringify(selectedEmployeeToUnlock));
                            setIsEmployeeModalOpen(false);
                          } else {
                            setPinError(true);
                            setTimeout(() => setEnteredPin(""), 600);
                          }
                        }
                      }
                    }}
                    className="h-16 bg-white rounded-2xl font-black text-2xl hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 transition-all text-slate-700 shadow-sm border border-slate-200/60"
                  >
                    0
                  </button>
                  <button
                    onClick={() => {
                      setEnteredPin(prev => prev.slice(0, -1));
                      setPinError(false);
                    }}
                    className="h-16 bg-red-50 rounded-2xl hover:bg-red-100 active:scale-95 transition-all text-red-500 shadow-sm flex items-center justify-center font-bold border border-red-100"
                  >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" /></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div >
  );
}
