export class VersionModel {

  date: string;
  formattedDate: string;
  commitShaHtml: string;
  commitShaCss: string;
  commitShaImage: string;
  contentShaHtml: string;
  contentShaCss: string;
  contentShaImage: string;
  message: string;
  createdBy: string;
  screenId;

  constructor(json) {
    this.date = json.date;
    this.formattedDate = new Date(this.date).toLocaleString('en-EN');
    this.commitShaHtml = (json.commitShaHtml) ? json.commitShaHtml : '';
    this.commitShaCss = (json.commitShaCss) ? json.commitShaCss : '';
    this.commitShaImage = (json.commitShaImage) ? json.commitShaImage : '';
    this.contentShaHtml = (json.contentShaHtml) ? json.contentShaHtml : '';
    this.contentShaCss = (json.contentShaCss) ? json.contentShaCss : '';
    this.contentShaImage = (json.contentShaImage) ? json.contentShaImage : '';
    this.message = (json.message) ? json.message : '';
    this.createdBy = (json.createdBy) ? json.createdBy : '';
    this.screenId = (json.screenId) ? json.screenId : '';
  }
}
