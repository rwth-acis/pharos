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
import {AnnotationsDataService} from '../dataservices/annotations-data.service';
import {AnnotationModel} from '../datamodels/annotation.model';
import {CommentDataService} from '../dataservices/comment-data.service';
import {VersionsDataService} from '../dataservices/versions-data.service';

@Injectable()
export class ProjectService {

  constructor(private projectDataService: ProjectsDataService,
              private screenDataService: ScreenDataService,
              private githubDataService: GithubDataService,
              private requirementsBazzarDataService: RequirementsBazaarDataService,
              private commentdataService: CommentDataService,
              private annotationsDataService: AnnotationsDataService,
              private versionsDataService: VersionsDataService) { }

  createProject(project: Project) {
    const self = this;
    return Observable.forkJoin([
      this.githubDataService.createOrgRepo(project.name, project.description),
      this.commentdataService.createThread()
    ]).toPromise().then(
      (results) => {
          project.gitHubRepoName = results[0]['name'];
          project.gitHubUrl = results[0]['html_url'];
          project.createdBy = results[0]['owner']['login'];
          project.threadedCommentId = results[1];
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
      self.commentdataService.createThread()
    ]).toPromise().then(
      (result) => {
        screen.gitHubShaDirectory = (result[0]['commit']['parents'][0]) ? result[0]['commit']['parents'][0]['sha'] : '';
        screen.gitHubShaImage = result[0]['content']['sha'];
        screen.gitHubUrl = result[0]['content']['_links']['html'];
        screen.createdBy = result[0]['commit']['author']['name'];
        screen.threadedCommentId = result[1];
        self.screenDataService.createScreen(screen).then(
          (result1) => {
            let version = new VersionModel({
              date: result[0]['commit']['committer']['date'],
              commitShaImage: result[0]['commit']['sha'],
              contentShaImage: result[0]['content']['sha'],
              message: message,
              createdBy: screen.createdBy,
              screenId: result1
            });
            self.versionsDataService.createVersion(version).then(
              (result2) => {
                return result2;
              }
            );
            },
          (error) => { console.log('Error: Could not create screen on the backend. ', error); }
        );
      }
    );
  }

  createScreenGrapesJS(githubRepoName, owner, screen: ScreenModel, html, css, message) {
    const self = this;
    return Observable.forkJoin([
      self.createGrapesJSGithubFiles(githubRepoName, owner, screen, btoa(html), btoa(css), message),
      self.commentdataService.createThread()
    ]).toPromise().then(
      (results) => {
       screen.gitHubShaDirectory = results[0]['directorySha'];
        screen.gitHubShaHtml = results[0]['htmlContentSha'];
        screen.gitHubShaCss = results[0]['cssContentSha'];
        screen.gitHubUrl = results[0]['url'];
        screen.createdBy = results[0]['createdBy'];
        screen.threadedCommentId = results[1];
        self.screenDataService.createScreen(screen).then(
          (result1) => {
            let version = new VersionModel({
              date: results[0]['date'],
              commitShaHtml: results[0]['htmlSha'],
              commitShaCss: results[0]['cssSha'],
              contentShaHtml: screen.gitHubShaHtml,
              contentShaCss: screen.gitHubShaCss,
              message: message,
              createdBy: screen.createdBy,
              screenId: result1
            });
            self.versionsDataService.createVersion(version).then(
              (result2) => {
                return result2;
              }
            );
            return result1;
            },
          (error) => { console.log('Error: Could not create screen on the backend. ', error); }
        );
      }
    );
  }

  createGrapesJSGithubFiles(githubRepoName, owner,  screen: ScreenModel, html, css, message) {
    return this.githubDataService.createFile(githubRepoName, owner, html, screen.name + '/' + screen.name + '.html', message).toPromise().then(
      (htmlFile) => {
        const htmlSha = htmlFile['commit']['sha'];
        const directorySha = (htmlFile['commit']['parents'][0]) ? htmlFile['commit']['parents'][0]['sha'] : '';
        const url = htmlFile['content']['_links']['html'];
        const createdBy = htmlFile['commit']['author']['name'];
        const date = htmlFile['commit']['committer']['date'];
        const htmlContentSha = htmlFile['content']['sha'];
        return this.githubDataService.updateFile(githubRepoName, owner, css, screen.name + '/' + screen.name + '.css', message, screen.gitHubShaDirectory).toPromise().then(
          (cssFile) => {
            const cssSha = cssFile['commit']['sha'];
            const cssContentSha = cssFile['content']['sha'];
            return {directorySha: directorySha, htmlSha: htmlSha, cssSha: cssSha, url: url, createdBy: createdBy, date: date, htmlContentSha: htmlContentSha, cssContentSha: cssContentSha};
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
        screen.gitHubShaHtml = results[0]['htmlContentSha'];
        screen.gitHubShaCss = results[0]['cssContentSha'];
        return this.screenDataService.updateScreen(screen.$key, screen).then(
          (result1) => {
            let version = new VersionModel({
              date: results[0]['date'],
              commitShaHtml: results[0]['htmlSha'],
              commitShaCss: results[0]['cssSha'],
              contentShaHtml: results[0]['htmlContentSha'],
              contentShaCss: results[0]['cssContentSha'],
              message: message,
              createdBy: results[0]['createdBy'],
              screenId: result1
            });
            this.versionsDataService.createVersion(version).then(
              (result2) => {
                return result2;
              }
            );
            return result1;
            },
          (error) => { console.log('Error: Could not update screen on the backend. ', error); }
        );
      }
    );
  }

  updateGrapesJSScreenFiles(githubRepoName, owner, screen: ScreenModel, html, css, message) {
    return this.githubDataService.updateFile(githubRepoName, owner, html, screen.name + '/' + screen.name + '.html', message, screen.gitHubShaHtml).toPromise().then(
      (htmlFile) => {
        const htmlSha = htmlFile['commit']['sha'];
        const directorySha = htmlFile['commit']['parents'][0];
        const createdBy = htmlFile['commit']['author']['name'];
        const date = htmlFile['commit']['committer']['date'];
        const htmlContentSha = htmlFile['content']['sha'];
        return this.githubDataService.updateFile(githubRepoName, owner, css, screen.name + '/' + screen.name + '.css', message, screen.gitHubShaCss).toPromise().then(
          (cssFile) => {
            const cssSha = cssFile['commit']['sha'];
            const cssContentSha = cssFile['content']['sha'];
            return {directorySha: directorySha, htmlSha: htmlSha, cssSha: cssSha, createdBy: createdBy, date: date, htmlContentSha: htmlContentSha, cssContentSha: cssContentSha};
          }
        );
      }
    );
  }

  updateImageScreen(githubRepoName, owner, screen: ScreenModel, image, message) {
    return this.githubDataService.updateFile(githubRepoName, owner, image, screen.name + '/' + screen.name + '.' + screen.imageExtension, message, screen.gitHubShaImage).toPromise().then(
      (imageFile) => {
        screen.gitHubShaImage = imageFile['content']['sha'];
        screen.gitHubShaDirectory = imageFile['commit']['parents'][0];
        return this.screenDataService.updateScreen(screen.$key, screen).then(
          (result1) => {
            let version = new VersionModel({
              date: imageFile['commit']['committer']['date'],
              commitShaImage: imageFile['commit']['sha'],
              contentShaImage: screen.gitHubShaImage,
              message: message,
              createdBy: imageFile['commit']['author']['name'],
              screenId: result1
            });
            this.versionsDataService.createVersion(version).then(
              (result2) => {
                return result2;
              }
            );
            return result1;
          },
          (error) => { console.log('Error: Could not update screen on the backend. ', error); }
        );
      }
    );
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
    return this.githubDataService.getFile(screen.repository, screen.repositoryOwner, screen.name + '/' + screen.name + '.' + screen.imageExtension, version.commitShaImage).toPromise().then(
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
          return this.annotationsDataService.saveAnnotation(annotation).then(
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
