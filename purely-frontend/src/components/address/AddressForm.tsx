'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Address } from '@/types/address';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface AddressFormProps {
  initialData?: Address;
  onSubmit: (data: Partial<Address>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: AddressFormProps) {
  const [formData, setFormData] = useState({
    recipient_name: initialData?.recipient_name || '',
    phone_number: initialData?.phone_number || '',
    full_address: initialData?.full_address || '',
    notes: initialData?.notes || '',
    label: initialData?.label || 'Rumah',
    is_primary: initialData?.is_primary || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nama Penerima"
        value={formData.recipient_name}
        onChange={(e) =>
          setFormData({ ...formData, recipient_name: e.target.value })
        }
        required
      />
      <Input
        label="Nomor Telepon"
        type="tel"
        value={formData.phone_number}
        onChange={(e) =>
          setFormData({ ...formData, phone_number: e.target.value })
        }
        required
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Label Alamat
        </label>
        <div className="flex gap-2">
          {['Rumah', 'Kantor', 'Kost', 'Lainnya'].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setFormData({ ...formData, label })}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                formData.label === label
                  ? 'bg-primary-50 border-primary-600 text-primary-700 font-medium'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alamat Lengkap
        </label>
        <textarea
          value={formData.full_address}
          onChange={(e) =>
            setFormData({ ...formData, full_address: e.target.value })
          }
          rows={3}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 border"
          placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Catatan (Opsional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) =>
            setFormData({ ...formData, notes: e.target.value })
          }
          rows={2}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 border"
          placeholder="Patokan, warna pagar, dll"
        />
      </div>

      <div className="flex items-center">
        <input
          id="is_primary"
          type="checkbox"
          checked={formData.is_primary}
          onChange={(e) =>
            setFormData({ ...formData, is_primary: e.target.checked })
          }
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="is_primary" className="ml-2 block text-sm text-gray-900">
          Jadikan alamat utama
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={onCancel}
          disabled={loading}
        >
          Batal
        </Button>
        <Button
          type="submit"
          className="flex-1"
          isLoading={loading}
          disabled={loading}
        >
          Simpan Alamat
        </Button>
      </div>
    </form>
  );
}
