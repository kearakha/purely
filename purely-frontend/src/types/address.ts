export interface Address {
  id: number;
  user_id: number;
  recipient_name: string;
  phone_number: string;
  full_address: string;
  notes?: string;
  label: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}
