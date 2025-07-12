import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./retention/retention').then((m) => m.Retention),
  },
];
