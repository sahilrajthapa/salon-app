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
