"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { AxiosError } from "axios";
import { ApiError } from "@/types/api";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await login(formData);
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Masuk ke Purely
          </h1>
          <p className="text-gray-600">
            Belanja kebutuhan sehari-hari jadi lebih mudah
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email?.[0]}
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors.password?.[0]}
              required
            />

            <Button type="submit" className="w-full" isLoading={loading}>
              Masuk
            </Button>
          </form>

          <div className="mt-4 rounded-lg bg-gray-50 border border-gray-200 p-4 text-xs text-gray-500 space-y-1">
            <p className="font-semibold text-gray-700">Akun Demo</p>
            <p>
              Customer: <span className="font-mono">demo@purely.app</span>
            </p>
            <p>
              Seller: <span className="font-mono">seller@purely.app</span>
            </p>
            <p>
              Admin: <span className="font-mono">admin@purely.app</span>
            </p>
            <p>
              Password: <span className="font-mono">demo1234</span>
            </p>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
