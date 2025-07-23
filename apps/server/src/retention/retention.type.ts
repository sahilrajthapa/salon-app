export interface IFirstVisit {
  clientId: number;
  employeeId: number;
}

export interface IClientCount {
  employeeId: number;
  totalClients: number;
}

export interface IRetentionData {
  clientId: number;
  retentionMonth: string;
}

export interface IFirstVisitMap {
  [clientId: number]: number; // employeeId
}
export interface IFirstTotalClientsMap {
  [employeeId: number]: number; // totalClients
}

export interface IMonthRetentionMap {
  [month: string]: number; // count of clients retained in that month
}
