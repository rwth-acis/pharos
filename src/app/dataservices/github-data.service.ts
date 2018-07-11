import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs/Subject';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database-deprecated';
import {VersionModel} from '../datamodels/version.model';

@Injectable()
export class GithubDataService {

  private path = 'https://api.github.com/';

  httpOptions;
  user: any;
  token: any;
  signedIn = false;

  private githubAuth: Subject<any> = new Subject<any>();

  public $githubAuth = this.githubAuth.asObservable();

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
    };
    const token = localStorage.getItem('oauth2_github');
    const  timestamp = localStorage.getItem('timestamp_oauth2_github');
    const diff = Date.now() - new Date(timestamp).getTime();
    if (token && diff < 3600000) {
      this.token = token;
      this.httpOptions = {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'bearer ' + token

        })
      };
      this.githubAuth.next(true);
      this.signedIn = true;
      this.getUser();
    }
  }

  getCode() {
    window.location.href = 'https://github.com/login/oauth/authorize?client_id=' + environment.github.clientId + '&scope=repo%20delete_repo';
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('oauth2_github', this.token);
    localStorage.setItem('timestamp_oauth2_github', new Date().toString());
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + token

      })
    };
    this.getUser();
    this.signedIn = true;
    this.githubAuth.next(true);
  }

  getUser() {
    return this.http.get(this.path + 'user', this.httpOptions).toPromise().then(
      (user) => { this.user = user; return this.user; },
      (error) => { this.handleError(error); }
    );
  }

  createRepo(name, description) {
    const params = {
      name: name,
      description: description
    };
    return this.http.post(this.path + 'user/repos', params, this.httpOptions);
  }

  deleteRepo(repoName, owner) {
    return this.http.delete(this.path + 'repos/' + owner + '/' + repoName, this.httpOptions);
  }

  createFile (repoName, owner, blob, screenPath, commitMessage) {
    const params = {
      message: commitMessage,
      encoding: 'base64',
      content: blob
    };
    return this.http.put(this.path + 'repos/' + owner + '/' + repoName + '/contents/' + screenPath, params, this.httpOptions);
  }

  getFile(repoName, owner, screenPath, ref = 'master') {
    return this.http.get(this.path + 'repos/' + owner + '/' + repoName + '/contents/' + screenPath + '?ref=' + ref, this.httpOptions);
  }

  updateFile (repoName, owner, blob, screenPath, commitMessage, sha) {
    const params = {
      message: commitMessage,
      content: blob,
      sha: sha
    };
    return this.http.put(this.path + 'repos/' + owner + '/' + repoName + '/contents/' + screenPath, params, this.httpOptions);
  }

  deleteFile (repoName, owner, screenPath, commitMessage, sha) {
    return this.http.delete(this.path + 'repos/' + owner + '/' + repoName + '/contents/' + screenPath + '?message=' + commitMessage + '&sha=' + sha, this.httpOptions);
  }

  getCommits(repoName, owner, screenPath) {
    return this.http.get(this.path + 'repos/' + owner + '/' + repoName + '/commits?path=' + screenPath);
  }

  getCommit(repoName, owner, sha) {
    return this.http.get(this.path + 'repos/' + owner + '/' + repoName + '/commits/' + sha);
  }

  handleError(error) {
    console.log('Github Data Error. ', error);
    return error;
  }

}
