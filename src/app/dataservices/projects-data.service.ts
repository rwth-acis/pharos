import { Injectable } from '@angular/core';
import {Project} from '../datamodels/project.model';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database-deprecated';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppGlobals} from '../appGlobals';

@Injectable()
export class ProjectsDataService {

  private path = '/projects';

  projects: FirebaseListObservable<Project[]> = null;
  project: FirebaseObjectObservable<Project> = null;

  constructor(private db: AngularFireDatabase,
              private http: HttpClient) { }

  public getProjectList (query = {}): FirebaseListObservable<Project[]> {
    this.projects = this.db.list(this.path, query);
    return this.projects;
  }

  public getProject (key): FirebaseObjectObservable<Project> {
    const itemPath =  `${this.path}/${key}`;
    this.project = this.db.object(itemPath);
    return this.project;
  }

  public createProject(project: Project) {
    return this.projects.push(project)
      .then(resolve => {
        return resolve;
      }, error => {
        console.log(error);
      });
  }

  public updateProject(key, value: any) {
    return this.projects.update(`${key}`, value)
      .then(resolve => {
        console.log('Project updated.');
      }, error => {
        console.log(error);
      });
  }

  public deleteProject(key) {
    return this.projects.remove(`${key}`)
      .then(resolve => {
        console.log('Project deleted.');
      }, error => {
        console.log(error);
      });
  }
}
