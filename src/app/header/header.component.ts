import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {AppGlobals} from '../appGlobals';
import {GithubDataService} from '../dataservices/github-data.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  appGlobalsSub: Subscription;
  githubAuthSub: Subscription;
  options: any;
  isCollapsed =  true;
  githubSignedIn: boolean;

  constructor(private appGlobals: AppGlobals,
              private gitHubDataService: GithubDataService,
              private activatedRoute: ActivatedRoute) {
    this.options = {title: 'Project', showOptions: false};
    this.appGlobalsSub = this.appGlobals.$appGlobals.subscribe(
      (options) => { this.options = options; }
    );
    this.activatedRoute.queryParams.subscribe(params => {
      const code = params['code'];
      console.log(code);
      if (code) {
        this.gitHubDataService.getToken(code);
        // TODO: implement sign out
      }
    });
    this.githubSignedIn = this.gitHubDataService.signedIn;
    this.githubAuthSub = this.gitHubDataService.$githubAuth.subscribe(
      (result) => { this.githubSignedIn = result; }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
   this.appGlobalsSub.unsubscribe();
   this.githubAuthSub.unsubscribe();
  }

  githubSingIn() {
    this.gitHubDataService.getCode();
  }
}
