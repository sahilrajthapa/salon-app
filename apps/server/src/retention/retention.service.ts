import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RetentionDto } from './retention.dto';
import { Appointment } from './entities/appointment.entity';
import { Employee } from './entities/employee.entity';
import { IClientCount, IFirstVisit, IRetentionData } from './retention.type';
import { getNextMonth } from './util';

@Injectable()
export class RetentionService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
  ) {}

  /**
   * Fetches the earliest visit for clients in the given reference month.
   *
   * @param referenceMonth - The month to evaluate, in 'YYYY-MM' format.
   * @returns List of clients with associated employees in the first visit.
   */
  private async getClientsFirstVisits(
    referenceMonth: string,
  ): Promise<IFirstVisit[]> {
    const startDate = `${referenceMonth}-01`;
    const endDate = getNextMonth(referenceMonth);

    const subquery = this.appointmentRepo
      .createQueryBuilder('appointment')
      .select(['appointment.client_id', 'MIN(appointment.date) AS firstDate'])
      .where('appointment.date >= :startDate AND appointment.date < :endDate', {
        startDate,
        endDate,
      })
      .groupBy('appointment.client_id');

    return this.appointmentRepo
      .createQueryBuilder('appointment')
      .select([
        'appointment.client_id AS clientId',
        'appointment.employee_id AS employeeId',
      ])
      .innerJoin(
        `(${subquery.getQuery()})`,
        'first_visits',
        'appointment.client_id = first_visits.client_id AND appointment.date = first_visits.firstDate',
      )
      .setParameters(subquery.getParameters())
      .getRawMany();
  }

  /**
   * Fetches all subsequent monthly appointments for clients after their first visit.
   *
   * @param firstVisits - List of clients with associated employees in the first visit.
   * @param referenceMonth - The month to evaluate, in 'YYYY-MM' format.
   * @returns List of client visits in the subsequent months.
   */
  private async getClientRetentionAfterReferenceMonth(
    firstVisits: IFirstVisit[],
    referenceMonth: string,
  ): Promise<IRetentionData[]> {
    const clientIds = firstVisits.map((v) => v.clientId);
    const startDate = getNextMonth(referenceMonth);

    return this.appointmentRepo
      .createQueryBuilder('appointment')
      .select([
        'appointment.client_id AS clientId',
        `strftime('%Y-%m', appointment.date) AS retentionMonth`,
      ])
      .where('appointment.client_id IN (:...clientIds)', { clientIds })
      .andWhere('appointment.date >= :startDate', { startDate })
      .groupBy('appointment.client_id, retentionMonth')
      .getRawMany();
  }

  private buildReport(
    employees: Employee[],
    firstTotalClientsMap: Record<number, number>,
    firstVisitMap: Record<number, number>,
    retentionData: IRetentionData[],
  ): RetentionDto[] {
    return employees.map((employee) => {
      const totalClients = firstTotalClientsMap[employee.employeeId];

      if (!totalClients) {
        return {
          employeeId: employee.employeeId,
          employeeName: `${employee.firstName} ${employee.lastName}`,
          referenceMonth: {
            clients: 0,
            percentage: 0,
          },
          retentionMonths: [],
        };
      }

      const employeeRetentions = retentionData.filter(
        (rd) => firstVisitMap[rd.clientId] === employee.employeeId,
      );

      const retentionCounts: Record<string, number> = {};

      for (const { retentionMonth } of employeeRetentions) {
        retentionCounts[retentionMonth] =
          (retentionCounts[retentionMonth] || 0) + 1;
      }

      const retentionMonths = Object.entries(retentionCounts)
        .map(([month, count]) => ({
          month,
          clients: count,
          percentage: Math.round((count / totalClients) * 1000) / 10,
        }))
        .sort(
          (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime(),
        );

      return {
        employeeId: employee.employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        referenceMonth: {
          clients: totalClients,
          percentage: 100,
        },
        retentionMonths,
      };
    });
  }

  async getReport(referenceMonth: string): Promise<RetentionDto[]> {
    const [firstVisits, employees] = await Promise.all([
      this.getClientsFirstVisits(referenceMonth),
      this.employeeRepo.find(),
    ]);

    if (!firstVisits.length || !employees.length) return [];

    const retentionData = await this.getClientRetentionAfterReferenceMonth(
      firstVisits,
      referenceMonth,
    );

    // maps a client to their first employee
    const firstVisitMap: Record<number, number> = {};

    //  maps an employee to the total number of first-time clients
    const firstTotalClientsMap: Record<number, number> = {};

    for (const { clientId, employeeId } of firstVisits) {
      firstVisitMap[clientId] = employeeId;
      firstTotalClientsMap[employeeId] =
        (firstTotalClientsMap[employeeId] || 0) + 1;
    }

    return this.buildReport(
      employees,
      firstTotalClientsMap,
      firstVisitMap,
      retentionData,
    );
  }

  async getAppointments(): Promise<Appointment[]> {
    return this.appointmentRepo.find({
      relations: ['client', 'employee'],
      take: 5,
    });
  }
}
