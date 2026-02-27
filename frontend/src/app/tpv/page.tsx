"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category, Product, OrderItem } from "../../types";

import { useCart } from "../../hooks/useCart";
import { useCustomers } from "../../hooks/useCustomers";

import { Header } from "../../components/layout/Header";
import { CategorySelector } from "../../components/tpv/CategorySelector";
import { ProductGrid } from "../../components/tpv/ProductGrid";
import { OrderPanel } from "../../components/tpv/OrderPanel";

import { CustomPizzaModal } from "../../components/modals/CustomPizzaModal";
import { PaymentModal } from "../../components/modals/PaymentModal";
import { TicketModal } from "../../components/modals/TicketModal";
import { KitchenTicketModal } from "../../components/modals/KitchenTicketModal";
import { EmployeeModal } from "../../components/modals/EmployeeModal";
import { ClientModal, NewClientModal } from "../../components/modals/ClientModal";

function TPVContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recoverId = searchParams.get('recover');

  // MOCKS
  const MOCK_CATEGORIES: Category[] = [
    { id: "1", name: "ENTRANTES" },
    { id: "2", name: "ENSALADAS" },
    { id: "3", name: "PASTAS" },
    { id: "4", name: "PIZZAS" },
    { id: "5", name: "POSTRES" },
    { id: "6", name: "BEBIDAS" }
  ];

  const MOCK_PRODUCTS: Product[] = [
    { id: "101", categoryId: "1", name: "Aros de cebolla", price: 4.50 },
    { id: "102", categoryId: "1", name: "Patatas Bravas", price: 5.00 },
    { id: "401", categoryId: "4", name: "Pizza Margarita", price: 8.50, ingredients: ["Tomate", "Queso Mozzarella", "Orégano"] },
    { id: "402", categoryId: "4", name: "Pizza Pepperoni", price: 10.50, ingredients: ["Tomate", "Queso Mozzarella", "Pepperoni"] },
    { id: "601", categoryId: "6", name: "Coca Cola", price: 2.00 },
    { id: "602", categoryId: "6", name: "Cerveza", price: 2.50 }
  ];

  // STATE
  const [activeCategory, setActiveCategory] = useState<string>("4");
  const [activeTab, setActiveTab] = useState<string>("COMANDA");
  const [orderType, setOrderType] = useState<"LOCAL" | "DOMICILIO">("LOCAL");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [dinersCount, setDinersCount] = useState<number>(2);

  const { cart, setCart, addToCart, removeFromCart, clearCart, total } = useCart();
  const {
    clientsList, selectedClient, setSelectedClient, deselectClient,
    isClientModalOpen, setIsClientModalOpen,
    isNewClientModalOpen, setIsNewClientModalOpen,
    clientSearchQuery, setClientSearchQuery,
    newClientData, setNewClientData, handleSaveNewClient
  } = useCustomers();

  // Empleados
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(true);

  // Modales adicionales
  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);
  const [currentPizza, setCurrentPizza] = useState<Product | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isKitchenTicketModalOpen, setIsKitchenTicketModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentKitchenOrder, setCurrentKitchenOrder] = useState<any>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  useEffect(() => {
    const savedEmp = localStorage.getItem("current_employee");
    if (savedEmp) {
      setCurrentEmployee(JSON.parse(savedEmp));
      setIsEmployeeModalOpen(false);
    }
  }, []);

  useEffect(() => {
    if (recoverId) {
      const savedParked = localStorage.getItem("parked_orders");
      if (savedParked) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parkedFlow: any[] = JSON.parse(savedParked);
        const orderToRecover = parkedFlow.find(o => o.id === recoverId);
        if (orderToRecover) {
          setCart(orderToRecover.items || []);
          if (orderToRecover.client && orderToRecover.client.id) {
            setSelectedClient(orderToRecover.client);
          }
          setTableNumber(orderToRecover.tableNumber || "");
          setDinersCount(orderToRecover.dinersCount || 2);
          setOrderType(orderToRecover.orderType || "LOCAL");
          setCurrentOrderId(orderToRecover.id);

          // DO NOT delete it from parked here, so it's not lost if user navigates away.

          router.replace('/tpv');
        }
      }
    }
  }, [recoverId, router, setCart, setSelectedClient]);

  const handleProductClick = (prod: Product) => {
    if (prod.categoryId === "4" && prod.ingredients) {
      setCurrentPizza(prod);
      setIsIngredientsModalOpen(true);
    } else {
      addToCart(prod);
    }
  };

  const confirmCustomPizza = (pizza: Product, customIngredients: string[], extraCost: number) => {
    addToCart(pizza, customIngredients, extraCost);
    setIsIngredientsModalOpen(false);
    setCurrentPizza(null);
  };

  const handleParkOrder = () => {
    if (cart.length === 0 && !currentOrderId) return;

    // Create new order object keeping the existing ID or a new one
    const newOrder = {
      id: currentOrderId || Date.now().toString(),
      items: cart,
      itemsCount: cart.length,
      total,
      orderType,
      client: selectedClient,
      tableNumber,
      dinersCount,
      date: new Date().toISOString(),
      // Remove 'reservado' status since it's actively parked now
      status: "aparcado"
    };

    const savedParked = localStorage.getItem("parked_orders");
    const parkedFlow = savedParked ? JSON.parse(savedParked) : [];

    // Filter out the old version if it existed
    const updatedFlow = parkedFlow.filter((o: any) => o.id !== newOrder.id);

    localStorage.setItem("parked_orders", JSON.stringify([newOrder, ...updatedFlow]));

    setCurrentKitchenOrder(newOrder);
    setIsKitchenTicketModalOpen(true);
    clearCart();
    setTableNumber("");
    setDinersCount(2);
    setCurrentOrderId(null);
    deselectClient();
  };

  const handleChargeOrder = () => {
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = (method: "EFECTIVO" | "TARJETA", tendered: string) => {
    const newPaidOrder = {
      id: Date.now().toString(),
      items: cart,
      itemsCount: cart.length,
      total,
      orderType,
      client: selectedClient,
      paymentMethod: method,
      tableNumber,
      dinersCount,
      date: new Date().toISOString()
    };
    const savedPaid = localStorage.getItem("paid_orders");
    const paidFlow = savedPaid ? JSON.parse(savedPaid) : [];
    localStorage.setItem("paid_orders", JSON.stringify([newPaidOrder, ...paidFlow]));

    if (currentOrderId) {
      const savedParked = localStorage.getItem("parked_orders");
      if (savedParked) {
        const parkedFlow = JSON.parse(savedParked);
        const updatedParked = parkedFlow.filter((o: any) => o.id !== currentOrderId);
        localStorage.setItem("parked_orders", JSON.stringify(updatedParked));
      }
    }

    setCurrentOrderId(null);
    setIsPaymentModalOpen(false);
    setIsTicketModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("current_employee");
    setCurrentEmployee(null);
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
      <Header
        currentEmployee={currentEmployee}
        onOpenEmployeeModal={() => setIsEmployeeModalOpen(true)}
        cart={cart}
        onNavigateToListados={() => router.push('/listados')}
      />

      <main className="flex-1 overflow-hidden flex relative z-0">
        <OrderPanel
          orderType={orderType}
          setOrderType={setOrderType}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          setIsClientModalOpen={setIsClientModalOpen}
          setIsNewClientModalOpen={setIsNewClientModalOpen}
          tableNumber={tableNumber}
          setTableNumber={setTableNumber}
          dinersCount={dinersCount}
          setDinersCount={setDinersCount}
          total={total}
          handleParkOrder={handleParkOrder}
          handleChargeOrder={handleChargeOrder}
        />

        <div className="flex-1 flex flex-col bg-slate-50/50 relative">
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>

          <div className="px-8 z-20 sticky top-0 bg-slate-50/80 backdrop-blur-md pb-2 pt-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <CategorySelector
              categories={MOCK_CATEGORIES}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6 no-scrollbar pb-32">
            <ProductGrid
              products={MOCK_PRODUCTS}
              activeCategory={activeCategory}
              onProductClick={handleProductClick}
            />
          </div>
        </div>
      </main>

      {/* Modales */}
      <CustomPizzaModal
        isOpen={isIngredientsModalOpen}
        pizza={currentPizza}
        onClose={() => setIsIngredientsModalOpen(false)}
        onConfirm={confirmCustomPizza}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={total}
        onConfirmPayment={handleConfirmPayment}
      />

      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        orderType={orderType}
        tableNumber={tableNumber}
        dinersCount={dinersCount}
        cart={cart}
        total={total}
        onPrint={() => {
          window.print();
          clearCart();
          setIsTicketModalOpen(false);
        }}
      />

      <KitchenTicketModal
        isOpen={isKitchenTicketModalOpen}
        onClose={() => setIsKitchenTicketModalOpen(false)}
        order={currentKitchenOrder}
        onPrint={() => {
          window.print();
          setIsKitchenTicketModalOpen(false);
        }}
      />

      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        currentEmployee={currentEmployee}
        onClose={() => setIsEmployeeModalOpen(false)}
        onLogin={(emp) => {
          setCurrentEmployee(emp);
          localStorage.setItem("current_employee", JSON.stringify(emp));
          setIsEmployeeModalOpen(false);
        }}
        onLogout={handleLogout}
      />

      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        clientsList={clientsList}
        clientSearchQuery={clientSearchQuery}
        setClientSearchQuery={setClientSearchQuery}
        onSelectClient={(c) => {
          setSelectedClient(c);
          setIsClientModalOpen(false);
        }}
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
        onSave={handleSaveNewClient}
      />

    </div>
  );
}

export default function TPVPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-50 text-indigo-600 font-bold">Cargando TPV...</div>}>
      <TPVContent />
    </Suspense>
  );
}
