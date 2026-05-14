import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingParameter } from '../../model/category.model';

@Component({
  selector: 'app-parameter-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './parameter-editor.html',
})
export class ParameterEditorComponent {
  @Input() parameters: RatingParameter[] = [];
  @Output() parametersChange = new EventEmitter<RatingParameter[]>();

  protected scaleOptions = [5, 10];

  addParameter() {
    const newParam: RatingParameter = { id: crypto.randomUUID(), label: '', scale: 5 };
    this.parametersChange.emit([...this.parameters, newParam]);
  }

  updateLabel(index: number, label: string) {
    const updated = this.parameters.map((p, i) => (i === index ? { ...p, label } : p));
    this.parametersChange.emit(updated);
  }

  updateScale(index: number, scale: number) {
    const updated = this.parameters.map((p, i) => (i === index ? { ...p, scale } : p));
    this.parametersChange.emit(updated);
  }

  removeParameter(index: number) {
    this.parametersChange.emit(this.parameters.filter((_, i) => i !== index));
  }
}
