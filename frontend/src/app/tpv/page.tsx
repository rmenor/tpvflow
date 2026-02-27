"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category, Product, Employee, Order } from "../../types";

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

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

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

  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("current_employee");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem("current_employee");
    }
    return true;
  });

  // Modales adicionales
  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);
  const [currentPizza, setCurrentPizza] = useState<Product | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isKitchenTicketModalOpen, setIsKitchenTicketModalOpen] = useState(false);
  const [currentKitchenOrder, setCurrentKitchenOrder] = useState<Order | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial data
    fetch('http://localhost:3001/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error fetching categories:", err));

    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
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
    const newOrder: Order = {
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
    const updatedFlow = parkedFlow.filter((o: Order) => o.id !== newOrder.id);

    localStorage.setItem("parked_orders", JSON.stringify([newOrder, ...updatedFlow]));

    setCurrentKitchenOrder(newOrder);
    setIsKitchenTicketModalOpen(true);
    clearCart();
    setTableNumber("");
    setDinersCount(2);
    setCurrentOrderId(null);
    deselectClient();
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
      tenderedAmount: method === "EFECTIVO" ? tendered : null,
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
        const parkedFlow: Order[] = JSON.parse(savedParked);
        const updatedParked = parkedFlow.filter(o => o.id !== currentOrderId);
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
          deselectClient={deselectClient}
          setIsClientModalOpen={setIsClientModalOpen}
          setIsNewClientModalOpen={setIsNewClientModalOpen}
          tableNumber={tableNumber}
          setTableNumber={setTableNumber}
          dinersCount={dinersCount}
          setDinersCount={setDinersCount}
          total={total}
          onParkOrder={handleParkOrder}
          onConfirmPayment={() => setIsPaymentModalOpen(true)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>

          <div className="px-8 z-20 sticky top-0 bg-slate-50/80 backdrop-blur-md pb-2 pt-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <CategorySelector
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6 no-scrollbar pb-32">
            <ProductGrid
              products={products}
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
