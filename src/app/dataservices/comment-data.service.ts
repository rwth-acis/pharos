import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserDataService} from './user-data.service';
import {Subscription} from 'rxjs/Subscription';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable()
export class CommentDataService {

  private path = environment.comment_service.service_node;

  oidcAuthSub: Subscription;

  constructor(private http: HttpClient,
              private userDataService: UserDataService) { }

  public createThread() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'text/plain;charset=UTF-8',
        'Content-Type': 'text/plain;charset=UTF-8',
        'Authorization':  'Basic ' + btoa('alice:pwalice'),
        'Response-Type': 'text/plain;charset=UTF-8'
      })
    };
    const params = '{owner: "alice",writer: "alice",reader:"alice"}';
    return this.http.post(this.path + '/commentmanagement/threads', params, httpOptions).toPromise()
      .then(
        (result) => {
          console.log(result);
          return result;
        }
      ).catch( (error) => {
        return error['error']['text'];
      });
  }
}
