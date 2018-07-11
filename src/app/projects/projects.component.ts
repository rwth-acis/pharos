import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {Project} from '../datamodels/project.model';
import {ProjectsDataService} from '../dataservices/projects-data.service';
import {Subscription} from 'rxjs/Subscription';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NewProjectComponent} from './new-project/new-project.component';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {ConfirmationDialogComponent} from '../utils/confirmation-dialog/confirmation-dialog.component';
import {AppGlobals} from '../appGlobals';
import {Router} from '@angular/router';
import {GithubDataService} from '../dataservices/github-data.service';
import {ProjectService} from '../services/project.service';
import {UserDataService} from '../dataservices/user-data.service';


/*import '../../../bower_components/direwolf-elements/direwolf-space.html';
import '../../../bower_components/direwolf-modeler/direwolf-modeler.html';*/
/*
import '../../../bower_components/direwolf-modeler/direwolf-web-designer.html';
import '../../../bower_components/direwolf-modeler/direwolf-transformer-ifml2html.html';
*/

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  projects: Project[];
  checked: boolean;
  githubSignedIn;
  isMaintainer = false;

  // Subscriptions
  projectsListSub: Subscription;
  githubAuthSub: Subscription;
  maintainerSub: Subscription;

  constructor(private appGlobals: AppGlobals,
              private projectsDataService: ProjectsDataService,
              private modal: NgbModal,
              private toastr: ToastsManager,
              private vcr: ViewContainerRef,
              private router: Router,
              private githubDataService: GithubDataService,
              private projectService: ProjectService,
              private userDataService: UserDataService) {
    this.appGlobals.setAppGlobals({title: 'Projects', showOptions: false, projectKey: null});
    this.isMaintainer = this.appGlobals.isMaintainer;
    this.toastr.setRootViewContainerRef(vcr);
    this.projectsListSub = this.projectsDataService.getProjectList().subscribe(
      projects => {
        this.projects = projects;
      }
    );
    this.githubSignedIn = this.githubDataService.signedIn;
    this.checkLoginStatus();
    this.githubAuthSub = this.githubDataService.$githubAuth.subscribe(
      (result) => {
        this.githubSignedIn = result;
        this.checkLoginStatus();
        this.isMaintainer = this.appGlobals.isMaintainer;
      }
    );
    this.maintainerSub = this.userDataService.$isMaintainer.subscribe(
      (result) => { this.isMaintainer = result; }
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.projectsListSub.unsubscribe();
    this.githubAuthSub.unsubscribe();
    this.maintainerSub.unsubscribe();
  }

  addProject () {
    this.modal.open(NewProjectComponent).result.then(
      (data) => {
        if (data.result === 'success') {
          this.toastr.success('Project created.', 'Success!');
          // this.router.navigate(['/projects', data.project.key]);
        } else if (data.result === 'error') {
          this.toastr.error('We could not create your project', 'There was an error');
        }
      }
    );
  }

  deleteProject (project) {
    const modal = this.modal.open(ConfirmationDialogComponent);
    modal.componentInstance.message = 'Do you want to delete this project?';
    modal.result.then(
      (data) => {
        if (data.result === 'accept') {
          this.projectService.deleteProject(project).then(
            (result) => {
              this.toastr.success('Project deleted.', 'Success!');
            },
            (error) => {
              this.toastr.error('We could not delete your project', 'There was an error');
              console.log('Error', error);
            }
          );
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  checkLoginStatus() {
    if (!this.githubSignedIn) {
      this.router.navigate(['login']);
    }
  }
}
