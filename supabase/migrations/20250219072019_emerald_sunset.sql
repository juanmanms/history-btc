/*
  # Create transactions table for BTC calculator

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `euros` (numeric)
      - `btc_amount` (numeric)
      - `purchase_price` (numeric)
      - `wallet` (text)
      - `date` (date)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `transactions` table
    - Add policies for authenticated users to:
      - Read their own transactions
      - Insert their own transactions
      - Delete their own transactions
*/

CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  euros numeric NOT NULL,
  btc_amount numeric NOT NULL,
  purchase_price numeric NOT NULL,
  wallet text NOT NULL DEFAULT 'Exchange',
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);