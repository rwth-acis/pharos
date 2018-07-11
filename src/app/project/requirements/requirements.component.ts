import {Component, OnDestroy, OnInit} from '@angular/core';
import {RequirementsBazaarDataService} from '../../dataservices/requirements-bazaar.service';

import '../../../../bower_components/reqbaz-project-widget/reqbaz-project-widget.html';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {GithubDataService} from '../../dataservices/github-data.service';
import {ProjectsDataService} from '../../dataservices/projects-data.service';
import {AppGlobals} from '../../appGlobals';
import {UserDataService} from '../../dataservices/user-data.service';



@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css']
})
export class RequirementsComponent implements OnInit, OnDestroy{

  rbProject;
  authToken = null;
  githubSignedIn: boolean;
  rbSignedIn: boolean;
  projectId;
  project;
  user;

  githubAuthSub: Subscription;
  projectSub: Subscription;
  maintainerSub: Subscription;

  constructor(private appGlobals: AppGlobals,
              private rbDataService: RequirementsBazaarDataService,
              private router: Router,
              private githubDataService: GithubDataService,
              private route: ActivatedRoute,
              private projectsDataService: ProjectsDataService,
              private userDataService: UserDataService) {
    this.rbSignedIn = this.userDataService.signedIn;
    this.projectId = this.route.snapshot.params.key;
    this.projectSub = this.projectsDataService.getProject(this.projectId).subscribe(
      project => {
        this.project = project;
        this.rbDataService.getPoject(project.requirementsBazaarProjectId).subscribe(
          (result) => {
            this.rbProject = result;
          });
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
    this.authToken = this.rbDataService.token;
    this.user = this.userDataService.userOidc;
    this.maintainerSub = this.userDataService.$isMaintainer.subscribe(
      (result) => {
        this.user = this.userDataService.userOidc;
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.githubAuthSub.unsubscribe();
    this.projectSub.unsubscribe();
    this.maintainerSub.unsubscribe();
  }

  checkLoginStatus() {
    if (!this.githubSignedIn) {
      this.router.navigate(['login']);
    }
  }
}
