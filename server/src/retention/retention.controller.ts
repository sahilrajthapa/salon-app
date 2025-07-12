import { Controller, Get } from '@nestjs/common';
import { RetentionService } from './retention.service';
import { RetentionDto } from './retention.dto';

@Controller('retention')
export class RetentionController {
  constructor(private readonly retentionService: RetentionService) {}

  @Get()
  async getReport(): Promise<RetentionDto[]> {
    return this.retentionService.getReport();
  }
}
