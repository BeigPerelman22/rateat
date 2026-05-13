import { Routes } from '@angular/router';
import { VisitFormComponent } from './component/visit-form/visit-form';

export const VISIT_ROUTES: Routes = [
  { path: 'new', component: VisitFormComponent },
  { path: ':visitId/edit', component: VisitFormComponent },
];
