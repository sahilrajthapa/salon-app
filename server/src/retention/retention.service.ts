import { Injectable } from '@nestjs/common';
import { RetentionDto } from './retention.dto';

const MOCK_RETENTION_DATA: RetentionDto[] = [
  {
    employeeId: 1,
    employeeName: 'Employee 1',
    referenceMonth: {
      clients: 100,
      percentage: 100,
    },
    retentionMonths: [
      {
        month: '2022-01',
        clients: 63,
        percentage: 63,
      },
      {
        month: '2022-02',
        clients: 40,
        percentage: 40,
      },
    ],
  },
  {
    employeeId: 2,
    employeeName: 'Employee 2',
    referenceMonth: {
      clients: 200,
      percentage: 200,
    },
    retentionMonths: [
      {
        month: '2022-01',
        clients: 126,
        percentage: 63,
      },
      {
        month: '2022-02',
        clients: 80,
        percentage: 40,
      },
    ],
  },
];

@Injectable()
export class RetentionService {
  async getReport(referenceMonth: string = '2022-01'): Promise<RetentionDto[]> {
    console.log('referenceMonth', referenceMonth);
    return MOCK_RETENTION_DATA;
  }
}
