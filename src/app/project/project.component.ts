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
import {UserDataService} from '../dataservices/user-data.service';

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
  githubSignedIn: boolean;
  isMaintainer;

  // Subscriptions
  projectSub: Subscription;
  githubAuthSub: Subscription;
  maintainerSub: Subscription;

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
              private projectService: ProjectService,
              private userDataService: UserDataService) {
    this.toastr.setRootViewContainerRef(vcr);
    this.projectId = this.route.snapshot.params.key;
    this.projectSub = this.projectsDataService.getProject(this.projectId).subscribe(
      project => {
        this.project = project;
        this.appGlobals.setAppGlobals({title: this.project.name, showOptions: true, projectKey: this.projectId});
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
    this.isMaintainer = this.appGlobals.isMaintainer;
    this.maintainerSub = this.userDataService.$isMaintainer.subscribe(
      (result) => { this.isMaintainer = result; }
    );
  }

  ngOnInit() {
    this.screens = this.screenDataService.getScreenListByProjectId(this.projectId);
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.projectSub.unsubscribe();
    this.githubAuthSub.unsubscribe();
    this.maintainerSub.unsubscribe();
  }

  addScreen() {
    const modal = this.modal.open(NewScreenComponent);
    modal.componentInstance.githubRepoName = this.project.gitHubRepoName;
    modal.componentInstance.githubRepoOwner = this.project.githubRepoOwner;
    modal.componentInstance.projectId = this.projectId;
    modal.result.then(
      (data) => {
        if (data.result === 'success') {
          this.toastr.success('Screen created.', 'Success!');
          this.screens = this.screenDataService.getScreenListByProjectId(this.projectId);
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
                this.screens = this.screenDataService.getScreenListByProjectId(this.projectId);
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
                this.screens = this.screenDataService.getScreenListByProjectId(this.projectId);
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
    this.router.navigate(['projects', this.projectId , 'screens', id]);
  }

  checkLoginStatus() {
    if (!this.githubSignedIn) {
      this.router.navigate(['login']);
    }
  }
}

