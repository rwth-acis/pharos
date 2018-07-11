import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {TestsDataService} from '../../dataservices/tests-data.service';
import {ActivatedRoute} from '@angular/router';
import {TestService} from '../../services/test.service';
import {E} from '@angular/core/src/render3';
import {ToastsManager} from 'ng2-toastr';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-test-preference',
  templateUrl: './test-preference.component.html',
  styleUrls: ['./test-preference.component.scss']
})
export class TestPreferenceComponent implements OnInit, OnDestroy {

  testId;
  test;
  view = 'start'; // start, introduction, comparison, singleImage, end
  imageSrc1;
  imageSrc2;
  imageSingleSrc;

  testSub;

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
    this.testSub = this.testsDataService.getPreferenceTest(this.testId).subscribe(
      (test) => {
        this.test = test;
        this.testService.getImageContent(this.test.repoName, this.test.repoOwner, this.test.screenName, this.test.testName, this.test.imageName1).then(
          (image) => {
            this.imageSrc1 = this.sanitizer.bypassSecurityTrustUrl('data:image/' + this.test.imageExtension + ';base64,' + image['content']);
          }
        );
        this.testService.getImageContent(this.test.repoName, this.test.repoOwner, this.test.screenName, this.test.testName, this.test.imageName2).then(
          (image) => {
            this.imageSrc2 = this.sanitizer.bypassSecurityTrustUrl('data:image/' + this.test.imageExtension + ';base64,' + image['content']);
          }
        );
      }
    );
  }

  ngOnDestroy() {
    this.testSub.unsubscribe();
  }

  viewImage(img) {
    if (img === '1') {
      this.imageSingleSrc = this.imageSrc1;
    } else {
      this.imageSingleSrc = this.imageSrc2;
    }
    this.view = 'singleImage';
  }

  selectOption(option) {
    // TODO: add participant
    if (option === '1') {
      this.test.votesV1++;
    } else {
      this.test.votesV2++;
    }
    this.testsDataService.updatePreferenceTest(this.testId, this.test).then(
      (result) => {
        this.toastr.success('Test results saved!');
        this.view = 'end';
      }
    );
  }
}
