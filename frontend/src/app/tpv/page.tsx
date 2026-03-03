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
import { API_URL } from "../../config/api";

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

  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  // Modales adicionales
  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);
  const [currentPizza, setCurrentPizza] = useState<Product | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isKitchenTicketModalOpen, setIsKitchenTicketModalOpen] = useState(false);
  const [currentKitchenOrder, setCurrentKitchenOrder] = useState<Order | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Load employee from localStorage (Client-only)
    const saved = localStorage.getItem("current_employee");
    if (saved) {
      setCurrentEmployee(JSON.parse(saved));
    } else {
      setIsEmployeeModalOpen(true);
    }

    // Fetch initial data
    fetch(`${API_URL}/api/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error fetching categories:", err));

    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    if (recoverId) {
      const fetchRecoverOrder = async () => {
        try {
          const res = await fetch(`${API_URL}/api/orders/${recoverId}`);
          if (res.ok) {
            const orderToRecover = await res.json();
            if (orderToRecover) {
              const mappedCart = (orderToRecover.items || []).map((orderItem: any) => {
                // If it's already a product (e.g. from local storage fallback mapping or old API schema format)
                if (orderItem.categoryId !== undefined) return orderItem;

                // Map from OrderItem + Product relation to flat Product interface expected by Cart
                return {
                  ...(orderItem.product || {}), // Contains id (which will be overwritten), name, categoryId, etc
                  id: orderItem.productId || orderItem.id,
                  price: orderItem.product?.price || orderItem.unitPrice || 0,
                  cartId: orderItem.id, // Keep the OrderItem ID as cartId to avoid React key collisions
                  cartExtraCost: (orderItem.unitPrice || 0) - (orderItem.product?.price || 0)
                };
              });

              setCart(mappedCart);
              if (orderToRecover.customer) {
                setSelectedClient(orderToRecover.customer);
              }
              setTableNumber(orderToRecover.tableNumber || "");
              setDinersCount(orderToRecover.dinersCount || 2);
              setOrderType(orderToRecover.type || orderToRecover.orderType || "LOCAL");
              setCurrentOrderId(orderToRecover.id);

              router.replace('/tpv');
            }
          }
        } catch (error) {
          console.error("Error recovering order:", error);
        }
      };

      fetchRecoverOrder();
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

  const handleParkOrder = async () => {
    if (cart.length === 0 && !currentOrderId) return;

    try {
      const orderData = {
        items: cart,
        itemsCount: cart.length,
        total,
        totalNeto: total,
        type: orderType,
        orderType, // Retained purely for frontend compat context
        client: selectedClient,
        tableNumber,
        dinersCount,
        date: new Date().toISOString(),
        status: "aparcado"
      };

      let endpoint = `${API_URL}/api/orders`;
      let method = "POST";

      // UUID verification
      if (currentOrderId && currentOrderId.includes("-")) {
        endpoint = `${API_URL}/api/orders/${currentOrderId}`;
        method = "PUT";
      }

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) throw new Error("Error at API");

      const savedOrder = await res.json();
      setCurrentKitchenOrder({ ...savedOrder, items: cart });
      setIsKitchenTicketModalOpen(true);
      clearCart();
      setTableNumber("");
      setDinersCount(2);
      setCurrentOrderId(null);
      deselectClient();
    } catch (err) {
      console.error("Error to park order:", err);
      alert("Error al guardar o actualizar en la API.");
    }
  };

  const handleConfirmPayment = async (method: "EFECTIVO" | "TARJETA", tendered: string) => {
    try {
      const orderData = {
        items: cart,
        itemsCount: cart.length,
        total,
        totalNeto: total,
        type: orderType,
        orderType,
        client: selectedClient,
        paymentMethod: method,
        tenderedAmount: method === "EFECTIVO" ? tendered : null,
        tableNumber,
        dinersCount,
        date: new Date().toISOString(),
        status: "PAGADO"
      };

      let endpoint = `${API_URL}/api/orders`;
      let reqMethod = "POST";

      if (currentOrderId && currentOrderId.includes("-")) {
        endpoint = `${API_URL}/api/orders/${currentOrderId}`;
        reqMethod = "PUT";
      }

      const res = await fetch(endpoint, {
        method: reqMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) throw new Error("Error updating API");

      setCurrentOrderId(null);
      setIsPaymentModalOpen(false);
      setIsTicketModalOpen(true);
    } catch (err) {
      console.error("Failed to pay order via API:", err);
      alert("Error de pago en la API.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("current_employee");
    setCurrentEmployee(null);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden selection:bg-indigo-100 flex-row">
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

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

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header
          currentEmployee={currentEmployee}
          onOpenEmployeeModal={() => setIsEmployeeModalOpen(true)}
          onNavigateToListados={() => router.push('/listados')}
        />

        <main className="flex-1 overflow-hidden flex flex-col relative z-0">
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
        </main>
      </div>

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
