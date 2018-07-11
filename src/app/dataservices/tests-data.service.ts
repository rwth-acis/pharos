import { Injectable } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database-deprecated';
import {PreferenceTestModel} from '../datamodels/preference-test.model';
import {QuestionTestModel} from '../datamodels/question-test.model';

@Injectable()
export class TestsDataService {

  pathPreferenceTest = '/preference-test';
  pathQuestionTest = '/question-test';

  preferenceTests: FirebaseListObservable<PreferenceTestModel[]> = null;
  preferenceTest: FirebaseObjectObservable<PreferenceTestModel> = null;
  questionTests: FirebaseListObservable<QuestionTestModel[]> = null;
  questionTest: FirebaseObjectObservable<QuestionTestModel> = null;


  constructor(private db: AngularFireDatabase) {
    this.getPreferenceTestsList();
    this.getQuestionTestsList();
  }

  public getPreferenceTestsList (query = {}): FirebaseListObservable<PreferenceTestModel[]> {
    this.preferenceTests = this.db.list(this.pathPreferenceTest, query);
    return this.preferenceTests;
  }

  public getPreferenceTestsByScreenName(screenName) {
    let preferenceTests = [];
    this.preferenceTests.forEach(pt => {
      for (let i = 0; i < pt.length; i++) {
        if (pt[i].screenName === screenName) {
          preferenceTests.push(pt[i]);
        }
      }
    });
    return preferenceTests;
  }

  public getPreferenceTest(key): FirebaseObjectObservable<PreferenceTestModel> {
    const itemPath =  `${this.pathPreferenceTest}/${key}`;
    this.preferenceTest = this.db.object(itemPath);
    return this.preferenceTest;
  }

  public createPreferenceTest (test: PreferenceTestModel) {
    return this.preferenceTests.push(test)
      .then(resolve => {
        return resolve;
      }, error => {
        console.log(error);
        return error;
      });
  }

  public updatePreferenceTest (key, value: PreferenceTestModel) {
    if (!this.preferenceTests) {
      this.getPreferenceTestsList();
    }
    return this.preferenceTests.update(`${key}`, value)
      .then(resolve => {
        console.log('Test updated.');
        return resolve;
      }, error => {
        console.log(error);
      });
  }

  public getQuestionTestsList (query = {}): FirebaseListObservable<QuestionTestModel[]> {
    this.questionTests = this.db.list(this.pathQuestionTest, query);
    return this.questionTests;
  }

  public getQuestionTestsByScreenName(screenName) {
    let questionsTests = [];
    this.questionTests.forEach(qt => {
      for (let i = 0; i < qt.length; i++) {
        if (qt[i].screenName === screenName) {
          questionsTests.push(qt[i]);
        }
      }
    });
    return questionsTests;
  }

  public getQuestionTest(key): FirebaseObjectObservable<QuestionTestModel> {
    const itemPath =  `${this.pathQuestionTest}/${key}`;
    this.questionTest = this.db.object(itemPath);
    return this.questionTest;
  }

  public createQuestionTest (test: QuestionTestModel) {
    return this.questionTests.push(test)
      .then(resolve => {
        return resolve;
      }, error => {
        console.log(error);
        return error;
      });
  }

  public updateQuestionTest (key, value: QuestionTestModel) {
    if (!this.questionTests) {
      this.getQuestionTestsList();
    }
    return this.questionTests.update(`${key}`, value)
      .then(resolve => {
        console.log('Test updated.');
      }, error => {
        console.log(error);
      });
  }

}
