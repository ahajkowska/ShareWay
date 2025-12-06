export interface ExpenseDto {
  id: string;
  tripId: string;
  title: string;
  description?: string;
  amount: number;
  paidBy: string;
  paidByName: string;
  splitBetween: string[]; // Array nazwisk osób
  date: string | Date;
  createdAt: string | Date;
}

export interface CreateExpenseDto {
  amount: number;
  description?: string;
  debtorIds: string[]; // subset of active participants
  splitMethod?: "equal" | "custom";
  metadata?: Record<string, any>;
}

export interface SettlementEdge {
  fromUserId: string; // pays
  toUserId: string;   // receives
  amount: number;     // amount in baseCurrency
}

export interface BalanceGraphDto {
  settlements: Settlement[];
  totalExpenses?: number;
}

export interface Settlement {
  from: string; // Nazwa użytkownika
  to: string;   // Nazwa użytkownika
  amount: number;
}

export interface CreateExpensePayload {
  title: string;
  description?: string;
  amount: number;
  paidBy: string; // User ID
  splitBetween: string[]; // Array User IDs
  date?: string;
}