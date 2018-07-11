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
import {ActivatedRoute, Router} from '@angular/router';
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
import {AnnotationsDataService} from '../../dataservices/annotations-data.service';
import {AnnotationModel} from '../../datamodels/annotation.model';
import {ConfirmationDialogComponent} from '../../utils/confirmation-dialog/confirmation-dialog.component';
import {UserDataService} from '../../dataservices/user-data.service';
import {AppGlobals} from '../../appGlobals';

import '../../../../bower_components/las2peer-comment-widget/las2peer-comment-widget.html';
import {VersionsDataService} from '../../dataservices/versions-data.service';
import {environment} from '../../../environments/environment';
import {Project} from '../../datamodels/project.model';
import {ProjectsDataService} from '../../dataservices/projects-data.service';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('previewImage') previewImage: ElementRef;
  @ViewChild('annotationImage') annotationImage: ElementRef;

  projectId: any;
  project: Project;
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
  currentAnnotation: AnnotationModel;
  isMaintainer = false;
  selectedVersion: VersionModel;
  serviceNode;

  // Subscriptions
  screenSub: Subscription;
  githubAuthSub: Subscription;
  maintainerSub: Subscription;
  projectSub: Subscription;

  constructor( private route: ActivatedRoute,
               private screenDataService: ScreenDataService,
               private renderer: Renderer2,
               private githubDataService: GithubDataService,
               private projectService: ProjectService,
               private modal: NgbModal,
               private toastr: ToastsManager,
               private vcr: ViewContainerRef,
               private sanitizer: DomSanitizer,
               private annotationsDataService: AnnotationsDataService,
               private userDataService: UserDataService,
               private appGlobals: AppGlobals,
               private router: Router,
               private versionsDataService: VersionsDataService,
               private projectsDataService: ProjectsDataService) {
    this.toastr.setRootViewContainerRef(vcr);
    this.projectId = this.route.snapshot.params.key;
    this.projectSub = this.projectsDataService.getProject(this.projectId).subscribe(
      project => {
        this.project = project;
        this.appGlobals.setAppGlobals({title: this.project.name, showOptions: true, projectKey: this.projectId});
      }
    );
    this.screenId = this.route.snapshot.params.screen_key;
    this.isMaintainer = this.appGlobals.isMaintainer;
    this.appGlobals.projectKey = this.route.snapshot.params.key;
    this.screenSub = this.screenDataService.getScreen(this.screenId).subscribe(
      screen => {
        if (!this.selectedTab) {
          this.screen = screen;
          this.initializeTabs();
          this.getCurrentScreenData();
          this.getVersions();
          this.getAnnotations();
          this.selectedVersion = this.versions[0];
        }
      }
    );
    this.githubSignedIn = this.githubDataService.signedIn;
    this.checkLoginStatus();
    this.githubAuthSub = this.githubDataService.$githubAuth.subscribe(
      (result) => {
        this.githubSignedIn = result;
        this.checkLoginStatus();
      }
    );
    this.maintainerSub = this.userDataService.$isMaintainer.subscribe(
      (result) => {
        this.isMaintainer = result;
        this.initializeTabs();
      }
    );
    this.serviceNode = environment.comment_service.service_node;
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.screenSub.unsubscribe();
    this.githubAuthSub.unsubscribe();
    this.maintainerSub.unsubscribe();
    this.projectSub.unsubscribe();
  }

  initializeTabs() {
    this.tabOptions = [];
    this.selectedTab = 'Preview';
    this.tabOptions.push({title: 'Preview', cssClass: ' active'});
    if (this.screen.type !== 'image')
      this.tabOptions.push({title: 'Prototype', cssClass: ''});
    this.tabOptions.push({title: 'Annotations', cssClass: ''});
    this.tabOptions.push({title: 'Comments', cssClass: ''});
    if (this.isMaintainer)
      this.tabOptions.push({title: 'Tests', cssClass: ''});
    this.tabOptions.push({title: 'Version', cssClass: ''});
  }

  onSelectTab(tab) {
    if (this.selectedTab === 'Prototype' && this.githubSignedIn) {
      const modal = this.modal.open(ConfirmationDialogComponent);
      modal.componentInstance.message = 'Do you want to leave before saving your changes?';
      modal.result.then(
        (data) => {
          if (data.result === 'accept') {
            this.selectedTabStyle(tab);
            switch (tab.title) {
              case 'Preview':
                /*if (this.htmlString === '') {
                  this.getCurrentScreenData();
                }*/
                break;
              case 'Annotations':
                this.getAnnotations();
                break;
              case 'Comments':
                break;
              case 'Prototype':
                break;
              case 'Version':
                this.getVersions();
                break;
              case 'Tests':
                this.getVersions();
                break;
            }
          } else {
            return;
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.selectedTabStyle(tab);
      switch (tab.title) {
        case 'Preview':
          /*if (this.htmlString === '') {
            this.getCurrentScreenData();
          }*/
          break;
        case 'Annotations':
          this.getAnnotations();
          break;
        case 'Comments':
          break;
        case 'Prototype':
          break;
        case 'Version':
          this.getVersions();
          break;
        case 'Tests':
          this.getVersions();
          break;
      }
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
          this.screen.gitHubShaImage = file['sha'];
          this.previewImage.nativeElement.src = 'data:image/' + this.screen.imageExtension + ';base64,' + file['content'];
        }
      );
    } else {
      this.githubDataService.getFile(this.screen.repository, this.screen.repositoryOwner, this.screen.name
        + '/' + this.screen.name + '.html').subscribe(
        (file) => {
          this.htmlString = atob(file['content']);
          this.githubDataService.getFile(this.screen.repository, this.screen.repositoryOwner, this.screen.name
            + '/' + this.screen.name + '.css').subscribe(
            (fileCss) => {
              this.cssString = atob(fileCss['content']);
              this.htmlData = this.sanitizer.bypassSecurityTrustHtml('<head><style>' + this.cssString + '</style></head><body>' + this.htmlString + '</body>');
              this.screen.gitHubShaHtml = file['sha'];
              this.screen.gitHubShaCss = file['sha'];
            }
          );
        }
      );
    }
  }

  getVersions() {
    this.versions = this.versionsDataService.getVersionsByScreenId(this.screenId);
  }

  showVersion (version) {
    this.selectedVersion = version;
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
      (result) => {
        this.toastr.success('Annotation saved.', 'Success!');
        this.selectedTab = 'Preview';
        this.selectedTabStyle(this.tabOptions[0]);
        this.addAnnotation = false;
        this.getAnnotations();
        },
    (error) => { this.toastr.error('We could not save your annotation.', 'There was an error'); }
    );
  }

  getAnnotations() {
    this.addAnnotation = false;
    this.annotations = this.annotationsDataService.getAnnotationsByScreenName(this.screen.name);
    if (this.annotations.length > 0) {
      this.currentAnnotation = this.annotations[0];
      this.showAnnotation(this.annotations[0]);
      this.selectedAnnotationStyle(this.annotations[0]);
    }
  }

  showAnnotation(annotation) {
    this.currentAnnotation = annotation;
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

  checkLoginStatus() {
    if (!this.githubSignedIn) {
      this.router.navigate(['login']);
    }
  }
}
