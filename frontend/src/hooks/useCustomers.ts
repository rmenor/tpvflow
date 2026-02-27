import { useState } from 'react';
import { Customer } from '../types';

const MOCK_CLIENTS: Customer[] = [
    { id: "1", name: "Ramon Menor", address: "C/ San Onofre 31", phone: "999 999 999" },
    { id: "2", name: "Maria Garcia", address: "Av. Constitución 4, 2B", phone: "999 999 999" },
    { id: "3", name: "Cliente 3", address: "Calle Falsa 123", phone: "999 999 999" },
    { id: "4", name: "Cliente 4", address: "Calle Falsa 123", phone: "999 999 999" }
];

export const useCustomers = () => {
    const [clientsList, setClientsList] = useState<Customer[]>(MOCK_CLIENTS);
    const [selectedClient, setSelectedClient] = useState<Customer>({ id: "0", name: "Sin nombre", address: "C/ Sin nombre" });
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
    const [clientSearchQuery, setClientSearchQuery] = useState("");
    const [newClientData, setNewClientData] = useState({ name: "", phone: "", address: "" });

    const handleSaveNewClient = () => {
        if (!newClientData.name) return;
        const newId = (clientsList.length + 1).toString();
        const clientToSave: Customer = { id: newId, ...newClientData };
        setClientsList(prev => [...prev, clientToSave]);
        setSelectedClient(clientToSave);
        setIsNewClientModalOpen(false);
        setIsClientModalOpen(false);
        setNewClientData({ name: "", phone: "", address: "" });
    };

    const deselectClient = () => {
        setSelectedClient({ id: "0", name: "Sin nombre", address: "C/ Sin nombre" });
    };

    return {
        clientsList,
        selectedClient,
        setSelectedClient,
        deselectClient,
        isClientModalOpen,
        setIsClientModalOpen,
        isNewClientModalOpen,
        setIsNewClientModalOpen,
        clientSearchQuery,
        setClientSearchQuery,
        newClientData,
        setNewClientData,
        handleSaveNewClient
    };
};
