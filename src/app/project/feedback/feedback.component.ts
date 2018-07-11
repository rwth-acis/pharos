import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppGlobals} from '../../appGlobals';
import {AnnotationsDataService} from '../../dataservices/annotations-data.service';
import {Subscription} from 'rxjs/Subscription';

import '../../../../bower_components/las2peer-comment-widget/las2peer-comment-widget.html';
import {UserModel} from '../../datamodels/user.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Project} from '../../datamodels/project.model';
import {ProjectsDataService} from '../../dataservices/projects-data.service';
import {UserDataService} from '../../dataservices/user-data.service';
import {environment} from '../../../environments/environment';
import {GithubDataService} from '../../dataservices/github-data.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit, OnDestroy {

  user: UserModel;
  projectId: any;
  project: Project;
  oidcSignedIn;
  githubSignedIn: boolean;
  serviceNode;

  projectSub: Subscription;
  oidcAuthSub: Subscription;
  githubAuthSub: Subscription;

  constructor(private appGlobals: AppGlobals,
              private route: ActivatedRoute,
              private projectsDataService: ProjectsDataService,
              private userDataService: UserDataService,
              private router: Router,
              private githubDataService: GithubDataService) {
    this.user = this.appGlobals.user;
    this.oidcSignedIn = this.userDataService.signedIn;
    this.projectId = this.route.snapshot.params.key;
    this.projectSub = this.projectsDataService.getProject(this.projectId).subscribe(
      project => {
        this.project = project;
      }
    );
    this.oidcAuthSub = this.userDataService.$oidcAuth.subscribe(
      (result) => {
        this.oidcSignedIn = result;
        this.user = this.appGlobals.user;
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
    this.serviceNode = environment.comment_service.service_node;
  }

  ngOnInit() {
    this.githubAuthSub.unsubscribe();
  }

  ngOnDestroy() {
  }

  checkLoginStatus() {
    if (!this.githubSignedIn) {
      this.router.navigate(['login']);
    }
  }
}
