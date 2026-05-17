import { Routes } from '@angular/router';
import { ItemDetailComponent } from './component/item-detail/item-detail';
import { ItemFormComponent } from './component/item-form/item-form';

export const ITEM_ROUTES: Routes = [
  { path: 'new', component: ItemFormComponent },
  { path: ':itemId', component: ItemDetailComponent },
  { path: ':itemId/edit', component: ItemFormComponent },
];
