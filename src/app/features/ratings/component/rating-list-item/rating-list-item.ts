import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RatingDisplayComponent } from '../../../../shared/ui';
import { Rating } from '../../model/rating.model';
import { RatingParameter } from '../../../categories/model/category.model';

@Component({
  selector: 'app-rating-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterLink, RatingDisplayComponent],
  templateUrl: './rating-list-item.html',
  styleUrl: './rating-list-item.scss',
})
export class RatingListItemComponent {
  readonly rating = input.required<Rating>();
  readonly parameters = input.required<RatingParameter[]>();
  readonly allowMultipleRatings = input<boolean>(false);
  readonly canEdit = input<boolean>(false);
  readonly itemId = input.required<string>();
  readonly categoryId = input.required<string>();
}
