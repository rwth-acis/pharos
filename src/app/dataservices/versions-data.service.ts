import { Injectable } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database-deprecated';
import {VersionModel} from '../datamodels/version.model';

@Injectable()
export class VersionsDataService {

  path = 'versions';

  versions: FirebaseListObservable<VersionModel[]>;
  version: FirebaseObjectObservable<VersionModel>;

  constructor(private db: AngularFireDatabase) {
    this.getVersions();
  }

  getVersions(query = {}): FirebaseListObservable<VersionModel[]> {
    this.versions = this.db.list(this.path, query);
    return this.versions;
  }

  getVersionsByScreenId(screenId) {
    let versions = [];
    this.versions.forEach(v => {
      for (let i = 0; i < v.length; i++) {
        if (v[i].screenId === screenId) {
          versions.push(v[i]);
        }
      }
    });
    return versions;
  }

  getVersion(key): FirebaseObjectObservable<VersionModel> {
    const itemPath =  `${this.path}/${key}`;
    this.version = this.db.object(itemPath);
    return this.version;
  }

  createVersion(version: VersionModel) {
    return this.versions.push(version)
      .then(resolve => {
        return resolve;
      }, error => {
        console.log(error);
      });
  }

}
