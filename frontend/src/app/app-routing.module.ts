import { provideRouter, Route } from '@angular/router';

const routes: Route[] = [
  { path: '', redirectTo: '/', pathMatch: 'full' }
];

export const AppRouting = provideRouter(routes);
