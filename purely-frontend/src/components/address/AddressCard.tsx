'use client';

import { Address } from '@/types/address';
import { Button } from '@/components/ui/Button';

interface AddressCardProps {
  address: Address;
  isSelected?: boolean;
  onSelect?: (address: Address) => void;
  onEdit?: (address: Address) => void;
  onDelete?: (address: Address) => void;
  showActions?: boolean;
}

export function AddressCard({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  showActions = true,
}: AddressCardProps) {
  return (
    <div
      className={`p-4 border rounded-lg transition-colors ${
        isSelected
          ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600'
          : 'border-gray-200 hover:border-gray-300'
      } ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={() => onSelect?.(address)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mb-1">
            {address.label}
          </span>
          {address.is_primary && (
            <span className="ml-2 inline-block px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 mb-1">
              Utama
            </span>
          )}
          <h4 className="font-semibold text-gray-900">{address.recipient_name}</h4>
          <p className="text-sm text-gray-600">{address.phone_number}</p>
        </div>
      </div>
      
      <p className="text-sm text-gray-700 whitespace-pre-wrap">{address.full_address}</p>
      {address.notes && (
        <p className="text-xs text-gray-500 mt-1 italic">Catatan: {address.notes}</p>
      )}

      {showActions && (onEdit || onDelete) && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(address);
              }}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Ubah
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(address);
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Hapus
            </button>
          )}
        </div>
      )}
    </div>
  );
}
