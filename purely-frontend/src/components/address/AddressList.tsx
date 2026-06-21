'use client';

import { Address } from '@/types/address';
import { AddressCard } from './AddressCard';
import { Button } from '@/components/ui/Button';

interface AddressListProps {
  addresses: Address[];
  selectedId?: number;
  onSelect?: (address: Address) => void;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onAddNew: () => void;
  loading?: boolean;
}

export function AddressList({
  addresses,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  onAddNew,
  loading,
}: AddressListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-gray-500 mb-4">Belum ada alamat tersimpan</p>
        <Button onClick={onAddNew}>+ Tambah Alamat Baru</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            isSelected={selectedId === address.id}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
            showActions={true}
          />
        ))}
      </div>
      <Button variant="outline" className="w-full" onClick={onAddNew}>
        + Tambah Alamat Baru
      </Button>
    </div>
  );
}
