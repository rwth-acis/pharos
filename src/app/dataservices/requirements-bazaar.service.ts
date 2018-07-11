import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class RequirementsBazaarDataService {

  private rbPath = 'https://requirements-bazaar.org/bazaar';
  httpOptions;
  private projectPath = '/projects';
  token;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('oidc_ll');
    this.httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization':  'Bearer ' + this.token
      })
    };
  }

  createProject(projectName) {
    const params = {};
    return this.http.post(this.rbPath + this.projectPath, params, this.httpOptions);
  }

  getPoject(projectId) {
    return this.http.get(this.rbPath + this.projectPath + '/' + projectId);
  }

  handleError(error) {
    console.log('Requirements Bazaar Data Error. ', error);
    return error;
  }
}
