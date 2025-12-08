import type { SortMode } from "@/app/dashboard/components/SortControl";

export type FilterStatus = "ALL" | "ACTIVE" | "ARCHIVED";
export type FilterRole = "ALL" | "ORGANIZER" | "PARTICIPANT";

export type FilterState = {
  search: string;
  status: "ALL" | "ACTIVE" | "ARCHIVED";
  role: "ALL" | "ORGANIZER" | "PARTICIPANT";
  dateFrom: string;
  dateTo: string;
  location: string;
  minParticipants: string;
  maxParticipants: string;
};

export interface DashboardFiltersSidebarProps {
  t: any;

  filters: FilterState;
  advancedFilters: any;
  hasAdvancedFilters: boolean;

  onSearchChange: (value: string) => void;
  searchOptions?: string[];
  onQuickFilterChange: (key: "status" | "role", value: string) => void;
  onAdvancedFilterChange: (key: string, value: string) => void;
  onReset: () => void;

  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;

  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;

  sortMode: SortMode;
  onSortChange: (mode: SortMode) => void;
}

export type TripAccentPreset =
  | "mountains"
  | "beach"
  | "city"
  | "neutral"
  | "desert"
  | "tropical"
  | "winter"
  | "lake"
  | "countryside"
  | "adventure";

export type TripMember = {
  id: string;
  name: string;
  avatarUrl?: string | null;
};

export type TripRole = "ORGANIZER" | "PARTICIPANT";
export type TripStatus = "ACTIVE" | "ARCHIVED";

export type Trip = {
  id: string;
  groupId?: string;
  name: string;
  description?: string;
  destination: string;
  startDate: string;
  endDate: string;
  inviteCode?: string;
  accentPreset?: TripAccentPreset;
  members: TripMember[];
  roleForCurrentUser: TripRole;
  status: TripStatus;
};
