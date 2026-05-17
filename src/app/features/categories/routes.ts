import { Routes } from '@angular/router';
import { CategoryListComponent } from './component/category-list/category-list';
import { CategoryDetailComponent } from './component/category-detail/category-detail';
import { CategoryFormComponent } from './component/category-form/category-form';

export const CATEGORY_ROUTES: Routes = [
  { path: '', component: CategoryListComponent },
  { path: 'new', component: CategoryFormComponent },
  { path: ':categoryId', component: CategoryDetailComponent },
  { path: ':categoryId/edit', component: CategoryFormComponent },
];
