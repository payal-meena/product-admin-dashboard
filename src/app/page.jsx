"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from '@/lib/axios';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword ] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if(loading) return;

    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.accessToken);
      router.push("/products");
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form 
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md"
      >
        <h1 className="mb-6 text-2xl font-semibold text-gray-800">Login</h1>
        {error && (
          <p className="mb-4 rounded bg-red-100 p-2 text-sm text-red-600">
            {error}</p>
        )}

        <label className="mb-1 block text-sm text-gray-600">Username</label>
        <input type="text" 
          value={username}
          onChange={(e)=> setUsername(e.target.value)} 
          required 
          placeholder="Enter your username" 
          className="mb-4 w-full border border-gray-300 p-2 text-gray-900"
          />

          <label className="mb-1 block text-sm text-gray-600">Password</label>
          <div className="relative mb-4">
          <input type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e)=> setPassword(e.target.value)} 
            required 
            placeholder="Enter your password"
            className="w-full rounded border border-gray-300 p-2 pr-10 text-gray-900"
           />
           <button 
           type="button"
           onClick={()=> setShowPassword(!showPassword)}
           className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
           >
            {showPassword ? "Hide" : "Show"}
           </button>

          </div>

           <button
           type="submit"
           disabled={loading}
            className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disbaled:opacity-50"
           >
            {loading ? "Logging in..." : "Login"}
           </button>
      </form>
    </div>
  )
}