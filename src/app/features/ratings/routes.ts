import { Routes } from '@angular/router';
import { RatingFormComponent } from './component/rating-form/rating-form';

export const RATING_ROUTES: Routes = [
  { path: 'new', component: RatingFormComponent },
  { path: ':ratingId/edit', component: RatingFormComponent },
];
