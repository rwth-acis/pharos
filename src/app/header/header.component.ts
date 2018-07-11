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
  maintainerSub: Subscription;
  options: any;
  isCollapsed =  true;
  githubSignedIn: boolean;
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
    this.maintainerSub = this.userDataService.$isMaintainer.subscribe(
      (result) => { this.isMaintainer = result; }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
   this.appGlobalsSub.unsubscribe();
   this.maintainerSub.unsubscribe();
  }

  githubSignIn() {
    this.gitHubDataService.getCode();
  }

  oidcSignIn() {
    this.userDataService.getToken();
  }
}
