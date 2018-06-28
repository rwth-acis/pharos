import { Injectable } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';
import {Feedback} from '../datamodels/feedback.model';
import {AnnotationModel} from '../datamodels/annotation.model';

@Injectable()
export class FeedbackDataService {

  private path = '/feedback';
  private pathAnnotation = '/annotations';

  projectFeedback: FirebaseListObservable<Feedback[]> = null;
  projectAnnotations: FirebaseListObservable<AnnotationModel[]> = null;

  constructor(private db: AngularFireDatabase) { }

  public getFeedback(query = {}): FirebaseListObservable<Feedback[]> {
    this.projectFeedback = this.db.list(this.path, query);
    return this.projectFeedback;
  }

  public saveFeedback(feedback: Feedback) {
    return this.projectFeedback.push(feedback)
      .then(resolve => {
      console.log('Feedback saved.', resolve);
    }, error => {
      console.log(error);
    });
  }

  public deleteFeedback(key) {
    return this.projectFeedback.remove(`${key}`)
      .then(resolve => {
        console.log('Feedback deleted.');
      }, error => {
        console.log(error);
      });
  }

  public getAnnotations(query = {}): FirebaseListObservable<AnnotationModel[]> {
    this.projectAnnotations = this.db.list(this.pathAnnotation, query);
    return this.projectAnnotations;
  }

  public saveAnnotation(annotation: AnnotationModel) {
    return this.projectAnnotations.push(annotation)
      .then(resolve => {
        console.log('Annotation saved.', resolve);
      }, error => {
        console.log(error);
      });
  }
}
