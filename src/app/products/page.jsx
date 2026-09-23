"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token) {
            router.push("/");
        } else {
            setChecking(false);
        }
    }, [router]);

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

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 hover:bg-red-700"

                >Logout</button>
            </div>
            <p className="text-gray-600">Product list will go here.</p>
        </div>
    )
}