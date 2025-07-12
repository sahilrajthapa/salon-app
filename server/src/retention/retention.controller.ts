import { Controller, Get, Query } from '@nestjs/common';
import { RetentionService } from './retention.service';
import { RetentionDto } from './retention.dto';

@Controller('retention')
export class RetentionController {
  constructor(private readonly retentionService: RetentionService) {}

  @Get()
  async getReport(
    @Query('referenceMonth') referenceMonth: string,
  ): Promise<RetentionDto[]> {
    return this.retentionService.getReport(referenceMonth);
  }

  @Get('appointments-check')
  getAppointments() {
    return this.retentionService.getAppointments();
  }
}
