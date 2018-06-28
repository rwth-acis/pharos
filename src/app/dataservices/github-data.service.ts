import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class GithubDataService {

  private path = 'https://api.github.com/';
  private header: any;

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
  }

  getCode() {
    window.location.href = 'https://github.com/login/oauth/authorize?client_id=' + environment.github.clientId + '&scope=repo%20delete_repo';
  }

  getToken(code) {
    const params = {
      client_id: environment.github.clientId,
      client_secret: environment.github.clientSecret,
      code: code
    }
    this.http.post('https://github.com/login/oauth/access_token', params, this.httpOptions).subscribe(
      (token) => {
        if (token['access_token']) {
          this.token = token;
          this.httpOptions = {
            headers: new HttpHeaders({
              'Access-Control-Allow-Origin': '*',
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'token ' + token['access_token'],
              'tokenType': token['token_type'],

            })
          };
          this.getUser();
          this.signedIn = true;
          this.githubAuth.next(true);
        } else {
          console.log('Could not sign in with GitHub.', token);
        }
        },
      (error) => { this.handleError(error); }
    );
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
