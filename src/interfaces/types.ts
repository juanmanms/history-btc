export interface Transaction {
  id: string;
  euros: number;
  btc_amount: number;
  purchase_price: number;
  wallet: string;
  date: string;
  crypto_id: number; // Nuevo campo para el tipo de activo
}

export interface Crypto {
  id: number;
  name: string;
  symbol: string;
}

export interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  step?: string;
  min?: string;
  icon: React.ReactNode;
}

export interface SelectFieldProps {
  label: string;
  value: number | null;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { id: number; name: string; symbol: string }[];
}
