import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RetentionModule } from './retention/retention.module';

import { datasourceOptions } from './datasource.config';
@Module({
  imports: [RetentionModule, TypeOrmModule.forRoot(datasourceOptions)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
