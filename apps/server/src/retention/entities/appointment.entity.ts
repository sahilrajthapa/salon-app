import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { Employee } from './employee.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn({ name: 'appointment_id' })
  appointmentId: number;

  @Column({ name: 'date' })
  date: string;

  @ManyToOne(() => Client, (client) => client.appointments)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Employee, (employee) => employee.appointments)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
