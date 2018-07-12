import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';
import {environment} from '../../environments/environment';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database-deprecated';
import {UserModel} from '../datamodels/user.model';
import {AppGlobals} from '../appGlobals';

@Injectable()
export class UserDataService {

  oidcPath = 'https://api.learning-layers.eu/o/oauth2';
  private path = '/users';

  httpOptions;
  token: any;
  signedIn = false;
  userOidc;

  users: FirebaseListObservable<UserModel[]> = null;
  user: FirebaseObjectObservable<UserModel> = null;

  private oidcAuth: Subject<any> = new Subject<any>();
  private isMaintainer: Subject<any> = new Subject<any>();

  public $oidcAuth = this.oidcAuth.asObservable();
  public $isMaintainer = this.isMaintainer.asObservable();

  constructor(private http: HttpClient,
              private db: AngularFireDatabase,
              private appGlobals: AppGlobals) {
    this.appGlobals.isMaintainer = false;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
    };
    this.getUserList().subscribe(
      (result) => {
        const token = localStorage.getItem('oidc_ll');
        const  timestamp = localStorage.getItem('timestamp_oidc_ll');
        const diff = Date.now() - new Date(timestamp).getTime();
        if (token && diff < 3600000) {
          this.token = token;
          this.oidcAuth.next(true);
          this.signedIn = true;
          this.getUserOidc();
        }
      }
    );
  }

  getToken() {
    window.location.href = this.oidcPath + '/authorize?client_id=' + environment.learning_layers.clientId + '&response_type=token';
  }

  receiveToken(token) {
    this.token = token.split('&')[0];
    localStorage.setItem('oidc_ll', this.token);
    localStorage.setItem('timestamp_oidc_ll', new Date().toString());
    this.signedIn = true;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Token':  token
      })
    };
    this.getUserOidc();
  }

  getUserOidc() {
    this.oidcAuth.next(true);
    return this.http.get(this.oidcPath + '/userinfo?access_token=' + this.token).subscribe(
      (user) => {
        this.userOidc = user;
        this.appGlobals.user = this.userOidc;
        if (this.checkIfUserIsMaintiner(user['preferred_username'])) {
          this.appGlobals.isMaintainer = true;
          this.isMaintainer.next(true);
        }
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  public getUserList(query = {}): FirebaseListObservable<UserModel[]> {
    this.users = this.db.list(this.path, query);
    return this.users;
  }

  public getUser(key): FirebaseObjectObservable<UserModel> {
    const itemPath =  `${this.path}/${key}`;
    this.user = this.db.object(itemPath);
    return this.user;
  }

  public checkIfUserIsMaintiner(username) {
    let value = false;
    this.users.forEach(u => {
      for (let i = 0; i < u.length; i++) {
        if (u[i].username === username) {
          value = true;
        }
      }
    });
    return value;
  }

  handleError(error) {
    console.log('Learning Layers Data Error. ', error);
    return error;
  }



}
