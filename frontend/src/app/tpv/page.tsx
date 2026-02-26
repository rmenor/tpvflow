"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MOCK_CLIENTS = [
  { id: "1", name: "Ramon Menor", address: "C/ San Onofre 31", phone: "600 123 456" },
  { id: "2", name: "Maria Garcia", address: "Av. Constitución 4, 2B", phone: "611 987 654" },
  { id: "3", name: "Anticapizza", address: "Santa Rosa 42", phone: "966 338 595" },
  { id: "4", name: "Carlos Perez", address: "Plaza España 1", phone: "622 345 678" }
];

const MOCK_EMPLOYEES = [
  { id: "1", name: "Ramon Menor", initials: "RM", pin: "1234", role: "Manager", color: "from-indigo-500 to-purple-500" },
  { id: "2", name: "Maria Garcia", initials: "MG", pin: "4321", role: "Cajera", color: "from-emerald-500 to-teal-500" },
  { id: "3", name: "Carlos Perez", initials: "CP", pin: "0000", role: "Camarero", color: "from-amber-500 to-orange-500" }
];

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("1");
  const [cart, setCart] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("COMANDA");
  const [orderType, setOrderType] = useState<"LOCAL" | "DOMICILIO">("LOCAL");
  const [selectedClient, setSelectedClient] = useState<any>({ name: "Sin nombre", address: "C/ San Onofre 31" });

  // Estados para Mesa
  const [tableNumber, setTableNumber] = useState<string>("");
  const [dinersCount, setDinersCount] = useState<number>(1);

  // Estados para el Modal de Cliente
  const [clientsList, setClientsList] = useState<any[]>(MOCK_CLIENTS);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState("");

  // Estado para Crear Cliente
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [newClientData, setNewClientData] = useState({ name: "", phone: "", address: "" });

  const handleSaveNewClient = () => {
    if (!newClientData.name) return;
    const newId = (clientsList.length + 1).toString();
    const clientToSave = { id: newId, ...newClientData };
    setClientsList(prev => [...prev, clientToSave]);
    setSelectedClient(clientToSave);
    setIsNewClientModalOpen(false);
    setIsClientModalOpen(false);
    setNewClientData({ name: "", phone: "", address: "" });
  };

  // Estado para el Modal de Ticket
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // Estado para el Modal de Ticket de Cocina
  const [isKitchenTicketModalOpen, setIsKitchenTicketModalOpen] = useState(false);
  const [currentKitchenOrder, setCurrentKitchenOrder] = useState<any>(null);

  // Estados para el Modal de Pago
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"EFECTIVO" | "TARJETA">("EFECTIVO");
  const [tenderedAmount, setTenderedAmount] = useState<string>("");

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

    // In dev, assuming the Next.js app is on port 3000 and NestJS is on 3001
    const fetchApi = async () => {
      try {
        const resCat = await fetch("http://localhost:3001/api/categories");
        if (resCat.ok) {
          const cats = await resCat.json();
          setCategories(cats);
          if (cats.length > 0) setActiveCategory(cats[0].id);
        }

        const resProd = await fetch("http://localhost:3001/api/products");
        if (resProd.ok) {
          const prods = await resProd.json();
          setProducts(prods);
        }
      } catch (err) {
        console.error("Error fetching data", err);
        setCategories([
          { id: '1', name: 'Entrantes' },
          { id: '2', name: 'Ensaladas' },
          { id: '3', name: 'Pizzas' },
          { id: '5', name: 'Postres' },
        ]);
        setProducts([
          { id: '1', categoryId: '1', name: 'Alitas de Pollo', price: 3.30 },
          { id: '2', categoryId: '1', name: 'Aros de cebolla', price: 1.80 },
          { id: '6', categoryId: '3', name: 'Pizza Margarita', price: 8.50, ingredients: ['Tomate', 'Queso'] },
          { id: '7', categoryId: '3', name: 'Pizza Prosciutto', price: 9.50, ingredients: ['Tomate', 'Queso', 'Jamón York'] },
          { id: '5', categoryId: '5', name: 'Mousse de Choco', price: 2.30 },
        ]);
      }
    };
    fetchApi();

    // Comprobar si hay una comanda para recuperar
    const params = new URLSearchParams(window.location.search);
    const recoverId = params.get("recover");
    if (recoverId) {
      const saved = localStorage.getItem("parked_orders");
      if (saved) {
        const parked = JSON.parse(saved);
        const orderToRecover = parked.find((o: any) => o.id === recoverId);
        if (orderToRecover) {
          setCart(orderToRecover.items);
          setOrderType(orderToRecover.orderType);
          setSelectedClient(orderToRecover.client);
          if (orderToRecover.tableNumber !== undefined) setTableNumber(orderToRecover.tableNumber);
          if (orderToRecover.dinersCount !== undefined) setDinersCount(orderToRecover.dinersCount);

          // Eliminarla de guardadas
          const updated = parked.filter((o: any) => o.id !== recoverId);
          localStorage.setItem("parked_orders", JSON.stringify(updated));

          // Limpiar la URL para evitar recuperar dos veces
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }
  }, []);

  // Estados para Modal de Ingredientes de Pizza
  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);
  const [currentPizza, setCurrentPizza] = useState<any>(null);
  const [removedBaseIngredients, setRemovedBaseIngredients] = useState<string[]>([]);
  const [addedExtraIngredients, setAddedExtraIngredients] = useState<any[]>([]);

  const EXTRA_INGREDIENTS = [
    { name: "Extra Queso", price: 1.50 },
    { name: "Bacon", price: 1.20 },
    { name: "Champiñones", price: 1.00 },
    { name: "Cebolla", price: 0.80 },
    { name: "Atún", price: 1.50 },
    { name: "Pepperoni", price: 1.20 },
    { name: "Aceitunas", price: 0.80 },
    { name: "Huevo", price: 1.00 },
    { name: "Pollo", price: 1.80 },
    { name: "Salsa BBQ", price: 0.50 },
    { name: "Carne Picada", price: 1.20 },
    { name: "Jamón York", price: 1.00 },
  ];

  const handleProductClick = (prod: any) => {
    // Si es de la categoría 4 (Pizzas), mostramos el modal de ingredientes
    if (prod.categoryId === '4' || prod.categoryId === '3') {
      setCurrentPizza(prod);
      // Extraemos sus ingredientes base u opciones, por defecto vacío para no mezclar en el estado
      setRemovedBaseIngredients([]);
      setAddedExtraIngredients([]);
      setIsIngredientsModalOpen(true);
    } else {
      addToCart(prod);
    }
  };

  const confirmCustomPizza = () => {
    if (currentPizza) {
      const customIngredientsList = [
        ...removedBaseIngredients.map(ing => `SIN ${ing}`),
        ...addedExtraIngredients.map(ing => `+ ${ing.name}`)
      ];
      const extraCost = addedExtraIngredients.reduce((acc, ing) => acc + ing.price, 0);

      addToCart(currentPizza, customIngredientsList, extraCost);
      setIsIngredientsModalOpen(false);
      setCurrentPizza(null);
      setRemovedBaseIngredients([]);
      setAddedExtraIngredients([]);
    }
  };

  const addToCart = (product: any, customIngredients?: string[], extraPrice: number = 0) => {
    setCart((prev) => {
      const isCustomized = customIngredients && customIngredients.length > 0;
      // Generamos un ID único si está customizada para no colapsar con la pizza base u otras configuraciones
      const finalId = isCustomized ? `${product.id}-${[...customIngredients].sort().join('-')}` : product.id;

      const existing = prev.find((item) => item.id === finalId);
      if (existing) {
        return prev.map((item) =>
          item.id === finalId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, id: finalId, originalId: product.id, quantity: 1, price: product.price + extraPrice, customIngredients }];
    });
  };

  const removeFromCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter((item) => item.id !== product.id);
    });
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleNavigateToListados = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cart.length > 0) {
      const newOrder = {
        id: Date.now().toString(),
        items: cart,
        itemsCount: cart.length,
        total: total,
        orderType: orderType,
        client: selectedClient,
        tableNumber: tableNumber,
        dinersCount: dinersCount
      };
      const saved = localStorage.getItem("parked_orders");
      const parkedFlow = saved ? JSON.parse(saved) : [];
      localStorage.setItem("parked_orders", JSON.stringify([...parkedFlow, newOrder]));
    }
    router.push("/listados");
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden selection:bg-indigo-100">
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* BARRA LATERAL (ORDER) */}
      <div className="w-[320px] bg-white border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-10 shrink-0 print:hidden">

        {/* Cabecera del Sidebar */}
        <div className="p-4 pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Orden en curso</p>
              <h1 className="text-xl font-black tracking-tight text-slate-900">Ticket #3200</h1>
            </div>
            <button
              onClick={() => setOrderType(prev => prev === "LOCAL" ? "DOMICILIO" : "LOCAL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${orderType === "LOCAL"
                ? "bg-indigo-50/80 text-indigo-600 hover:bg-indigo-100"
                : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse transition-colors ${orderType === "LOCAL" ? "bg-indigo-500" : "bg-amber-500"}`}></span>
              {orderType}
            </button>
          </div>

          {/* Selector Segmentado Moderno */}
          <div className="flex bg-slate-100/80 p-1 rounded-2xl">
            {["COMANDA", "CLIENTE", "MESA"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${activeTab === tab
                  ? "bg-white text-indigo-900 shadow-sm transform scale-[1.02]"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido Dinámico del Sidebar según el Tab */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-50/30">

          {/* TAB COMANDA */}
          {activeTab === "COMANDA" && (
            <>
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-60">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-slate-500">Añade productos a la orden</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex flex-col mb-1 group transition-all bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-3">
                        <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1">{item.name}</h3>
                        {item.customIngredients && item.customIngredients.length > 0 && (
                          <p className="text-[10px] text-slate-500 font-semibold leading-tight line-clamp-2 mb-1.5 flex flex-wrap gap-1">
                            {item.customIngredients.map((ing: string, i: number) => (
                              <span key={i} className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-md border border-amber-100">+ {ing}</span>
                            ))}
                          </p>
                        )}
                        <p className="text-indigo-600 font-black text-xs">{item.price.toFixed(2)} &euro;</p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right font-black text-slate-900 text-[15px]">
                          {(item.price * item.quantity).toFixed(2)} <span className="text-[11px] text-slate-400">&euro;</span>
                        </div>

                        {/* Controles de Cantidad */}
                        <div className="flex items-center gap-2 bg-white rounded-full p-1 border border-slate-200/60 shadow-sm transition-all group-hover:border-indigo-100">
                          <button
                            onClick={() => removeFromCart(item)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg>
                          </button>
                          <span className="w-5 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* TAB CLIENTE */}
          {activeTab === "CLIENTE" && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Tarjeta de Cliente Actual */}
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-4 rounded-2xl shadow-lg shadow-indigo-600/20 mb-4">
                <div className="flex items-center justify-between mb-4 opacity-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex flex-shrink-0 items-center justify-center">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-100">Cliente Asignado</span>
                  </div>
                  {/* Botón para Desmarcar Cliente */}
                  {selectedClient && selectedClient.name !== "Sin nombre" && (
                    <button
                      onClick={() => setSelectedClient({ name: "Sin nombre", address: "C/ San Onofre 31" })}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white hover:text-indigo-600 transition-colors"
                      title="Desmarcar cliente"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>

                <h2 className="text-2xl font-black tracking-tight mb-2 truncate">{selectedClient?.name || "Sin nombre"}</h2>

                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-indigo-100">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <p className="text-sm leading-snug font-medium line-clamp-2">{selectedClient?.address || "Sin dirección"}</p>
                  </div>
                  {selectedClient?.phone && (
                    <div className="flex items-start gap-2 text-indigo-100">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      <p className="text-sm leading-snug font-medium line-clamp-2">{selectedClient.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Acciones de Cliente */}
              <div className="space-y-3 mt-2">
                <button
                  onClick={() => setIsClientModalOpen(true)}
                  className="w-full bg-white border border-slate-200/80 p-4 rounded-2xl text-slate-700 font-bold hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-md flex items-center justify-between transition-all group"
                >
                  <span className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    Seleccionar Cliente
                  </span>
                  <svg className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>

                <button
                  onClick={() => setIsNewClientModalOpen(true)}
                  className="w-full bg-white border border-slate-200/80 p-4 rounded-2xl text-slate-700 font-bold hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-md flex items-center justify-between transition-all group"
                >
                  <span className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 text-slate-400 group-hover:border-indigo-600 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                    </div>
                    Nuevo Cliente
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* TAB MESA */}
          {activeTab === "MESA" && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white border text-center border-slate-200/80 pt-6 pb-4 px-4 rounded-2xl mb-2 shadow-sm flex-1 flex flex-col justify-start">
                <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">Número de Mesa</h3>
                <div className="flex justify-center mb-4">
                  <input
                    type="text"
                    value={tableNumber}
                    readOnly
                    placeholder="0"
                    className="w-20 h-20 text-center text-[36px] font-black text-indigo-700 bg-indigo-50/50 rounded-2xl border border-indigo-100 placeholder:text-indigo-200 transition-all shadow-inner"
                  />
                </div>

                {/* Pad numérico táctil */}
                <div className="grid grid-cols-3 gap-2 px-2 mb-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                      key={num}
                      onClick={() => setTableNumber(prev => prev.length < 3 ? prev + num : prev)}
                      className="h-12 bg-slate-100 rounded-xl font-black text-xl hover:bg-slate-200 active:scale-95 transition-all text-slate-700 shadow-sm border border-slate-200/60"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={() => setTableNumber("")}
                    className="h-12 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 active:scale-95 transition-all shadow-sm border border-red-100 flex items-center justify-center"
                  >
                    DEL
                  </button>
                  <button
                    onClick={() => setTableNumber(prev => prev.length < 3 ? prev + "0" : prev)}
                    className="h-12 bg-slate-100 rounded-xl font-black text-xl hover:bg-slate-200 active:scale-95 transition-all text-slate-700 shadow-sm border border-slate-200/60"
                  >
                    0
                  </button>
                  <button
                    onClick={() => setTableNumber(prev => prev.slice(0, -1))}
                    className="h-12 bg-amber-50 rounded-xl hover:bg-amber-100 active:scale-95 transition-all text-amber-600 shadow-sm flex items-center justify-center font-bold border border-amber-100"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" /></svg>
                  </button>
                </div>

                <div className="w-full h-px bg-slate-100 mb-4"></div>

                <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">Comensales</h3>
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => setDinersCount(Math.max(1, dinersCount - 1))}
                    className="w-14 h-14 rounded-[16px] bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 hover:shadow-sm flex items-center justify-center transition-all text-3xl font-black active:scale-95 border border-slate-200/80"
                  >
                    -
                  </button>
                  <span className="text-[36px] font-black text-slate-800 w-16 text-center">{dinersCount}</span>
                  <button
                    onClick={() => setDinersCount(dinersCount + 1)}
                    className="w-14 h-14 rounded-[16px] bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 hover:shadow-sm flex items-center justify-center transition-all text-3xl font-black active:scale-95 border border-indigo-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Zona de Pago (Footer) */}
        <div className="p-4 bg-white border-t border-slate-100 relative z-20 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-end mb-4">
            <span className="text-slate-500 font-bold uppercase text-xs tracking-wider">Total a pagar</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">{total.toFixed(2)} <span className="text-lg text-slate-400">&euro;</span></span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const newOrder = {
                  id: Date.now().toString(),
                  items: cart,
                  itemsCount: cart.length,
                  total: total,
                  orderType: orderType,
                  client: selectedClient,
                  tableNumber: tableNumber,
                  dinersCount: dinersCount
                };
                const saved = localStorage.getItem("parked_orders");
                const parkedFlow = saved ? JSON.parse(saved) : [];
                localStorage.setItem("parked_orders", JSON.stringify([...parkedFlow, newOrder]));

                setCurrentKitchenOrder(newOrder);
                setIsKitchenTicketModalOpen(true);

                setCart([]);
                setOrderType("LOCAL");
                setSelectedClient({ name: "Sin nombre", address: "C/ San Onofre 31" });
                setTableNumber("");
                setDinersCount(1);
              }}
              disabled={cart.length === 0}
              className={`w-1/3 relative overflow-hidden group rounded-[20px] py-4.5 font-bold text-base shadow-lg flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.98] ${cart.length === 0
                ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                : "bg-white border border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600 focus:ring-4 focus:ring-slate-100"
                }`}
              title="Aparcar Comanda"
            >
              <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              <span className="relative z-10 text-[11px] uppercase tracking-wider">Aparcar</span>
            </button>

            <button
              onClick={() => {
                if (orderType === "DOMICILIO" && (!selectedClient || selectedClient.name === "Sin nombre")) {
                  setIsClientModalOpen(true);
                } else {
                  setPaymentMethod("EFECTIVO");
                  setTenderedAmount("");
                  setIsPaymentModalOpen(true);
                }
              }}
              disabled={cart.length === 0}
              className={`w-2/3 relative overflow-hidden group rounded-[20px] py-4.5 font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${cart.length === 0
                ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                : "bg-indigo-600 text-white shadow-indigo-600/25 hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-100"
                }`}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <span className="relative z-10">Cobrar Pedido</span>
            </button>
          </div>
        </div>
      </div>

      {/* ÁREA PRINCIPAL DERECHA */}
      <div className="flex-1 flex flex-col h-full bg-[#f8fafc] print:hidden">

        {/* Barra de Navegación Superior */}
        <header className="h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <div className="font-black flex flex-col leading-none">
              <span className="text-indigo-600 text-xl tracking-tighter">Viejita</span>
              <span className="text-slate-400 text-xs tracking-widest uppercase">Pizza</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl">
              <Link href="/tpv" className="px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 bg-white text-indigo-900 shadow-sm">
                TPV
              </Link>
              <button onClick={handleNavigateToListados} className="px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50">
                Listados
              </button>
            </nav>
            <div className="w-px h-8 bg-slate-200 hidden lg:block"></div>
            <div
              onClick={() => {
                setIsEmployeeModalOpen(true);
                setSelectedEmployeeToUnlock(null);
                setEnteredPin("");
                setPinError(false);
              }}
              className="flex items-center gap-3 bg-white border border-slate-200/80 pl-2 pr-4 py-1.5 rounded-full shadow-sm cursor-pointer hover:border-slate-300 transition-colors"
            >
              <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${currentEmployee ? currentEmployee.color : 'from-slate-400 to-slate-500'} flex items-center justify-center text-white font-bold text-xs shadow-inner`}>
                {currentEmployee ? currentEmployee.initials : 'TP'}
              </div>
              <span className="text-sm font-bold text-slate-700">{currentEmployee ? currentEmployee.name.split(' ')[0] : 'Bloqueado'}</span>
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
          </div>
        </header>

        {/* Contenido Principal (Categorías y Grid) */}
        <main className="flex-1 overflow-auto p-8 lg:p-10 no-scrollbar">

          {/* Tabs de Categorías */}
          <div className="flex items-center gap-3 overflow-x-auto pt-4 pb-8 -mt-4 px-2 -mx-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-7 py-3.5 rounded-2xl text-[15px] font-bold transition-all duration-300 border ${activeCategory === cat.id
                  ? "bg-slate-900 text-white border-slate-900 shadow-[0_8px_16px_rgba(0,0,0,0.1)] transform -translate-y-1"
                  : "bg-white text-slate-500 border-slate-200/80 hover:border-indigo-200 hover:text-indigo-700 shadow-sm hover:shadow-md"
                  }`}
              >
                <span className="capitalize">{cat.name.toLowerCase()}</span>
              </button>
            ))}
          </div>

          {/* Grid de Productos */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products
              .filter((p) => p.categoryId === activeCategory)
              .map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => handleProductClick(prod)}
                  className="group bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg hover:shadow-indigo-100/60 hover:border-indigo-100 transition-all duration-300 flex flex-col text-left overflow-hidden transform hover:-translate-y-1 relative"
                >
                  <div className="h-28 w-full bg-slate-100 relative overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=300&h=200`}
                      alt=""
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-2 left-3 right-3">
                      <h3 className="font-extrabold text-white text-[15px] leading-tight drop-shadow-md truncate">
                        {prod.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-3 w-full bg-white flex items-center justify-between">
                    <span className="font-black text-lg text-slate-700 group-hover:text-indigo-600 transition-colors tracking-tight">
                      {prod.price.toFixed(2)} <span className="text-sm font-bold">&euro;</span>
                    </span>
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all duration-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
          </div>

        </main>
      </div>

      {/* MODAL DE SELECCIÓN DE CLIENTE */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Cabecera del Modal */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Seleccionar Cliente</h2>
              <button onClick={() => setIsClientModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 hover:text-slate-800 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Buscador */}
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

            {/* Lista de Resultados */}
            <div className="px-6 pb-6 mt-4 max-h-[40vh] overflow-y-auto space-y-2 no-scrollbar">
              {clientsList
                .filter(c => c.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) || c.phone.includes(clientSearchQuery))
                .map(client => (
                  <button
                    key={client.id}
                    onClick={() => {
                      setSelectedClient(client);
                      setIsClientModalOpen(false);
                      setClientSearchQuery(""); // limpiar búsqueda al elegir
                    }}
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
              {clientsList.filter(c => c.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) || c.phone.includes(clientSearchQuery)).length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <p>No se encontraron clientes.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => {
                  setIsClientModalOpen(false);
                  setIsNewClientModalOpen(true);
                }}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                Crear nuevo cliente
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL CREAR NUEVO CLIENTE */}
      {isNewClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Crear Nuevo Cliente</h2>
              <button onClick={() => setIsNewClientModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 hover:text-slate-800 transition-colors">
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
                onClick={() => setIsNewClientModalOpen(false)}
                className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNewClient}
                disabled={!newClientData.name}
                className={`flex-1 py-4 font-bold rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2 ${!newClientData.name ? 'bg-indigo-300 text-white cursor-not-allowed shadow-none' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
              >
                Guardar Cliente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PAGO */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col sm:flex-row">

            {/* Panel Izquierdo: Resumen y Cambio */}
            <div className="w-full sm:w-2/5 bg-slate-50 p-8 border-r border-slate-100 flex flex-col">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total a Pagar</h2>
              <div className="text-4xl font-black text-slate-900 tracking-tight mb-8">
                {total.toFixed(2)} <span className="text-2xl text-slate-400">&euro;</span>
              </div>

              <div className="flex-1">
                {paymentMethod === "EFECTIVO" && (
                  <div className="animate-in fade-in duration-300">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Entregado</h2>
                    <div className="text-3xl font-black text-indigo-600 tracking-tight mb-6">
                      {tenderedAmount ? Number(tenderedAmount).toFixed(2) : "0.00"} <span className="text-xl text-indigo-400">&euro;</span>
                    </div>

                    <div className="h-px w-full bg-slate-200 mb-6"></div>

                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Cambio</h2>
                    <div className={`text-4xl font-black tracking-tight ${Number(tenderedAmount) >= total ? "text-emerald-500" : "text-slate-300"}`}>
                      {tenderedAmount && Number(tenderedAmount) >= total ? (Number(tenderedAmount) - total).toFixed(2) : "0.00"} <span className="text-2xl opacity-60">&euro;</span>
                    </div>
                  </div>
                )}

                {paymentMethod === "TARJETA" && (
                  <div className="animate-in fade-in duration-300 h-full flex flex-col justify-center items-center text-center opacity-60">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>
                    <p className="font-bold text-slate-500">Pago por datáfono</p>
                    <p className="text-sm font-medium text-slate-400 mt-1">No requiere cálculo de cambio</p>
                  </div>
                )}
              </div>
            </div>

            {/* Panel Derecho: Métodos y Teclado */}
            <div className="w-full sm:w-3/5 bg-white p-8 flex flex-col">

              {/* Selector de Método */}
              <div className="flex bg-slate-100/80 p-1.5 rounded-[20px] mb-8">
                <button
                  onClick={() => setPaymentMethod("EFECTIVO")}
                  className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${paymentMethod === "EFECTIVO"
                    ? "bg-white text-indigo-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Efectivo
                </button>
                <button
                  onClick={() => {
                    setPaymentMethod("TARJETA");
                    setTenderedAmount("");
                  }}
                  className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${paymentMethod === "TARJETA"
                    ? "bg-white text-indigo-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  Tarjeta
                </button>
              </div>

              {paymentMethod === "EFECTIVO" ? (
                <>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[5, 10, 20, 50].map((bill) => (
                      <button
                        key={bill}
                        onClick={() => setTenderedAmount(bill.toString())}
                        className="py-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-200 border border-emerald-100 font-bold rounded-[16px] text-lg transition-colors flex flex-col items-center justify-center"
                      >
                        <span className="text-xs opacity-60 mb-0.5">Billete</span>
                        {bill}&euro;
                      </button>
                    ))}
                  </div>

                  {/* Teclado Numérico Custom */}
                  <div className="grid grid-cols-3 gap-2 flex-1 mb-6">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "C"].map((key) => (
                      <button
                        key={key}
                        onClick={() => {
                          if (key === "C") {
                            setTenderedAmount("");
                          } else if (key === ".") {
                            if (!tenderedAmount.includes(".")) setTenderedAmount(prev => prev + key);
                          } else {
                            if (tenderedAmount.length < 6) setTenderedAmount(prev => prev + key);
                          }
                        }}
                        className={`py-3 text-xl font-bold rounded-[16px] transition-alls flex items-center justify-center ${key === "C" ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-slate-50 border border-slate-100 text-slate-700 hover:bg-slate-100"
                          }`}
                      >
                        {key === "C" ? (
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" /></svg>
                        ) : key}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 mb-6">
                  <div className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[20px] p-8 text-center flex flex-col items-center justify-center">
                    <span className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 border border-slate-100">
                      <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </span>
                    <p className="text-slate-500 font-bold mb-1">Pase la tarjeta por el lector</p>
                    <p className="text-slate-400 font-medium text-sm">Esperando conformación del TPV datáfono...</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="w-1/3 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-[20px] hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  Atrás
                </button>
                <button
                  disabled={paymentMethod === "EFECTIVO" && Number(tenderedAmount) < total}
                  onClick={() => {
                    const newPaidOrder = {
                      id: Date.now().toString(),
                      items: cart,
                      itemsCount: cart.length,
                      total: total,
                      orderType: orderType,
                      client: selectedClient,
                      paymentMethod: paymentMethod,
                      tableNumber: tableNumber,
                      dinersCount: dinersCount,
                      date: new Date().toISOString()
                    };
                    const savedPaid = localStorage.getItem("paid_orders");
                    const paidFlow = savedPaid ? JSON.parse(savedPaid) : [];
                    localStorage.setItem("paid_orders", JSON.stringify([newPaidOrder, ...paidFlow]));

                    setIsPaymentModalOpen(false);
                    // Aquí podrías guardar el ticket en backend
                    setIsTicketModalOpen(true);
                  }}
                  className={`flex-1 py-4 font-bold rounded-[20px] shadow-lg transition-colors flex items-center justify-center gap-2 ${(paymentMethod === "EFECTIVO" && Number(tenderedAmount) < total)
                    ? 'bg-indigo-300 text-white shadow-none cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/25'
                    }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  Confirmar Cobro
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL DEL TICKET DE COBRO */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:p-0 print:block print:bg-white">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm print:hidden" onClick={() => setIsTicketModalOpen(false)}></div>

          <div className="relative w-full max-w-[420px] bg-[#0E7D42] rounded-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col font-mono text-white p-8 print:max-w-none print:w-full print:border-none print:shadow-none print:rounded-none print:bg-white print:text-black">
            {/* Cabecera del Recibo */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black mb-1">Anticapizza - ALCOY</h2>
              <p className="text-sm font-bold opacity-90">IGNÁCIO MIRÓ QUILES</p>
              <p className="text-xs opacity-80 mt-1">C.I.F: 21680848-J - Telf: 966338595</p>
              <p className="text-xs opacity-80">Santa Rosa, 42</p>
              <p className="text-xs opacity-80 mb-2">03802 Alcoy</p>

              <div className="mt-4 pt-4 border-t-2 border-dashed border-white/30">
                <h3 className="text-xl font-bold">Factura simplificada</h3>
                <h3 className="text-xl font-bold mt-1">Ticket: 3200</h3>
                <div className="flex justify-between items-center mt-2 text-sm opacity-90 font-bold">
                  <span>{new Date().toLocaleDateString('es-ES')}</span>
                  <span>{new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>

            <div className="text-center bg-white/20 py-2 font-black text-xl mb-6 uppercase tracking-wider">
              {orderType === "DOMICILIO" ? "ENVIO A DOMICILIO" : "RECOGE EN LOCAL"}
            </div>

            {tableNumber && (
              <div className="text-center mb-6 text-sm font-bold bg-white/10 py-1.5 border-y border-white/20">
                MESA: {tableNumber} | COMENSALES: {dinersCount}
              </div>
            )}

            {/* Lista de Compra */}
            <div className="flex-1 overflow-auto no-scrollbar mb-6 min-h-[150px]">
              <table className="w-full text-sm text-left font-bold">
                <thead>
                  <tr className="border-b-2 border-white/40">
                    <th className="pb-2 w-12">Ca.</th>
                    <th className="pb-2">Artículo</th>
                    <th className="pb-2 text-right">Importe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {cart.map((item, idx) => (
                    <tr key={idx} className="align-top">
                      <td className="py-2.5">{item.quantity}</td>
                      <td className="py-2.5 max-w-[120px] pr-2">
                        <div className="truncate">{item.name}</div>
                        {item.customIngredients && item.customIngredients.length > 0 && (
                          <div className="text-[10px] opacity-70 font-medium leading-tight mt-0.5">
                            {item.customIngredients.map((i: string) => `+ ${i}`).join(', ')}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 text-right font-black">{(item.price * item.quantity).toFixed(2)} &euro;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="pt-4 border-t-2 border-dashed border-white/40text-right mb-8">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold opacity-90">(IVA incluido)</span>
                <span className="text-2xl font-black">Total: {total.toFixed(2)} &euro;</span>
              </div>
            </div>

            <div className="text-center font-bold text-lg mb-8 tracking-wide">
              GRACIAS POR SU VISITA
            </div>

            {/* Acciones */}
            <div className="grid grid-cols-2 gap-3 mt-auto print:hidden">
              <button
                onClick={() => setIsTicketModalOpen(false)}
                className="py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded shadow-none transition-colors border border-white/30"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  window.print();
                  setCart([]);
                  setIsTicketModalOpen(false);
                }}
                className="py-3 bg-white text-[#0E7D42] font-black rounded shadow-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DEL TICKET DE COCINA */}
      {isKitchenTicketModalOpen && currentKitchenOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:p-0 print:block print:bg-white">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm print:hidden" onClick={() => setIsKitchenTicketModalOpen(false)}></div>

          <div className="relative w-full max-w-[420px] bg-[#fdfbf7] border-t-8 border-indigo-600 rounded-b-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col font-mono text-slate-900 p-8 print:max-w-none print:w-full print:border-none print:shadow-none print:rounded-none">
            <div className="mb-4 pt-2 border-b-2 border-dashed border-slate-300 pb-4">
              <h2 className="text-3xl font-black text-center mb-2 uppercase break-words leading-tight">COMANDA COCINA</h2>
              <div className="text-center font-bold text-xl uppercase tracking-wider mb-2">
                {currentKitchenOrder.orderType === "DOMICILIO" ? "DOMICILIO" : "LOCAL"}
              </div>
              <div className="text-center text-sm font-bold opacity-80">
                Ticket: #{currentKitchenOrder.id.slice(-4)}
              </div>
            </div>

            {currentKitchenOrder.tableNumber && (
              <div className="text-center mb-6 text-xl p-3 bg-slate-200/50 rounded-xl font-black border border-slate-300 shadow-inner">
                MESA: {currentKitchenOrder.tableNumber} | PAX: {currentKitchenOrder.dinersCount}
              </div>
            )}

            <div className="flex-1 overflow-auto no-scrollbar mb-6 min-h-[150px]">
              <table className="w-full text-lg text-left font-bold">
                <thead>
                  <tr className="border-b-2 border-slate-300">
                    <th className="pb-2 w-12 text-center">Un.</th>
                    <th className="pb-2 text-left">Artículo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentKitchenOrder.items.map((item: any, idx: number) => (
                    <tr key={idx} className="align-top">
                      <td className="py-4 text-center text-2xl font-black">{item.quantity}</td>
                      <td className="py-4 pr-2">
                        <div className="text-xl uppercase font-black tracking-tight leading-none">{item.name}</div>
                        {item.customIngredients && item.customIngredients.length > 0 && (
                          <div className="text-sm font-black text-indigo-700 leading-tight mt-1.5 p-1.5 bg-indigo-50/50 rounded-md border border-indigo-100">
                            {item.customIngredients.map((i: string) => `+ ${i}`).join(', ')}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto print:hidden">
              <button
                onClick={() => setIsKitchenTicketModalOpen(false)}
                className="py-3 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-xl shadow-sm transition-colors border border-slate-200"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  window.print();
                  setIsKitchenTicketModalOpen(false);
                }}
                className="py-3 bg-indigo-600 text-white font-black rounded-xl shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR INGREDIENTES PIZZA */}
      {isIngredientsModalOpen && currentPizza && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsIngredientsModalOpen(false)}></div>

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-end">
              <div>
                <h2 className="text-xl font-black text-slate-900">Personalizar {currentPizza.name}</h2>
                <p className="text-sm font-medium text-slate-500 mt-1">Personaliza tu pizza a tu gusto</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-indigo-600">
                  {(currentPizza.price + addedExtraIngredients.reduce((acc: number, ing: any) => acc + ing.price, 0)).toFixed(2)} &euro;
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh] bg-slate-50/50">
              {currentPizza.ingredients && currentPizza.ingredients.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Quitar Ingredientes Base (Gratis)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentPizza.ingredients.map((ing: string) => {
                      const isRemoved = removedBaseIngredients.includes(ing);
                      return (
                        <button
                          key={ing}
                          onClick={() => {
                            if (isRemoved) {
                              setRemovedBaseIngredients(prev => prev.filter(i => i !== ing));
                            } else {
                              setRemovedBaseIngredients(prev => [...prev, ing]);
                            }
                          }}
                          className={`px-4 py-2.5 rounded-xl border-2 font-bold text-[13px] transition-all flex items-center gap-2 shadow-sm ${isRemoved
                            ? 'border-red-200 bg-red-50 text-red-500 line-through opacity-80'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                          {isRemoved && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>}
                          {ing}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Añadir Extras (Tienen Coste)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {EXTRA_INGREDIENTS.filter(ing => !(currentPizza.ingredients || []).includes(ing.name)).map(ing => {
                    const isAdded = addedExtraIngredients.some(i => i.name === ing.name);
                    return (
                      <button
                        key={ing.name}
                        onClick={() => {
                          if (isAdded) {
                            setAddedExtraIngredients(prev => prev.filter(i => i.name !== ing.name));
                          } else {
                            setAddedExtraIngredients(prev => [...prev, ing]);
                          }
                        }}
                        className={`p-3.5 rounded-xl border-2 font-bold text-sm transition-all text-left flex justify-between items-center shadow-sm ${isAdded
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-inner ring-2 ring-indigo-600/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md'
                          }`}
                      >
                        <span className="truncate pr-2">{ing.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-md shrink-0 ${isAdded ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>+{ing.price.toFixed(2)}&euro;</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] relative z-10">
              <button
                onClick={() => setIsIngredientsModalOpen(false)}
                className="px-6 py-3.5 font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmCustomPizza}
                className="px-8 py-3.5 font-bold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Confirmar y Añadir
              </button>
            </div>
          </div>
        </div>
      )}

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

    </div>
  );
}
