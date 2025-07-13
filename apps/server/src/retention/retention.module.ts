import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RetentionController } from './retention.controller';
import { RetentionService } from './retention.service';
import { Appointment } from './entities/appointment.entity';
import { Employee } from './entities/employee.entity';
import { Client } from './entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Client, Employee])],
  controllers: [RetentionController],
  providers: [RetentionService],
})
export class RetentionModule {}
