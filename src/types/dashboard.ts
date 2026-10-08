export interface MonthlyLr {
  month: string;
  monthNo: number;
  totalLrs: number;
}

export interface MonthlyMemo {
  month: string;
  monthNo: number;
  totalMemos: number;
}

export interface NewParty {
  month: string;
  monthNo: number;
  newParties: number;
}

export interface TopCity {
  city: string;
  total: number;
}

export interface DashboardData {
  monthlyLrs: MonthlyLr[];
  monthlyMemos: MonthlyMemo[];
  newParties: NewParty[];
  topCities: TopCity[];
}