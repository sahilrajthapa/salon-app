import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ReferenceMonthValidationPipe implements PipeTransform {
  transform(value: string) {
    const yearMonthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

    if (!yearMonthRegex.test(value)) {
      throw new BadRequestException(
        'Reference month must be in YYYY-MM format',
      );
    }

    return value;
  }
}
