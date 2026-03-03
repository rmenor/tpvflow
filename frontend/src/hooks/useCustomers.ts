import { useState, useEffect } from 'react';
import { Customer } from '../types';
import { API_URL } from '../config/api';

export const useCustomers = () => {
    const [clientsList, setClientsList] = useState<Customer[]>([]);
    const [selectedClient, setSelectedClient] = useState<Customer>({ id: "0", name: "Sin nombre", address: "C/ Sin nombre" });
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
    const [clientSearchQuery, setClientSearchQuery] = useState("");
    const [newClientData, setNewClientData] = useState({ name: "", phone: "", address: "" });

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch(`${API_URL}/api/customers`);
                if (res.ok) {
                    const data = await res.json();
                    setClientsList(data);
                }
            } catch (err) {
                console.error("Failed to fetch customers:", err);
            }
        };
        fetchCustomers();
    }, []);

    const handleSaveNewClient = async () => {
        if (!newClientData.name) return;

        try {
            const res = await fetch(`${API_URL}/api/customers`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newClientData)
            });

            if (res.ok) {
                const savedClient = await res.json();
                setClientsList(prev => [...prev, savedClient]);
                setSelectedClient(savedClient);
                setIsNewClientModalOpen(false);
                setIsClientModalOpen(false);
                setNewClientData({ name: "", phone: "", address: "" });
            } else {
                console.error("Failed to save new client");
            }
        } catch (err) {
            console.error("Error saving new client:", err);
        }
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
