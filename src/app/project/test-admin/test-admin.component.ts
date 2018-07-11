import {
  Component, ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {TestsDataService} from '../../dataservices/tests-data.service';
import {Subscription} from 'rxjs/Subscription';
import {ToastsManager} from 'ng2-toastr';
import {ProjectService} from '../../services/project.service';
import {DomSanitizer} from '@angular/platform-browser';
import * as html2canvas from 'html2canvas';
import {TestService} from '../../services/test.service';
import {GithubDataService} from '../../dataservices/github-data.service';
import {PreferenceTestModel} from '../../datamodels/preference-test.model';
import {QuestionTestModel} from '../../datamodels/question-test.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TestLinkComponent} from '../test-link/test-link.component';
import {NewScreenComponent} from '../new-screen/new-screen.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-test-admin',
  templateUrl: './test-admin.component.html',
  styleUrls: ['./test-admin.component.scss']
})
export class TestAdminComponent implements OnInit, OnDestroy {
  @Input() screen;
  @Input() versions;

  @ViewChild('imageOne') imageOne: ElementRef;
  @ViewChild('imageTwo') imageTwo: ElementRef;
  @ViewChild('imageSingle') imageSingle: ElementRef;

  view = 'selectType'; // selectType, setupPreferenceTest, setupQuestionTest, resultsPT, resultsQT
  selectedVersionsPT = [];
  selectedVersionQT;
  questions = [];
  question = '';
  preferenceTestList = [];
  questionTestList = [];
  introduction = '';
  htmlData;
  htmlData2;
  imageContent = '';  // If question test
  imageContent2 = ''; // If preference test
  githubSignedIn: boolean;
  testPT: PreferenceTestModel;
  testQT: QuestionTestModel;
  errorMessages = [];

  githubAuthSub: Subscription;

  constructor(private testsDataService: TestsDataService,
              private toastr: ToastsManager,
              private vcr: ViewContainerRef,
              private projectService: ProjectService,
              private sanitizer: DomSanitizer,
              private testService: TestService,
              private githubDataService: GithubDataService,
              private modal: NgbModal) {
    this.toastr.setRootViewContainerRef(vcr);
    this.githubSignedIn = this.githubDataService.signedIn;
    this.githubAuthSub = this.githubDataService.$githubAuth.subscribe(
      (result) => { this.githubSignedIn = result; }
    );
  }

  ngOnInit() {
    this.selectedStylePT();
    this.selectedStyleQT();
    this.preferenceTestList = this.testsDataService.getPreferenceTestsByScreenName(this.screen.name);
    this.questionTestList = this.testsDataService.getQuestionTestsByScreenName(this.screen.name);
  }

  ngOnDestroy() {
    this.githubAuthSub.unsubscribe();
  }

  goToPreferenceTest() {
    if (this.versions.length >= 2) {
      this.view = 'setupPreferenceTest';
    } else {
      this.toastr.error('You need at least two versions of this screen to launch the test.', 'We cannot start your test!');
    }
  }

  selectVersionPT(version) {
    this.errorMessages = [];
    if (!this.selectedVersionsPT.includes(version)) {
      if (this.selectedVersionsPT.length < 2 ) {
        this.selectedVersionsPT.push(version);
      } else {
        this.selectedVersionsPT.shift();
        this.selectedVersionsPT.push(version);
      }
    }
    this.selectedStylePT();
  }

  selectedStylePT() {
    for (let i = 0; i < this.versions.length; i++) {
      this.versions[i].cssClass = 'table-light';
      for (let j = 0; j < this.selectedVersionsPT.length; j++) {
        if (this.versions[i] === this.selectedVersionsPT[j]) {
          this.versions[i].cssClass = 'table-primary';
        }
      }
    }
  }

  selectVersionQT(version) {
    this.errorMessages = [];
    this.selectedVersionQT = version;
    this.selectedStyleQT();
  }

  selectedStyleQT() {
    for (let i = 0; i < this.versions.length; i++) {
      this.versions[i].cssClass = 'table-light';
      if (this.versions[i] === this.selectedVersionQT) {
        this.versions[i].cssClass = 'table-primary';
      }
    }
  }

  addQuestion() {
    this.errorMessages = [];
    this.questions.push(this.question);
    this.question = '';
  }

  deleteQuestion(q) {
    const index = this.questions.indexOf(q);
    if (index > -1) {
      this.questions.splice(index, 1);
    }
  }

  generatePreferenceTest() {
    this.errorMessages = [];
    if (this.selectedVersionsPT.length < 2) {
      this.errorMessages.push('Please select two versions to compare');
    }
    if (this.introduction === '') {
      this.errorMessages.push('Add a short introduction of your design');
    }
    if (this.errorMessages.length === 0) {
      this.getImageFromVersion(this.selectedVersionsPT[0], '1');
      this.getImageFromVersion(this.selectedVersionsPT[1], '2');
    }
  }

  generateQuestionTest() {
    this.errorMessages = [];
    if (!this.selectedVersionQT) {
      this.errorMessages.push('Please select two versions to compare');
    }
    if (this.introduction === '') {
      this.errorMessages.push('Add a short introduction of your design');
    }
    if (this.questions.length === 0) {
      this.errorMessages.push('Add at least a question about your design');
    }
    if (this.errorMessages.length === 0) {
      this.getImageFromVersion(this.selectedVersionQT, '1');
    }
  }

  getImageFromVersion (version, imgNumber) {
    let imageData = '';
    if (this.screen.type === 'image') {
      this.projectService.getVersionImage(this.screen, version).then(
        (result) => {
          imageData = result['image'];
        }
      );
    } else {
      if  (imgNumber === '1') {
        this.projectService.getVersionGrapesJs(this.screen, version).then(
          (result) => {
            this.htmlData = this.sanitizer.bypassSecurityTrustHtml('<head><style>' + result.css + '</style></head>' + result.html);
          }
        );
      } else {
        this.projectService.getVersionGrapesJs(this.screen, version).then(
          (result) => {
            this.htmlData2 = this.sanitizer.bypassSecurityTrustHtml('<head><style>' + result.css + '</style></head>' + result.html);
          }
        );
      }
    }
    return imageData;
  }

  getImageData() {
    if (this.htmlData) {
      if ( this.view === 'setupQuestionTest') {
        const self = this;
        const previewIframe = <HTMLIFrameElement> document.getElementById('previewIframe');
        html2canvas(previewIframe.contentDocument.documentElement).then(function(canvas) {
          self.imageContent = canvas.toDataURL().replace(/data:.*?;base64,/g, '');
          self.testService.createQuestionTest(self.screen, self.imageContent, self.introduction, self.questions).then(
            (id) => { self.saveLinkQT(id); }
          );
        });
      } else {
        const self = this;
        const previewIframe = <HTMLIFrameElement> document.getElementById('previewIframe');
        html2canvas(previewIframe.contentDocument.documentElement).then(function(canvas) {
          self.imageContent = canvas.toDataURL().replace(/data:.*?;base64,/g, '');
          if (self.imageContent2 !== '') {
            self.testService.createPrefrenceTest(self.screen, self.imageContent, self.imageContent2, self.introduction).then(
              (id) => { self.saveLinkPT(id); }
            );
          }
        });
      }
    }
  }

  getSecondImageData() {
    if (this.htmlData2) {
      const self = this;
      const previewIframe = <HTMLIFrameElement> document.getElementById('previewIframe2');
      html2canvas(previewIframe.contentDocument.documentElement).then(function(canvas) {
        self.imageContent2 = canvas.toDataURL().replace(/data:.*?;base64,/g, '');
        if (self.imageContent !== '') {
          self.testService.createPrefrenceTest(self.screen, self.imageContent, self.imageContent2, self.introduction).then(
            (id) => { self.saveLinkPT(id); }
          );
        }
      });
    }
  }

  createTestSuccess() {
    this.toastr.success('The test has been created');
    this.htmlData = null;
    this.htmlData2 = null;
    this.imageContent = '';
    this.imageContent2 = '';
    this.introduction = '';
    this.questions = [];
    this.question = '';
    this.selectedVersionsPT = [];
    this.selectedVersionQT = null;
    this.view = 'selectType';
    this.errorMessages = [];
    this.selectedStylePT();
    this.selectedStyleQT();
    this.preferenceTestList = [];
    this.questionTestList = [];
    this.preferenceTestList = this.testsDataService.getPreferenceTestsByScreenName(this.screen.name);
    this.questionTestList = this.testsDataService.getQuestionTestsByScreenName(this.screen.name);
  }

  saveLinkPT(id) {
    const link = window.location.origin + '/preference-test/' + id;
    this.testsDataService.getPreferenceTest(id).subscribe(
      (result) => {
        result.link = link;
        this.testsDataService.updatePreferenceTest(id, result).then();
        this.preferenceTestList = [];
        this.preferenceTestList = this.testsDataService.getPreferenceTestsByScreenName(this.screen.name);
      }
    );
    this.createTestSuccess();
    this.openLinkDialog(link);
  }

  saveLinkQT(id) {
    const link = window.location.origin + '/question-test/' + id;
    this.testsDataService.getQuestionTest(id).subscribe(
      (result) => {
        result.link = link;
        this.testsDataService.updateQuestionTest(id, result).then();
        this.questionTestList = [];
        this.questionTestList = this.testsDataService.getQuestionTestsByScreenName(this.screen.name);
      }
    );
    this.createTestSuccess();
    this.openLinkDialog(link);
  }

  showResultsPT(t) {
    this.view = 'resultsPT';
    this.testPT = t;
    this.testService.getImageContent(this.testPT.repoName, this.testPT.repoOwner, this.testPT.screenName, this.testPT.testName, this.testPT.imageName1).then(
      (image) => {
        this.imageOne.nativeElement.src = 'data:image/' + this.testPT.imageExtension + ';base64,' + image['content'];
      }
    );
    this.testService.getImageContent(this.testPT.repoName, this.testPT.repoOwner, this.testPT.screenName, this.testPT.testName, this.testPT.imageName2).then(
      (image) => {
        this.imageTwo.nativeElement.src = 'data:image/' + this.testPT.imageExtension + ';base64,' + image['content'];
      }
    );
  }

  showResultsQT(t) {
    this.view = 'resultsQT';
    this.testQT = t;
    this.testService.getImageContent(this.testQT.repoName, this.testQT.repoOwner, this.testQT.screenName, this.testQT.testName, this.testQT.imageName).then(
      (image) => {
        this.imageSingle.nativeElement.src = 'data:image/' + this.testQT.imageExtension + ';base64,' + image['content'];
      }
    );
  }

  openLinkDialog(link) {
    const modal = this.modal.open(TestLinkComponent);
    modal.componentInstance.testLink = link;
  }
}
