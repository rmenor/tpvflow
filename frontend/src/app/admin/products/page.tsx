"use client";

import { useEffect, useState } from "react";
import { Package, Plus, Edit2, Trash2 } from "lucide-react";
import { API_URL } from "../../../config/api";
import ProductModal from "../../../components/modals/admin/ProductModal";

type Category = {
    id: string;
    name: string;
};

type Product = {
    id: string;
    name: string;
    price: number;
    categoryId: string;
    ingredients: string[];
    category?: Category;
};

export default function ProductsAdminPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Product | null>(null);

    const handleSave = async (data: Omit<Product, 'id' | 'category'> & { id?: string }) => {
        try {
            const method = data.id ? 'PUT' : 'POST';
            const url = data.id ? `${API_URL}/api/products/${data.id}` : `${API_URL}/api/products`;
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Error al guardar');

            // Re-fetch everything to get the category info 
            const productsRes = await fetch(`${API_URL}/api/products`);
            const allProducts = await productsRes.json();
            setProducts(allProducts);

            setIsModalOpen(false);
            setEditingItem(null);
        } catch (err) {
            console.error(err);
            alert('Error al guardar');
        }
    };

    const handleEdit = (product: Product) => {
        setEditingItem(product);
        setIsModalOpen(true);
    };

    useEffect(() => {
        fetch(`${API_URL}/api/products`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching products:", err);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que quieres eliminar este producto?")) return;
        try {
            await fetch(`${API_URL}/api/products/${id}`, { method: "DELETE" });
            setProducts(products.filter((p) => p.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        <Package className="w-8 h-8 text-indigo-500" />
                        Catálogo de Productos
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Administra tus platos, bebidas, precios e ingredientes.
                    </p>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-colors active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Añadir Producto
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm font-semibold uppercase tracking-wider">
                                <th className="p-4">Articulo</th>
                                <th className="p-4">Categoría</th>
                                <th className="p-4 text-right">Precio Base</th>
                                <th className="p-4 rounded-tr-2xl text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400">
                                        Cargando productos...
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400">
                                        No hay productos registrados.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-semibold text-gray-900">{product.name}</p>
                                            {product.ingredients && product.ingredients.length > 0 && (
                                                <p className="text-xs text-gray-500 mt-1">{product.ingredients.join(', ')}</p>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                {product.category?.name || 'Clasificando...'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-bold text-gray-900">€{product.price.toFixed(2)}</td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingItem}
            />
        </div>
    );
}
