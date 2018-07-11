import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {UserDataService} from '../dataservices/user-data.service';
import {GithubDataService} from '../dataservices/github-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AppGlobals} from '../appGlobals';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy  {

  oidcAuthSub: Subscription;
  oidcSignedIn: boolean;

  constructor(private appGlobals: AppGlobals,
              private gitHubDataService: GithubDataService,
              private activatedRoute: ActivatedRoute,
              private userDataService: UserDataService,
              private router: Router) {
    this.appGlobals.setAppGlobals({title: 'Pharos', showOptions: false, projectKey: null});
    if (window.location.hash) {
      const token = window.location.hash.substring(14);
      this.userDataService.receiveToken(token);
    }
    this.oidcSignedIn = this.userDataService.signedIn;
    this.oidcAuthSub = this.userDataService.$oidcAuth.subscribe(
      (result) => {
        this.oidcSignedIn = result;
        this.router.navigate(['login-github']);
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.oidcAuthSub.unsubscribe();
  }

  oidcSignIn() {
    this.userDataService.getToken();
  }

}
