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
    const isValid = /^\d{4}-(0[1-9]|1[0-2])$/.test(referenceMonth);
    const defaultMonth = isValid ? referenceMonth : '2022-01';

    return this.retentionService.getReport(defaultMonth);
  }

  @Get('appointments-check')
  getAppointments() {
    return this.retentionService.getAppointments();
  }
}
