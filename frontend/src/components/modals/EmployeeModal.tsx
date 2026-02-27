import { useState, useEffect } from "react";
import { Employee } from "../../types";

interface EmployeeModalProps {
    isOpen: boolean;
    currentEmployee: Employee | null;
    onClose: () => void;
    onLogin: (employee: Employee) => void;
    onLogout: () => void;
}

export function EmployeeModal({ isOpen, currentEmployee, onClose, onLogin, onLogout }: EmployeeModalProps) {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployeeToUnlock, setSelectedEmployeeToUnlock] = useState<Employee | null>(null);
    const [enteredPin, setEnteredPin] = useState("");
    const [pinError, setPinError] = useState(false);

    useEffect(() => {
        if (isOpen && employees.length === 0) {
            fetch('http://localhost:3001/api/employees')
                .then(res => res.json())
                .then(data => setEmployees(data))
                .catch(err => console.error("Error fetching employees:", err));
        }
    }, [isOpen, employees.length]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
            <div className="bg-white rounded-[32px] w-full max-w-4xl min-h-[500px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col md:flex-row relative">

                {/* Si ya hay un usuario y se quiere salir sin cambiar, un botón de cerrado */}
                {currentEmployee && (
                    <button onClick={onClose} className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 hover:text-slate-800 transition-colors">
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
                                onClick={onLogout}
                                className="mt-1 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors border border-red-100 shadow-sm flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                Cerrar sesión activa
                            </button>
                        )}
                    </div>

                    <div className={`flex-1 grid grid-cols-1 ${selectedEmployeeToUnlock ? 'sm:grid-cols-1 lg:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-4 auto-rows-max`}>
                        {employees.map(emp => (
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
                                                    onLogin(selectedEmployeeToUnlock);
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
                                                onLogin(selectedEmployeeToUnlock);
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
    );
}
