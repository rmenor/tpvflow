import { useState } from 'react';
import { Customer } from '../types';

const MOCK_CLIENTS: Customer[] = [
    { id: "1", name: "Ramon Menor", address: "C/ San Onofre 31", phone: "600 123 456" },
    { id: "2", name: "Maria Garcia", address: "Av. Constitución 4, 2B", phone: "611 987 654" },
    { id: "3", name: "Anticapizza", address: "Santa Rosa 42", phone: "966 338 595" },
    { id: "4", name: "Carlos Perez", address: "Plaza España 1", phone: "622 345 678" }
];

export const useCustomers = () => {
    const [clientsList, setClientsList] = useState<Customer[]>(MOCK_CLIENTS);
    const [selectedClient, setSelectedClient] = useState<Customer>({ id: "0", name: "Sin nombre", address: "C/ San Onofre 31" });
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
        setSelectedClient({ id: "0", name: "Sin nombre", address: "C/ San Onofre 31" });
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
