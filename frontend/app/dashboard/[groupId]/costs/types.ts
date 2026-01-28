export interface ExpenseDto {
  id: string;
  tripId: string;
  title: string;
  description?: string;
  amount: number;
  currency?: string;
  status?: "PENDING" | "SETTLED";
  paidBy: string;
  paidByName: string;
  splitBetween: string[]; // Array nazwisk osób
  date: string | Date;
  createdAt: string | Date;
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

export interface CreateExpenseDto {
  title: string;
  description?: string;
  amount: number;
  paidBy?: string; // User ID
  debtorIds: string[]; // Array User IDs
  date: string;
  currency?: string;
  status?: "PENDING" | "SETTLED";
}

export interface ExpenseBreakdown {
    expenseId: string;
    expenseTitle: string;
    totalAmount: number;
    myShare: number;
    iPaid: number;
    balance: number;
}

export interface PersonalBalanceDto {
    userId: string;
    userName: string;
    balance: number;
    expenses: ExpenseBreakdown[];
}

export interface MyBalanceSummaryDto {
    myUserId: string;
    myUserName: string;
    balances: PersonalBalanceDto[];
    totalIOweThem: number;
    totalTheyOweMe: number;
}
