import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class AppGlobals {

  public projectKey = null;

  private appGlobals: Subject<any> = new Subject<any>();
  public $appGlobals = this.appGlobals.asObservable();

  constructor () {}

  // options = {title: '', showOptions: false, projectKey: $key}
  setAppGlobals (options) {
    this.projectKey = (options.projectKey) ? options.projectKey : null;
    this.appGlobals.next(options);
  }
}
