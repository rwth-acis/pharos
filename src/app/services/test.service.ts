import { Injectable } from '@angular/core';
import {TestsDataService} from '../dataservices/tests-data.service';
import {GithubDataService} from '../dataservices/github-data.service';
import {PreferenceTestModel} from '../datamodels/preference-test.model';
import {ScreenDataService} from '../dataservices/screen-data.service';
import {QuestionTestModel} from '../datamodels/question-test.model';

@Injectable()
export class TestService {

  constructor(private testsDataService: TestsDataService,
              private githubDataService: GithubDataService,
              private screenDataService: ScreenDataService) { }

  getImageContent(repoName, repoOwner, screenName, testName, imageName ) {
    return this.githubDataService.getFile(repoName, repoOwner, screenName + '/' + testName + '/' + imageName).toPromise().then(
      (result) => {
        return {
          content: result['content']
        };
      }
    );
  }

  createPrefrenceTest(screen, image1, image2, introduction) {
    const testNumber = screen.testsCount + 1;
    return this.githubDataService.createFile(screen.repository, screen.repositoryOwner, image1, screen.name + '/test' + testNumber + '/option1.' + screen.imageExtension, '').toPromise().then(
      (testFile) => {
        return this.githubDataService.createFile(screen.repository, screen.repositoryOwner, image2, screen.name + '/test' + testNumber + '/option2.' + screen.imageExtension, '').toPromise().then(
          (testFile2) => {
            const test = new PreferenceTestModel({
              testName: 'test' + testNumber,
              repoName: screen.repository,
              repoOwner: screen.repositoryOwner,
              date: testFile['commit']['author']['date'],
              screenName: screen.name,
              imageName1: 'option1.png',
              imageName2: 'option2.png',
              introduction: introduction,
              imageExtension: screen.imageExtension
            });
            return this.testsDataService.createPreferenceTest(test).then(
              (result) => {
                screen.testsCount++;
                this.screenDataService.updateScreen(screen.$key, screen).then(
                  (resultUpdate) => { return resultUpdate; },
                  (errorUpdate) => { console.log('Error: Could not update screen on the backend. ', errorUpdate); }
                );
                return result.key;
              },
              (error) => { console.log('Error: Could not save your test on the backend. ', error); }
            );
          }
        );
      }
    );
  }

  createQuestionTest(screen, image, introduction, questions) {
    const testNumber = screen.testsCount + 1;
    return this.githubDataService.createFile(screen.repository, screen.repositoryOwner, image, screen.name + '/test' + testNumber + '/image.' + screen.imageExtension, '').toPromise().then(
      (testFile) => {
        const test = new QuestionTestModel({
          testName: 'test' + testNumber,
          repoName: screen.repository,
          repoOwner: screen.repositoryOwner,
          date: testFile['commit']['author']['date'],
          screenName: screen.name,
          imageName: 'image.png',
          introduction: introduction,
          questions: questions,
          imageExtension: screen.imageExtension
        });
        return this.testsDataService.createQuestionTest(test).then(
          (result) => {
            screen.testsCount++;
            this.screenDataService.updateScreen(screen.$key, screen).then(
              (resultUpdate) => { return resultUpdate; },
              (errorUpdate) => { console.log('Error: Could not update screen on the backend. ', errorUpdate); }
            );
            return result.key;
          },
          (error) => { console.log('Error: Could not save your test on the backend. ', error); }
        );
      }
    );
  }
}
