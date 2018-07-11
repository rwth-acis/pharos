import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {AppGlobals} from '../appGlobals';
import {GithubDataService} from '../dataservices/github-data.service';
import {ActivatedRoute} from '@angular/router';
import {UserDataService} from '../dataservices/user-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  appGlobalsSub: Subscription;
  githubAuthSub: Subscription;
  oidcAuthSub: Subscription;
  maintainerSub: Subscription;
  options: any;
  isCollapsed =  true;
  githubSignedIn: boolean;
  oidcSignedIn: boolean;
  isMaintainer = false;
  isTestView = false;

  constructor(private appGlobals: AppGlobals,
              private gitHubDataService: GithubDataService,
              private activatedRoute: ActivatedRoute,
              private userDataService: UserDataService) {
    this.options = {title: 'Pharos', showOptions: true};
    this.appGlobalsSub = this.appGlobals.$appGlobals.subscribe(
      (options) => { this.options = options; }
    );
    if (window.location.pathname.indexOf('test') !== -1) {
      this.isTestView = true;
    } else {
      this.isTestView = false;
    }
    /*this.activatedRoute.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.gitHubDataService.getToken(code);
      }
    });
    if (window.location.hash) {
      const token = window.location.hash.substring(14);
      this.userDataService.receiveToken(token);
    }
    this.githubSignedIn = this.gitHubDataService.signedIn;
    this.githubAuthSub = this.gitHubDataService.$githubAuth.subscribe(
      (result) => { this.githubSignedIn = result; }
    );
    this.oidcSignedIn = this.userDataService.signedIn;
    this.oidcAuthSub = this.userDataService.$oidcAuth.subscribe(
      (result) => { this.oidcSignedIn = result; }
    );*/
    this.maintainerSub = this.userDataService.$isMaintainer.subscribe(
      (result) => { this.isMaintainer = result; }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
   this.appGlobalsSub.unsubscribe();
   /*this.githubAuthSub.unsubscribe();
   this.oidcAuthSub.unsubscribe();*/
   this.maintainerSub.unsubscribe();
  }

  githubSignIn() {
    this.gitHubDataService.getCode();
  }

  oidcSignIn() {
    this.userDataService.getToken();
  }
}
