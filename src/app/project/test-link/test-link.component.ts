import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-test-link',
  templateUrl: './test-link.component.html',
  styleUrls: ['./test-link.component.scss']
})
export class TestLinkComponent implements OnInit {
  @Input() testLink;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  onClose() {
    this.activeModal.close();
  }
}
