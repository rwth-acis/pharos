export class Project {

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
  maintainers: any;
  codesigners: any;
  voters: any;
  feedback: any;
  instructions: any;
  subtitle: string;
  requirementsBazzarProjectId: any;
  threadedCommentId: any;
  gitHubRepoName: any;
  commentThreadsIds = [];
  gitHubUrl: string;

  constructor(json) {
    this.key = (json.id) ? json.$key : null;
    this.name = (json.name) ? json.name : null;
    this.createdBy = (json.createdBy) ? json.createdBy : null;
    this.creationDate = (json.creationDate) ? json.creationDate : null;
    this.description = (json.description) ? json.description : null;
    this.image = (json.image) ? json.image : null;
    this.lastModified = (json.lastModified) ? json.lastModified : null;
    this.currentVersion = (json.currentVersion) ? json.currentVersion : null;
    this.numberVersions = (json.numberVersions) ? json.numberVersions : null;
    this.repository = (json.repository) ? json.repository : null;
    this.maintainers = (json.maintainers) ? json.maintainers : null;
    this.codesigners = (json.codesigners) ? json.codesigners : null;
    this.voters = (json.voters) ? json.voters : null;
    this.feedback = (json.feedback) ? json.feedback : null;
    this.instructions = (json.instructions) ? json.instructions : null;
    this.subtitle = (json.subtitle) ? json.subtitle : null;
    this.requirementsBazzarProjectId = (json.requirementsBazzarProjectId) ? json.requirementsBazzarProjectId : null;
    this.threadedCommentId = (json.threadedCommentId) ? json.threadedCommentId : null;
    this.gitHubRepoName = (json.gitHubRepoName) ? json.gitHubRepoName : null;
    this.commentThreadsIds = (json.commentThreadsIds) ? json.commentThreadsIds : [];
    this.gitHubUrl = (json.gitHubUrl) ? json.gitHubUrl : null;
  }

}
