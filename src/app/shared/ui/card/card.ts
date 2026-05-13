import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class CardComponent {}
