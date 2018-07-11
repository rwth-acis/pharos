import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ScreenDataService} from '../../dataservices/screen-data.service';
import {AnnotationsDataService} from '../../dataservices/annotations-data.service';
import {AnnotationModel} from '../../datamodels/annotation.model';
import {ScreenModel} from '../../datamodels/screen.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit, OnChanges {
  @Input() type; // annotation, screen, or test.
  @Input() annotation: AnnotationModel;
  @Input() screen: ScreenModel;
  @Input() testId;

  userVoted = false;

  constructor(private screenDataService: ScreenDataService,
              private annotationsDataService: AnnotationsDataService) {
  }

  ngOnInit() {
    this.checkUserVoted();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkUserVoted();
  }

  upVote() {
    switch (this.type) {
      case 'annotation':
        this.annotation.upvotes++;
        this.annotationsDataService.updateAnnotation(this.annotation.$key, this.annotation);
        // TODO: Add user to voters
        break;
      case 'screen':
        this.screen.upvotes++;
        this.screenDataService.updateScreen(this.screen.$key, this.screen);
        // TODO: Add user to voters
        break;
      case 'test':
        break;
    }
    this.userVoted = true;
  }

  downVote() {
    switch (this.type) {
      case 'annotation':
        this.annotation.downvotes++;
        this.annotationsDataService.updateAnnotation(this.annotation.$key, this.annotation);
        // TODO: Add user to voters
        break;
      case 'screen':
        this.screen.downvotes++;
        this.screenDataService.updateScreen(this.screen.$key, this.screen);
        // TODO: Add user to voters
        break;
      case 'test':
        break;
    }
    this.userVoted = true;
  }

  checkUserVoted() {
    /*for (let i = 0; i < this.voters.length; i++) {
      if ( this.voters[i] === username) {
        this.userVoted = true;
      }
    }*/
    this.userVoted =  false;
  }

}
