import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {UserDataService} from './dataservices/user-data.service';
import {UserModel} from './datamodels/user.model';

@Injectable()
export class AppGlobals{

  public projectKey = null;
  public isMaintainer;
  public user: UserModel;
  public token: string;

  private appGlobals: Subject<any> = new Subject<any>();
  public $appGlobals = this.appGlobals.asObservable();

  constructor () {}

  // options = {title: '', showOptions: false, projectKey: $key}
  setAppGlobals (options) {
    this.projectKey = (options.projectKey) ? options.projectKey : null;
    this.appGlobals.next(options);
  }
}
