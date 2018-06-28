import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ScreenDataService} from '../../dataservices/screen-data.service';
import {Subscription} from 'rxjs/Subscription';
import {ScreenModel} from '../../datamodels/screen.model';
import {GithubDataService} from '../../dataservices/github-data.service';
import {ProjectService} from '../../services/project.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UpdateImageScreenComponent} from '../update-image-screen/update-image-screen.component';
import {ToastsManager} from 'ng2-toastr';
import {E} from '@angular/core/src/render3';
import {VersionModel} from '../../datamodels/version.model';
import {DomSanitizer} from '@angular/platform-browser';
import * as html2canvas from 'html2canvas';
import * as simpleDrawingBoard from 'simple-drawing-board';
import {FeedbackDataService} from '../../dataservices/feedback-data.service';


@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('previewImage') previewImage: ElementRef;
  @ViewChild('annotationImage') annotationImage: ElementRef;

  htmlData;
  htmlString = '';
  cssString = '';
  screenId: any;
  screen: ScreenModel;
  tabOptions: any;
  selectedTab: string;
  githubSignedIn: boolean;
  versions = [];
  annotations = [];
  addAnnotation = false;

  // Subscriptions
  screenSub: Subscription;
  githubAuthSub: Subscription;
  feedbackSub: Subscription;

  constructor( private route: ActivatedRoute,
               private screenDataService: ScreenDataService,
               private renderer: Renderer2,
               private githubDataService: GithubDataService,
               private projectService: ProjectService,
               private modal: NgbModal,
               private toastr: ToastsManager,
               private vcr: ViewContainerRef,
               private sanitizer: DomSanitizer,
               private feedbackDataService: FeedbackDataService) {
    this.toastr.setRootViewContainerRef(vcr);
    this.screenId = this.route.snapshot.params.screen_key;
    this.screenSub = this.screenDataService.getScreen(this.screenId).subscribe(
      screen => {
        this.screen = screen;
        this.initializeTabs();
        this.getCurrentScreenData();
        this.getVersions();
        this.getAnnotations();
        // TODO: getComments();
      }
    );
    this.githubSignedIn = this.githubDataService.signedIn;
    this.githubAuthSub = this.githubDataService.$githubAuth.subscribe(
      (result) => { this.githubSignedIn = result; }
    );
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.screenSub.unsubscribe();
    this.githubAuthSub.unsubscribe();
    this.feedbackSub.unsubscribe();
  }

  initializeTabs() {
    this.tabOptions = [];
    this.selectedTab = 'Preview';
    this.tabOptions.push({title: 'Preview', cssClass: ' active'});
    this.tabOptions.push({title: 'Annotations', cssClass: ''});
    this.tabOptions.push({title: 'Comments', cssClass: ''});
    if (this.screen.type !== 'image')
      this.tabOptions.push({title: 'Prototype', cssClass: ''});
    this.tabOptions.push({title: 'Version', cssClass: ''});
  }

  onSelectTab(tab) {
    this.selectedTabStyle(tab);
    switch (tab.title) {
      case 'Preview':
        if (this.htmlString === '') {
          this.getCurrentScreenData();
        }
        break;
      case 'Annotations':
        this.getAnnotations();
        break;
      case 'Comments':
        // TODO this.getComments();
        break;
      case 'Prototype':
        break;
      case 'Version':
        this.getVersions();
        break;
    }
  }

  selectedTabStyle(tab) {
    for (let i = 0; i < this.tabOptions.length; i++) {
      if (this.tabOptions[i].title === tab.title) {
        this.tabOptions[i].cssClass = 'active';
        this.selectedTab = tab.title;
      } else {
        this.tabOptions[i].cssClass = '';
      }
    }
  }

  saveNewImageVersion() {
    const modal = this.modal.open(UpdateImageScreenComponent);
    modal.componentInstance.screen = this.screen;
    modal.result.then(
      (data) => {
        if (data.result === 'success') {
          this.toastr.success('Screen updated.', 'Success!');
        } else if (data.result === 'error') {
          this.toastr.error('We could not update your screen', 'There was an error');
        }
      }
    );
  }

  getCurrentScreenData() {
    if (this.screen.type === 'image') {
      this.githubDataService.getFile(this.screen.repository, this.screen.repositoryOwner, this.screen.name
        + '/' + this.screen.name + '.' + this.screen.imageExtension).subscribe(
        (file) => {
          this.previewImage.nativeElement.src = 'data:image/' + this.screen.imageExtension + ';base64,' + file['content'];
        }
      );
    } else {
      this.githubDataService.getFile(this.screen.repository, this.screen.repositoryOwner, this.screen.name
        + '/' + this.screen.name + '.html').subscribe(
        (file) => {
          this.htmlData = atob(file['content']);
          this.htmlString = atob(file['content']);
          this.githubDataService.getFile(this.screen.repository, this.screen.repositoryOwner, this.screen.name
            + '/' + this.screen.name + '.css').subscribe(
            (fileCss) => {
              this.cssString = atob(fileCss['content']);
              this.htmlData = this.sanitizer.bypassSecurityTrustHtml('<head><style>' + this.cssString + '"</style></head>' + this.htmlData);
            }
          );
        }
      );
    }
  }

  getVersions() {
    this.projectService.getScreenVersions(this.screen).then(
      (versions) => { this.versions = versions; }
    );
  }

  showVersion (version) {
    if (this.screen.type === 'image') {
      this.projectService.getVersionImage(this.screen, version).then(
        (result) => {
          this.previewImage.nativeElement.src = 'data:image/' + this.screen.imageExtension + ';base64,' + result['image'];
          this.selectedTabStyle(this.tabOptions[0]);
        }
      );
    } else {
      this.projectService.getVersionGrapesJs(this.screen, version).then(
        (result) => {
          this.htmlData = this.sanitizer.bypassSecurityTrustHtml('<head><style>' + result.css + '</style></head>' + result.html);
          this.htmlString = result.html;
          this.cssString = result.css;
          this.selectedTabStyle(this.tabOptions[0]);
        }
      );
    }
  }

  displayAnnotationCanvas() {
    const self = this;
    const annotationContainer = document.getElementById('annotationContainer');
    while (annotationContainer.hasChildNodes()) {
      annotationContainer.removeChild(annotationContainer.lastChild);
    }
    if (this.screen.type === 'image') {
      const canvas = document.createElement('canvas');
      const canvasCtx = canvas.getContext('2d');
      canvas.width = this.previewImage.nativeElement.width;
      canvas.height = this.previewImage.nativeElement.height;
      canvasCtx.drawImage(this.previewImage.nativeElement, 0, 0);
      annotationContainer.appendChild(canvas);
      canvas.id = 'annotationCanvas';
      if (self.githubSignedIn) {
        const sdb = new simpleDrawingBoard(canvas);
      }
    } else {
      const previewIframe = <HTMLIFrameElement> document.getElementById('previewIframe');
      html2canvas(previewIframe.contentDocument.documentElement).then(function(canvas) {
        annotationContainer.appendChild(canvas);
        canvas.id = 'annotationCanvas';
        if (self.githubSignedIn) {
          const sdb = new simpleDrawingBoard(canvas);
        }
      });
    }
  }

  saveAnnotation() {
    let anotationImage = '';
    const canvas = <HTMLCanvasElement> document.getElementById('annotationCanvas');
    anotationImage = canvas.toDataURL().replace(/data:.*?;base64,/g, '');
    this.projectService.saveAnnotation(this.screen, anotationImage).then(
      (result) => { this.toastr.success('Annotation saved.', 'Success!'); },
    (error) => { this.toastr.error('We could not save your annotation.', 'There was an error'); }
    );
  }

  getAnnotations() {
    this.addAnnotation = false;
    this.feedbackSub = this.feedbackDataService.getAnnotations().subscribe(
      (annotations) => {
        this.annotations = annotations;
        this.showAnnotation(this.annotations[0]);
        this.selectedAnnotationStyle(this.annotations[0]);
      }
    );
  }

  showAnnotation(annotation) {
    return this.githubDataService.getFile(annotation.repository, annotation.repositoryOwner, annotation.screenName + '/annotations/' + annotation.annotationName + '.png').subscribe(
      (result) => {
        this.annotationImage.nativeElement.src = 'data:image/png;base64,' + result['content'];
        this.selectedAnnotationStyle(annotation);
      }
    );
  }

  selectedAnnotationStyle(annotation) {
    for (let i = 0; i < this.annotations.length; i++) {
      if (this.annotations[i].annotationName === annotation.annotationName) {
        this.annotations[i].cssClass = 'table-secondary';
      } else {
        this.annotations[i].cssClass = 'table-light';
      }
    }
  }
}
