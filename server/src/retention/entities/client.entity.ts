import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Appointment } from './appointment.entity';

enum Gender {
  F = 'F',
  M = 'M',
}

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({
    type: 'text',
    enum: Gender,
  })
  gender: Gender;

  @OneToMany(() => Appointment, (appointment) => appointment.client)
  appointments: Appointment[];
}
