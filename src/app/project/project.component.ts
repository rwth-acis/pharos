import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectsDataService} from '../dataservices/projects-data.service';
import {Project} from '../datamodels/project.model';
import {Subscription} from 'rxjs/Subscription';
import {AppGlobals} from '../appGlobals';
import {DomSanitizer} from '@angular/platform-browser';
import {ConfirmationDialogComponent} from '../utils/confirmation-dialog/confirmation-dialog.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastsManager} from 'ng2-toastr';
import {NewScreenComponent} from './new-screen/new-screen.component';
import {ScreenDataService} from '../dataservices/screen-data.service';
import {GithubDataService} from '../dataservices/github-data.service';
import {ProjectService} from '../services/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('screen') screen: ElementRef;

  projectId: any;
  project: Project;
  screens  = [];
  samplePage = '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<body>\n' +
    '<h1>Sample Title</h1>\n' +
    '<div class="card border-primary mb-3" style="width: 70%; height: 70%">\n' +
    '  <h3>Sample Div</h3>\n' +
    '  <p class="lead">Sample paragraph</p>\n' +
    '  <button class="btn btn-primary btn-lg">Sample Button</button>\n' +
    '</div>\n' +
    '\n' +
    '</body>\n' +
    '</html>';
  sampleCss = 'body{background-color: #fefefe}';
  htmlData = '';
  githubSignedIn: boolean;

  // Subscriptions
  projectSub: Subscription;
  screeensSub: Subscription;
  githubAuthSub: Subscription;

  constructor(private appGlobals: AppGlobals,
              private route: ActivatedRoute,
              private projectsDataService: ProjectsDataService,
              private screenDataService: ScreenDataService,
              private sanitizer: DomSanitizer,
              private renderer: Renderer2,
              private modal: NgbModal,
              private toastr: ToastsManager,
              private vcr: ViewContainerRef,
              private router: Router,
              private githubDataService: GithubDataService,
              private projectService: ProjectService) {
    this.toastr.setRootViewContainerRef(vcr);
    this.projectId = this.route.snapshot.params.key;
    this.projectSub = this.projectsDataService.getProject(this.projectId).subscribe(
      project => {
        this.project = project;
        this.appGlobals.setAppGlobals({title: this.project.name, showOptions: true, projectKey: this.projectId});
      }
    );
    this.screeensSub = this.screenDataService.getScreenList().subscribe(
      screens => {
        this.screens = screens;
      }
    );
    this.githubSignedIn = this.githubDataService.signedIn;
    this.githubAuthSub = this.githubDataService.$githubAuth.subscribe(
      (result) => { this.githubSignedIn = result; }
    );
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    //this.getBodyElements(this.samplePage);
  }

  ngOnDestroy() {
    this.projectSub.unsubscribe();
    this.screeensSub.unsubscribe();
    this.githubAuthSub.unsubscribe();
  }

  addScreen() {
    const modal = this.modal.open(NewScreenComponent);
    modal.componentInstance.githubRepoName = this.project.gitHubRepoName;
    modal.componentInstance.githubRepoOwner = this.project.createdBy;
    modal.result.then(
      (data) => {
        if (data.result === 'success') {
          this.toastr.success('Screen created.', 'Success!');
          // this.router.navigate(['/projects', this.projectId , '/screens', data.screen.key]);
        } else if (data.result === 'error') {
          this.toastr.error('We could not create your screen', 'There was an error');
        }
      }
    );
  }

  deleteScreen (screen) {
    const modal = this.modal.open(ConfirmationDialogComponent);
    modal.componentInstance.message = 'Do you want to delete this screen?';
    modal.result.then(
      (data) => {
        if (data.result === 'accept') {
          if (screen.type === 'image') {
            this.projectService.deleteScreenImage(this.project.gitHubRepoName, this.project.createdBy, screen).then(
              (result) => {
                this.toastr.success('Screen deleted.', 'Success!');
              },
              (error) => {
                this.toastr.error('We could not delete your screen. Please try again.', 'There was an error');
                console.log('Error', error);
              }
            );
          } else {
            this.projectService.deleteScreenGrapesJS(this.project.gitHubRepoName, screen).then(
              (result) => {
                this.toastr.success('Screen deleted.', 'Success!');
              },
              (error) => {
                this.toastr.error('We could not delete your screen. Please try again.', 'There was an error');
                console.log('Error', error);
              }
            );
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  goToScreen(id) {
    this.screenDataService.setScreenData(this.samplePage, this.sampleCss);
    this.router.navigate(['projects', this.projectId , 'screens', id]);
  }

  getBodyElements() {
    /*var tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.samplePage;
    let bodyElements  = tempDiv.querySelectorAll('*');
    //console.log(tempDiv.innerHTML);
    this.htmlData = tempDiv.innerHTML;*/
    //this.htmlData = this.sanitizer.bypassSecurityTrustStyle(tempDiv.outerHTML).toString();
    this.htmlData = this.samplePage;
    console.log(this.htmlData);
    this.test();
  }

  onScreenChange() {
    console.log('change', this.htmlData);
  }

  test() {
    let nodes = this.screen.nativeElement.querySelectorAll('*');
    console.log("nodes", nodes);
    for (let i = 0; i <  nodes.length; i++) {
      let node = nodes.item(i);
      /*node.setAttribute('data-container', 'body');
      node.setAttribute('data-toggle', 'popover');
      node.setAttribute('data-placement', 'right');
      node.setAttribute('data-content', 'Tag name');
      node.setAttribute('data-original-title', 'Title');
      node.setAttribute('width', '500px');*/
      this.renderer.setProperty(node, 'data-container', 'body');
      this.renderer.setProperty(node, 'data-toggle', 'popover');
      this.renderer.setProperty(node, 'data-placement', 'right');
      this.renderer.setProperty(node, 'data-content', 'Tag name');
      this.renderer.setProperty(node, 'data-original-title', 'Title');
      this.renderer.setProperty(node, 'width', '500px');
      node.addEventListener('click', function (e) {
        console.log('event', e);
      }.bind(this));
      console.log(node);
    }
  }
}

