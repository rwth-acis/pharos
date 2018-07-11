import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {UserDataService} from '../dataservices/user-data.service';
import {GithubDataService} from '../dataservices/github-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AppGlobals} from '../appGlobals';

@Component({
  selector: 'app-login-github',
  templateUrl: './login-github.component.html',
  styleUrls: ['./login-github.component.scss']
})
export class LoginGithubComponent implements OnInit, OnDestroy {

  githubAuthSub: Subscription;
  options: any;
  githubSignedIn: boolean;
  isMaintainer = false;
  signedIn: boolean;

  constructor(private gitHubDataService: GithubDataService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private appGlobals: AppGlobals,
              private userDataService: UserDataService) {
    this.signedIn = this.userDataService.signedIn;
    this.checkLoginStatus();
    this.appGlobals.setAppGlobals({title: 'Pharos', showOptions: false, projectKey: null});
    this.activatedRoute.queryParams.subscribe(params => {
      const token = params['access_token'];
      if (token) {
        this.gitHubDataService.setToken(token);
      }
    });
    this.githubSignedIn = this.gitHubDataService.signedIn;
    if (this.githubSignedIn) {
      this.router.navigate(['projects']);
    }
    this.githubAuthSub = this.gitHubDataService.$githubAuth.subscribe(
      (result) => {
        this.githubSignedIn = result;
        this.router.navigate(['projects']);
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.githubAuthSub.unsubscribe();
  }

  githubSignIn() {
    this.gitHubDataService.getCode();
  }

  checkLoginStatus() {
    if (!this.signedIn) {
      this.router.navigate(['login']);
    }
  }
}
