interface RetentionMetrics {
  clients: number;
  percentage: number;
}

interface RetentionMonth extends RetentionMetrics {
  month: string;
}

export interface IRetention {
  employeeId: number;
  employeeName: string;
  referenceMonth: RetentionMetrics;
  retentionMonths: RetentionMonth[];
}
