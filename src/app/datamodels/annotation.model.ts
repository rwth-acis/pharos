export class AnnotationModel {

  $key: number;
  key: number;
  annotationName: string;
  repository: string;
  screenName: string;
  repositoryOwner: string;
  createdBy: string;
  date: string;
  formattedDate: string;
  upvotes: number;
  downvotes: number;
  voters = [];

  constructor(json) {
    this.key = (json.key) ? json.key : null;
    this.annotationName = json.annotationName;
    this.repository = json.repository;
    this.screenName = json.screenName;
    this.repositoryOwner = json.repositoryOwner;
    this.createdBy = json.createdBy;
    this.date = json.date;
    this.formattedDate = new Date(this.date).toLocaleString('en-EN');
    this.upvotes = (json.upvotes) ? json.upvotes : 0;
    this.downvotes = (json.downvotes) ? json.downvotes : 0;
    this.voters = (json.voters) ? json.voters : [];
  }

}
