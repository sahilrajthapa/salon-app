import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RetentionService } from './retention.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-retention',
  imports: [AsyncPipe],
  templateUrl: './retention.html',
  styleUrl: './retention.scss',
})
export class Retention {
  report$: Observable<any> = new Observable();

  constructor(private reportService: RetentionService) {}

  ngOnInit() {
    this.report$ = this.reportService.getReport();
  }
}
