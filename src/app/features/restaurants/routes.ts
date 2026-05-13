import { Routes } from '@angular/router';
import { RestaurantListComponent } from './component/restaurant-list';
import { RestaurantFormComponent } from './component/restaurant-form';
import { RestaurantDetailComponent } from './component/restaurant-detail';

export const RESTAURANT_ROUTES: Routes = [
  { path: '', component: RestaurantListComponent },
  { path: 'new', component: RestaurantFormComponent },
  { path: ':id', component: RestaurantDetailComponent },
  { path: ':id/edit', component: RestaurantFormComponent },
];
