import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TestsDataService} from '../../dataservices/tests-data.service';
import {TestService} from '../../services/test.service';
import {ToastsManager} from 'ng2-toastr';
import {Subscription} from 'rxjs/Subscription';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-test-question',
  templateUrl: './test-question.component.html',
  styleUrls: ['./test-question.component.scss']
})
export class TestQuestionComponent implements OnInit, OnDestroy {

  testId;
  test;
  view = 'start'; // start, introduction, survey, image, end
  answers = [];
  imageSrc;

  testSub: Subscription;

  constructor(private testsDataService: TestsDataService,
              private testService: TestService,
              private route: ActivatedRoute,
              private toastr: ToastsManager,
              private vcr: ViewContainerRef,
              private sanitizer: DomSanitizer) {
    this.toastr.setRootViewContainerRef(vcr);
    this.testId = this.route.snapshot.params.key;
  }

  ngOnInit() {
    this.testSub = this.testsDataService.getQuestionTest(this.testId).subscribe(
      (test) => {
        this.test = test;
        for (let i = 0; i < test.questions.length; i++) {
          this.answers.push('');
        }
        this.testService.getImageContent(this.test.repoName, this.test.repoOwner, this.test.screenName, this.test.testName, this.test.imageName).then(
          (image) => {
            this.imageSrc = this.sanitizer.bypassSecurityTrustUrl('data:image/' + this.test.imageExtension + ';base64,' + image['content']);
          }
        );
      }
    );
  }

  ngOnDestroy() {
    this.testSub.unsubscribe();
  }

  onSubmit() {
    if (!this.test.answers) {
      this.initializeAnswers();
    }
    for (let i = 0; i < this.test.questions.length; i++) {
      this.test.answers[i].push(this.answers[i]);
    }
    if (this.test.participantsCount) {
      this.test.participantsCount++;
    } else {
      this.test.participantsCount = 1;
    }
    this.testsDataService.updateQuestionTest(this.testId, this.test).then(
      (result) => {
        this.toastr.success('Test results saved!');
        this.view = 'end';
      }
    );
  }

  initializeAnswers() {
    this.test.answers = [];
    if (this.test.answers.length === 0) {
      for (let i = 0; i < this.test.questions.length; i++) {
        this.test.answers.push([]);
      }
    }
  }

}
