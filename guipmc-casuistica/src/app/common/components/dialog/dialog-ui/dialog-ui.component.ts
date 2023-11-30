import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-dialog-ui',
  templateUrl: './dialog-ui.component.html',
  styleUrls: ['./dialog-ui.component.scss']
})

export class DialogUiComponent  {
  @Input() message: string;

  constructor(public activeModal: NgbActiveModal) {}

}
