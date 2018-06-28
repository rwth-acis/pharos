import { Injectable } from '@angular/core';
import {GithubDataService} from '../dataservices/github-data.service';
import {RequirementsBazaarDataService} from '../dataservices/requirements-bazaar.service';
import {Project} from '../datamodels/project.model';
import {ProjectsDataService} from '../dataservices/projects-data.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import {ScreenModel} from '../datamodels/screen.model';
import {ScreenDataService} from '../dataservices/screen-data.service';
import {VersionModel} from '../datamodels/version.model';
import {FeedbackDataService} from '../dataservices/feedback-data.service';
import {AnnotationModel} from '../datamodels/annotation.model';

@Injectable()
export class ProjectService {

  constructor(private projectDataService: ProjectsDataService,
              private screenDataService: ScreenDataService,
              private githubDataService: GithubDataService,
              private requirementsBazzarDataService: RequirementsBazaarDataService,
              /*private threadedCommentdataService: ThreadedCommentDataService,*/
              private feedbackDataService: FeedbackDataService) { }

  createProject(project: Project) {
    const self = this;
    return Observable.forkJoin([
      this.githubDataService.createRepo(project.name, project.description),
      // TODO: create RB project
      // TODO: create thread comment
    ]).toPromise().then(
      (results) => {
          project.gitHubRepoName = results[0]['name'];
          project.gitHubUrl = results[0]['html_url'];
          project.createdBy = results[0]['owner']['login'];
          return self.projectDataService.createProject(project).then(
            (result) => { return result; },
            (error) => { console.log('Error: Could not create project on the backend. ', error); }
          );
        }
      );
  }

  deleteProject(project: Project) {
    const self = this;
    return Observable.forkJoin([
      self.githubDataService.deleteRepo(project.gitHubRepoName, project.createdBy),
      // TODO: delete RB project
      // TODO: delete thread comment
      // TODO: delete comment threads
      // TODO: delete all related screen entries on backend
    ]).toPromise().then(
      (results) => {
        return self.projectDataService.deleteProject(project.$key).then(
          (result) => { return result; },
          (error) => { console.log('Error: Could not delete project on the backend. ', error); }
        );
      }
    );
  }

  createScreenImage(githubRepoName, owner, screen: ScreenModel, image, message) {
    const self = this;
    return Observable.forkJoin([
      self.githubDataService.createFile(githubRepoName, owner, image, screen.name + '/' + screen.name + '.' + screen.imageExtension, message),
      // TODO: create comment thread
    ]).toPromise().then(
      (result) => {
        screen.gitHubShaDirectory = (result[0]['commit']['parents'][0]) ? result[0]['commit']['parents'][0]['sha'] : '';
        screen.gitHubShaImage = result[0]['content']['sha'];
        self.screenDataService.createScreen(screen).then(
          (result) => { return result; },
          (error) => { console.log('Error: Could not create screen on the backend. ', error); }
        );
      }
    );
  }

  createScreenGrapesJS(githubRepoName, owner, screen: ScreenModel, html, css, message) {
    const self = this;
    return Observable.forkJoin([
      self.createGrapesJSGithubFiles(githubRepoName, owner, screen, btoa(html), btoa(css), message),
      // TODO: create comment thread
    ]).toPromise().then(
      (results) => {
       screen.gitHubShaDirectory = results[0]['directorySha'];
        screen.gitHubShaHtml = results[0]['htmlSha'];
        screen.gitHubShaCss = results[0]['cssSha'];
        self.screenDataService.createScreen(screen).then(
          (result) => { return result; },
          (error) => { console.log('Error: Could not create screen on the backend. ', error); }
        );
      }
    );
  }

  createGrapesJSGithubFiles(githubRepoName, owner,  screen: ScreenModel, html, css, message) {
    return this.githubDataService.createFile(githubRepoName, owner, html, screen.name + '/' + screen.name + '.html', message).toPromise().then(
      (htmlFile) => {
        const htmlSha = htmlFile['content']['sha'];
        const directorySha = (htmlFile['commit']['parents'][0]) ? htmlFile['commit']['parents'][0]['sha'] : '';
        return this.githubDataService.updateFile(githubRepoName, owner, css, screen.name + '/' + screen.name + '.css', message, screen.gitHubShaDirectory).toPromise().then(
          (cssFile) => {
            const cssSha = cssFile['content']['sha'];
            return {directorySha: directorySha, htmlSha: htmlSha, cssSha: cssSha};
          }
        );
      },
      (error) => { console.log('Error: Could not create html on GitHub. ', error); }
    );
  }

  deleteScreenImage(githubRepoName, owner, screen: ScreenModel) {
    const self = this;
    return Observable.forkJoin([
      self.githubDataService.deleteFile(githubRepoName, owner, screen.name + '/' + screen.name + '.' + screen.imageExtension, 'Deleting Screen.', screen.gitHubShaImage),
      // TODO: delete comment threads
    ]).toPromise().then(
      (results) => {
        return self.screenDataService.deleteScreen(screen.$key).then(
          (result) => { return result; },
          (error) => { console.log('Error: Could not delete screen on the backend. ', error); }
        );
      }
    );
  }

  deleteScreenGrapesJS(githubRepoName, screen: ScreenModel) {
    const self = this;
    return Observable.forkJoin([
      self.deleteGrapesJSGitHubFiles(githubRepoName, screen.repositoryOwner, screen, 'Deleting Screen.'),
      // TODO: delete comment threads
    ]).toPromise().then(
      (results) => {
        return self.screenDataService.deleteScreen(screen.$key).then(
          (result) => { return result; },
          (error) => { console.log('Error: Could not delete screen on the backend. ', error); }
        );
      }
    );
  }

  deleteGrapesJSGitHubFiles(githubRepoName, owner, screen: ScreenModel, message) {
    return this.githubDataService.deleteFile(githubRepoName, owner, screen.name + '/' + screen.name + '.html', message, screen.gitHubShaHtml).toPromise().then(
      (htmlResult) => {
        return this.githubDataService.deleteFile(githubRepoName, owner, screen.name + '/' + screen.name + '.css', message, screen.gitHubShaCss).toPromise();
      }
    );
  }

  updateGrapesJSScreen(githubRepoName, owner, screen: ScreenModel, html, css, message) {
    return Observable.forkJoin([
      this.updateGrapesJSScreenFiles(githubRepoName, owner, screen, btoa(html), btoa(css), message),
    ]).toPromise().then(
      (results) => {
        screen.gitHubShaDirectory = results[0]['directorySha'];
        screen.gitHubShaHtml = results[0]['htmlSha'];
        screen.gitHubShaCss = results[0]['cssSha'];
        return this.screenDataService.updateScreen(screen.$key, screen).then(
          (result) => { return result; },
          (error) => { console.log('Error: Could not update screen on the backend. ', error); }
        );
      }
    );
  }

  updateGrapesJSScreenFiles(githubRepoName, owner, screen: ScreenModel, html, css, message) {
    return this.githubDataService.updateFile(githubRepoName, owner, html, screen.name + '/' + screen.name + '.html', message, screen.gitHubShaHtml).toPromise().then(
      (htmlFile) => {
        const htmlSha = htmlFile['content']['sha'];
        const directorySha = htmlFile['commit']['parents'][0];
        return this.githubDataService.updateFile(githubRepoName, owner, css, screen.name + '/' + screen.name + '.css', message, screen.gitHubShaCss).toPromise().then(
          (cssFile) => {
            const cssSha = cssFile['content']['sha'];
            return {directorySha: directorySha, htmlSha: htmlSha, cssSha: cssSha};
          }
        );
      }
    );
  }

  updateImageScreen(githubRepoName, owner, screen: ScreenModel, image, message) {
    // TODO: check image extension has been updated
    return this.githubDataService.updateFile(githubRepoName, owner, image, screen.name + '/' + screen.name + '.' + screen.imageExtension, message, screen.gitHubShaImage).toPromise().then(
      (imageFile) => {
        screen.gitHubShaImage = imageFile['content']['sha'];
        screen.gitHubShaDirectory = imageFile['commit']['parents'][0];
        return this.screenDataService.updateScreen(screen.$key, screen).then(
          (result) => { return result; },
          (error) => { console.log('Error: Could not update screen on the backend. ', error); }
        );
      }
    );
  }

  getScreenVersions(screen) {
    let versions: Array<VersionModel> = [];
    if (screen.type === 'grapesjs') {
      return this.githubDataService.getCommits(screen.repository, screen.repositoryOwner,  screen.name + '/' + screen.name + '.html').toPromise().then(
        (resultHtml) => {
          const htmlArray = Object.values(resultHtml);
          for (let i = 0; i < htmlArray.length; i++) {
            versions.push(new VersionModel({
              date: htmlArray[i]['commit']['committer']['date'],
              commitShaHtml: htmlArray[i]['sha'],
              message: htmlArray[i]['commit']['message'],
              createdBy: htmlArray[i]['commit']['author']['name']
            }));
          }
          return this.githubDataService.getCommits(screen.repository, screen.repositoryOwner, screen.name + '/' + screen.name + '.css').toPromise().then(
            (resultCss) => {
              const cssArray = Object.values(resultCss);
              for (let i = 0; i < cssArray.length; i++) {
                versions[i].commitShaCss = cssArray[i]['sha'];
              }
              return versions;
            }
          );
        }
      );
    } else if (screen.type === 'image') {
      return this.githubDataService.getCommits(screen.repository, screen.repositoryOwner, screen.name + '/' + screen.name + '.' + screen.imageExtension).toPromise().then(
        (resultImage) => {
          const imageArray = Object.values(resultImage);
          for (let i = 0; i < imageArray.length; i++) {
            versions.push(new VersionModel({
              date: imageArray[i]['commit']['committer']['date'],
              commitShaImage: imageArray[i]['sha'],
              message: imageArray[i]['commit']['message'],
              createdBy: imageArray[i]['commit']['author']['name']
            }));
          }
          return versions;
        }
      );
    }
  }

  getVersionGrapesJs(screen, version) {
    return this.githubDataService.getFile(screen.repository, screen.repositoryOwner, screen.name + '/' + screen.name + '.html', version.commitShaHtml).toPromise().then(
      (resultHtml) => {
        return this.githubDataService.getFile(screen.repository, screen.repositoryOwner, screen.name + '/' + screen.name + '.css', version.commitShaCss).toPromise().then(
          (resultCss) => {
            return {
              html: atob(resultHtml['content']),
              css: atob(resultCss['content'])
            };
          }
        );
      }
    );
  }

  getVersionImage(screen, version) {
    return this.githubDataService.getFile(screen.repository, screen.repositoryOwner, screen.name + '/' + screen.name + '.' + screen.imageExtension, version.commitShaHtml).toPromise().then(
      (result) => {
        return {
          image: result['content']
        };
      }
    );
  }

  saveAnnotation(screen, image) {
    const annotationNumber = screen.annotationsCount + 1;
    return this.githubDataService.createFile(screen.repository, screen.repositoryOwner, image, screen.name + '/annotations/annotation' + annotationNumber + '.png', '').toPromise().then(
      (annotationFile) => {
          const annotation = new AnnotationModel({
            annotationName: 'annotation' + annotationNumber,
            repository: screen.repository,
            screenName: screen.name,
            repositoryOwner: screen.repositoryOwner,
            createdBy: annotationFile['commit']['author']['name'],
            date: annotationFile['commit']['author']['date']
          });
          return this.feedbackDataService.saveAnnotation(annotation).then(
            (result) => {
              console.log('screen', screen, result);
              screen.annotationsCount++;
              this.screenDataService.updateScreen(screen.$key, screen).then(
                (resultUpdate) => { return resultUpdate; },
                (errorUpdate) => { console.log('Error: Could not update screen on the backend. ', errorUpdate); }
              );
              return result;
              },
            (error) => { console.log('Error: Could not save annotation on the backend. ', error); }
          );
      }
    );
  }
}
