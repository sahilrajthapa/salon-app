import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RetentionModule } from './retention/retention.module';
import { Appointment } from './retention/entities/appointment.entity';
import { Client } from './retention/entities/client.entity';
import { Employee } from './retention/entities/employee.entity';

@Module({
  imports: [
    RetentionModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'salon.sqlite',
      entities: [Appointment, Client, Employee],
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
