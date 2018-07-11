import { Injectable } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database-deprecated';
import {AnnotationModel} from '../datamodels/annotation.model';

@Injectable()
export class AnnotationsDataService {

  private path = '/annotations';

  annotations: FirebaseListObservable<AnnotationModel[]> = null;
  annotation: FirebaseObjectObservable<AnnotationModel> = null;

  constructor(private db: AngularFireDatabase) {
    this.getAnnotations();
  }

  public getAnnotations(query = {}): FirebaseListObservable<AnnotationModel[]> {
    this.annotations = this.db.list(this.path, query);
    return this.annotations;
  }

  public getAnnotationsByScreenName(screenName) {
    let annotations = [];
    this.annotations.forEach(a => {
      for (let i = 0; i < a.length; i++) {
        if (a[i].screenName === screenName) {
          annotations.push(a[i]);
        }
      }
    });
    return annotations;
  }

  public saveAnnotation(annotation: AnnotationModel) {
    return this.annotations.push(annotation)
      .then(resolve => {
        console.log('Annotation saved.', resolve);
      }, error => {
        console.log(error);
      });
  }

  public getAnnotation(key): FirebaseObjectObservable<AnnotationModel> {
    const itemPath =  `${this.path}/${key}`;
    this.annotation = this.db.object(itemPath);
    return this.annotation;
  }

  public updateAnnotation(key, value: any) {
    if (!this.annotations) {
      this.getAnnotations();
    }
    return this.annotations.update(`${key}`, value)
      .then(resolve => {
        console.log('Annotation updated.');
      }, error => {
        console.log(error);
      });
  }
}
