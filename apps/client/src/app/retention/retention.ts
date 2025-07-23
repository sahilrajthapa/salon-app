import { Component } from '@angular/core';
import {
  catchError,
  debounceTime,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { RetentionService } from './retention.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IRetention } from './retention.interface';

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

  report$: Observable<IRetention[]> = new Observable();
  isLoading = false;
  error: string = '';

  constructor(private reportService: RetentionService) {}

  ngOnInit() {
    this.report$ = this.form.valueChanges.pipe(
      startWith(this.form.value),
      debounceTime(300),
      tap(() => {
        this.isLoading = true;
        this.error = '';
      }),
      switchMap((params) => {
        const referenceMonth = params.referenceMonth ?? '';
        return this.reportService.getReport({ referenceMonth }).pipe(
          catchError((err) => {
            this.error = err.error.message;
            return of([]);
          }),
        );
      }),
      tap(() => {
        this.isLoading = false;
      }),
    );
  }
}
