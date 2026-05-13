import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RatingDisplayComponent } from '../../../../shared/ui';
import { Visit } from '../../model/visit.model';

@Component({
  selector: 'app-visit-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterLink, RatingDisplayComponent],
  templateUrl: './visit-list-item.html',
})
export class VisitListItemComponent {
  readonly visit = input.required<Visit>();
  readonly restaurantId = input.required<string>();
  readonly canEdit = input<boolean>(false);
}
