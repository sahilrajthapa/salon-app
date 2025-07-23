import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RetentionService } from './retention.service';
import { Appointment } from './entities/appointment.entity';
import { Employee } from './entities/employee.entity';

describe('RetentionService', () => {
  let retentionService: RetentionService;
  let employeeRepo: Repository<Employee>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RetentionService,
        {
          provide: getRepositoryToken(Appointment),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Employee),
          useClass: Repository,
        },
      ],
    }).compile();

    retentionService = module.get<RetentionService>(RetentionService);

    employeeRepo = module.get<Repository<Employee>>(
      getRepositoryToken(Employee),
    );
  });

  describe('getReport', () => {
    it('should correctly calculate retention report', async () => {
      const firstVisits = [
        { clientId: 1, employeeId: 1 },
        { clientId: 2, employeeId: 1 },
        { clientId: 3, employeeId: 2 },
      ];

      const employees = [
        {
          employeeId: 1,
          firstName: 'Jillen',
          lastName: 'Kuhl',
          appointments: [],
        },
        {
          employeeId: 2,
          firstName: 'Marion',
          lastName: 'Lemme',
          appointments: [],
        },
      ];

      const retentionData = [
        { clientId: 1, retentionMonth: '2023-02' },
        { clientId: 1, retentionMonth: '2023-03' },
        { clientId: 2, retentionMonth: '2023-02' },
      ];

      jest
        .spyOn(retentionService, 'getClientsFirstVisits')
        .mockResolvedValue(firstVisits);

      jest.spyOn(employeeRepo, 'find').mockResolvedValue(employees);

      jest
        .spyOn(retentionService, 'getClientRetentionAfterReferenceMonth')
        .mockResolvedValue(retentionData);

      const result = await retentionService.getReport('2023-01');

      expect(result).toEqual([
        {
          employeeId: 1,
          employeeName: 'Jillen Kuhl',
          referenceMonth: {
            clients: 2,
            percentage: 100,
          },
          retentionMonths: [
            {
              month: '2023-02',
              clients: 2,
              percentage: 100,
            },
            {
              month: '2023-03',
              clients: 1,
              percentage: 50,
            },
          ],
        },
        {
          employeeId: 2,
          employeeName: 'Marion Lemme',
          referenceMonth: {
            clients: 1,
            percentage: 100,
          },
          retentionMonths: [],
        },
      ]);
    });
  });
});
