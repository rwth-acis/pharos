import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-update-screen',
  templateUrl: './update-screen.component.html',
  styleUrls: ['./update-screen.component.scss']
})
export class UpdateScreenComponent implements OnInit {

  message = '';
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  onSubmit() {
    this.activeModal.close({result: 'success', message: this.message});
  }

  onCancel() {
    this.activeModal.dismiss({result: 'cancel'});
  }

}
