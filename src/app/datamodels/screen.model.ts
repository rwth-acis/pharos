export class ScreenModel {

  $key: number;
  key: number;
  name: string;
  createdBy: any;
  creationDate: string;
  description: string;
  image: string;
  lastModified: string;
  currentVersion: string;
  numberVersions: number;
  repository: string;
  repositoryOwner: string;
  feedback: any;
  instructions: any;
  type: string;
  threadedCommentId: any;
  gitHubDirectoryName: any;
  commentThreadsIds = [];
  gitHubUrl: string;
  gitHubShaDirectory: string;
  gitHubShaHtml: string;
  gitHubShaCss: string;
  gitHubShaImage: string;
  imageExtension: string;
  annotationsCount: number;

  constructor(json) {
    this.key = (json.id) ? json.$key : null;
    this.name = (json.name) ? json.name : null;
    this.createdBy = (json.createdBy) ? json.createdBy : null;
    this.creationDate = (json.creationDate) ? json.creationDate : null;
    this.description = (json.description) ? json.description : '';
    this.image = (json.image) ? json.image : null;
    this.lastModified = (json.lastModified) ? json.lastModified : null;
    this.currentVersion = (json.currentVersion) ? json.currentVersion : null;
    this.numberVersions = (json.numberVersions) ? json.numberVersions : null;
    this.repository = (json.repository) ? json.repository : null;
    this.repositoryOwner = (json.repositoryOwner) ? json.repositoryOwner : null;
    this.feedback = (json.feedback) ? json.feedback : null;
    this.instructions = (json.instructions) ? json.instructions : null;
    this.type = (json.type) ? json.type : null;
    this.threadedCommentId = (json.threadedCommentId) ? json.threadedCommentId : null;
    this.gitHubDirectoryName = (json.gitHubDirectoryName) ? json.gitHubDirectoryName : null;
    this.commentThreadsIds = (json.commentThreadsIds) ? json.commentThreadsIds : [];
    this.gitHubUrl = (json.gitHubUrl) ? json.gitHubUrl : null;
    this.gitHubShaDirectory = (json.gitHubShaDirectory) ? json.gitHubShaDirectory : null;
    this.gitHubShaHtml = (json.gitHubShaHtml) ? json.gitHubShaHtml : null;
    this.gitHubShaCss = (json.gitHubShaCss) ? json.gitHubShaCss : null;
    this.gitHubShaImage = (json.gitHubShaImage) ? json.gitHubShaImage : null;
    this.imageExtension = (json.imageExtension) ? json.imageExtension : '';
    this.annotationsCount = (json.annotationsCount) ? json.annotationsCount : 0;
  }

}
