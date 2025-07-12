import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RetentionModule } from './retention/retention.module';

@Module({
  imports: [RetentionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
