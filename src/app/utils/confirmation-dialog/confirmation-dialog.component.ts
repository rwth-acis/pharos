import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {
  @Input() message;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  onSubmit() {
    this.activeModal.close({result: 'accept'});
  }

  onCancel() {
    this.activeModal.close({result: 'cancel'});
  }
}
