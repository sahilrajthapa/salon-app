import { Component } from '@angular/core';
import { debounceTime, Observable, startWith, switchMap } from 'rxjs';
import { RetentionService } from './retention.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-retention',
  imports: [AsyncPipe, DatePipe, ReactiveFormsModule],
  templateUrl: './retention.html',
  styleUrl: './retention.scss',
})
export class Retention {
  form = new FormGroup({
    referenceMonth: new FormControl('2022-01', [Validators.required]),
  });

  report$: Observable<any> = new Observable();

  constructor(private reportService: RetentionService) {}

  ngOnInit() {
    this.report$ = this.form.valueChanges.pipe(
      startWith(this.form.value),
      debounceTime(300),
      switchMap((params) => {
        const referenceMonth = params.referenceMonth ?? '';
        return this.reportService.getReport({ referenceMonth });
      }),
    );
  }
}
