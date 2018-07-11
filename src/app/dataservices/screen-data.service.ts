import { Injectable } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database-deprecated';
import {ScreenModel} from '../datamodels/screen.model';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class ScreenDataService {


  private path = '/screens';
  html: string;
  css: string;

  screens: FirebaseListObservable<ScreenModel[]> = null;
  screen: FirebaseObjectObservable<ScreenModel> = null;

  private screenData = new Subject();
  $screenData = this.screenData.asObservable();

  constructor(private db: AngularFireDatabase) {
    this.getScreenList();
  }

  public getScreenList (query = {}): FirebaseListObservable<ScreenModel[]> {
    this.screens = this.db.list(this.path, query);
    return this.screens;
  }

  public getScreenListByProjectId(projectId) {
    let screens = [];
    this.screens.forEach(s => {
      for (let i = 0; i < s.length; i++) {
        if (s[i].projectId === projectId) {
          screens.push(s[i]);
        }
      }
    });
    return screens;
  }

  public getScreen (key): FirebaseObjectObservable<ScreenModel> {
    const itemPath =  `${this.path}/${key}`;
    this.screen = this.db.object(itemPath);
    return this.screen;
  }

  public createScreen(screen: ScreenModel) {
    return this.screens.push(screen)
      .then(resolve => {
        console.log('ScreenModel created.', resolve);
        return resolve.key;
      }, error => {
        console.log(error);
      });
  }

  public updateScreen(key, value: any) {
    if (!this.screens) {
      this.getScreenList();
    }
    return this.screens.update(`${key}`, value)
      .then(resolve => {
        console.log('ScreenModel updated.');
        return key;
      }, error => {
        console.log(error);
      });
  }

  public deleteScreen(key) {
    return this.screens.remove(`${key}`)
      .then(resolve => {
        console.log('ScreenModel deleted.');
      }, error => {
        console.log(error);
      });
  }

  setScreenData(html, css) {
    this.html = html;
    this.css = css;
    this.screenData.next({html: html, css: css});
  }

  getScreenData() {
    return {html: this.html, css: this.css};
  }

}
