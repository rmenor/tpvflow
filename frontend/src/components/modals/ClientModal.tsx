import { Customer } from "../../types";

interface ClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientsList: Customer[];
    clientSearchQuery: string;
    setClientSearchQuery: (query: string) => void;
    onSelectClient: (client: Customer) => void;
    onOpenNewClient: () => void;
}

export function ClientModal({
    isOpen, onClose, clientsList, clientSearchQuery, setClientSearchQuery,
    onSelectClient, onOpenNewClient
}: ClientModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">Seleccionar Cliente</h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 hover:text-slate-800 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 pb-2">
                    <div className="relative">
                        <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input
                            type="text"
                            autoFocus
                            placeholder="Buscar por nombre o teléfono..."
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl pl-12 pr-4 py-4 font-bold placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                            value={clientSearchQuery}
                            onChange={(e) => setClientSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="px-6 pb-6 mt-4 max-h-[40vh] overflow-y-auto space-y-2 no-scrollbar">
                    {clientsList
                        .filter(c => c.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) || (c.phone && c.phone.includes(clientSearchQuery)))
                        .map(client => (
                            <button
                                key={client.id}
                                onClick={() => onSelectClient(client)}
                                className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:border-indigo-600 hover:bg-indigo-50 transition-colors group text-left"
                            >
                                <div>
                                    <h3 className="font-bold text-slate-800 group-hover:text-indigo-900">{client.name}</h3>
                                    <p className="text-sm text-slate-500 mt-1">{client.address}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-slate-400 group-hover:text-indigo-600 bg-slate-50 group-hover:bg-white px-3 py-1 rounded-full">{client.phone}</span>
                                </div>
                            </button>
                        ))}
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50">
                    <button
                        onClick={onOpenNewClient}
                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        Crear nuevo cliente
                    </button>
                </div>
            </div>
        </div>
    );
}

interface NewClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    newClientData: { name: string, phone: string, address: string };
    setNewClientData: (data: { name: string, phone: string, address: string }) => void;
    onSave: () => void;
}

export function NewClientModal({ isOpen, onClose, newClientData, setNewClientData, onSave }: NewClientModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">Crear Nuevo Cliente</h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 hover:text-slate-800 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Nombre y Apellidos</label>
                        <input
                            type="text"
                            autoFocus
                            placeholder="Ej. Juan Pérez"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                            value={newClientData.name}
                            onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Teléfono</label>
                        <input
                            type="tel"
                            placeholder="Ej. 600 123 456"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                            value={newClientData.phone}
                            onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Dirección de Entrega</label>
                        <input
                            type="text"
                            placeholder="Ej. Av. Constitución 12, Pta 3"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                            value={newClientData.address}
                            onChange={(e) => setNewClientData({ ...newClientData, address: e.target.value })}
                        />
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onSave}
                        disabled={!newClientData.name}
                        className={`flex-1 py-4 font-bold rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2 ${!newClientData.name ? 'bg-indigo-300 text-white cursor-not-allowed shadow-none' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                    >
                        Guardar Cliente
                    </button>
                </div>
            </div>
        </div>
    );
}
