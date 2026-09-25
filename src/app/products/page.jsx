"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProducts, searchProducts } from "@/lib/api/products";

export default function ProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [checking, setChecking] = useState(true);

    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
    const search = searchParams.get("q") || "";

    const rawPage = parseInt(searchParams.get("page"), 10);
    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

    const rawPageSize = parseInt(searchParams.get("pageSize"), 10);
    const validSizes = [10,20,50];
    const pageSize = validSizes.includes(rawPageSize) ? rawPageSize : 10;

    const updateParams = (updates) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        params.set(key, value);
      });
      router.push(`/products?${params.toString()}`);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token) {
            router.push("/");
        } else {
            setChecking(false);
        }
    }, [router]);

    useEffect(() => {
        if(checking) return;

        const controller = new AbortController();

        const fetchProducts = async () => {
            setLoading(true);
            setError(false);
            try {
                const skip = (page-1) * pageSize;
                const data = search
                  ? await searchProducts(search, pageSize, skip, controller.signal)
                  : await getProducts(pageSize, skip, controller.signal);
                setProducts(data.products);
                setTotal(data.total);

                const maxPage = Math.max(1, Math.ceil(data.total / pageSize ));
                if( page > maxPage ) {
                  updateParams({ page: maxPage });
                }
            } catch (err) {
              if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
                      setError(true);
              }        
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        return () => controller.abort()   ;
       }, [checking, page, pageSize, search]);

    useEffect(() => {
  const timer = setTimeout(() => {
    if (searchInput !== search) {
      updateParams({ q: searchInput, page: 1 });
    }
  }, 500);

  return () => clearTimeout(timer);
}, [searchInput]);
    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    if(checking) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-600">Checking login...</p>
            </div>
        )
    }

    const totalPages = Math.ceil(total / pageSize);
    const showingFrom = total === 0 ? 0 : (page-1) * pageSize + 1;
    const showingTo = Math.min(page * pageSize, total);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products..."
                  className="mb-4 w-full max-w-md rounded border border-gray-300 p-2 text-gray-900"
                />
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 hover:bg-red-700"

                >Logout</button>
            </div>
            {!loading && !error && products.length === 0 && (
                    <p className="text-gray-600">No products found.</p>
                )}

            {!loading && !error && products.length > 0 && (       
                <>
          <div className="hidden overflow-x-auto rounded bg-white shadow md:block">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-200 text-gray-800">
                <tr>
                  <th className="p-3">Image</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">
                      <img src={p.thumbnail} alt={p.title} className="h-12 w-12 object-cover" />
                    </td>
                    <td className="p-3">{p.title}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">${p.price}</td>
                    <td className="p-3">{p.rating}</td>
                    <td className="p-3">{p.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-4 md:hidden">
            {products.map((p) => (
              <div key={p.id} className="rounded bg-white p-4 shadow">
                <img src={p.thumbnail} alt={p.title} className="mb-2 h-32 w-full object-cover" />
                <h2 className="font-semibold text-gray-800">{p.title}</h2>
                <p className="text-sm text-gray-600">{p.category}</p>
                <p className="text-sm text-gray-600">
                  ${p.price} • ⭐ {p.rating} • Stock: {p.stock}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {showingFrom}–{showingTo} of {total}
            </p>

            <div className="flex items-center gap-2">
              <select
                value={pageSize}
                onChange={(e) => updateParams({ pageSize: Number(e.target.value) , page: 1})}
                className="rounded border border-gray-300 p-1 text-gray-900"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>

              <button
                onClick={() => updateParams({ page: Math.max(1, page-1) })}
                disabled={page === 1}
                className="rounded bg-blue-600 px-3 py-1 text-white disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => updateParams({ page: Math.min(totalPages, page + 1)})}
                disabled={page === totalPages}
                className="rounded bg-blue-600 px-3 py-1 text-white disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
            )}
    </div>
    )
}