'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';
import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: '',
    role: 'customer' as UserRole,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await register(formData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Daftar ke Purely
          </h1>
          <p className="text-gray-600">
            Buat akun baru untuk mulai berbelanja
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Lengkap"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name?.[0]}
              required
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email?.[0]}
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password?.[0]}
              required
            />

            <Input
              label="Konfirmasi Password"
              type="password"
              value={formData.password_confirmation}
              onChange={(e) =>
                setFormData({ ...formData, password_confirmation: e.target.value })
              }
              required
            />

            <Input
              label="Nomor Telepon"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone?.[0]}
              placeholder="08123456789"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat (Opsional)
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
                className="input-field"
                placeholder="Masukkan alamat lengkap"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daftar Sebagai
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as UserRole })
                }
                className="input-field"
                required
              >
                <option value="customer">Customer (Pembeli)</option>
                <option value="seller">Seller (Penjual)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.role === 'customer'
                  ? 'Saya ingin berbelanja produk grocery'
                  : 'Saya ingin menjual produk grocery'}
              </p>
            </div>

            <Button type="submit" className="w-full" isLoading={loading}>
              Daftar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Sudah punya akun?{' '}
              <Link
                href="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Masuk sekarang
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Dengan mendaftar, Anda menyetujui{' '}
          <Link href="/terms" className="text-primary-600 hover:underline">
            Syarat & Ketentuan
          </Link>{' '}
          dan{' '}
          <Link href="/privacy" className="text-primary-600 hover:underline">
            Kebijakan Privasi
          </Link>{' '}
          kami
        </p>
      </div>
    </div>
  );
}