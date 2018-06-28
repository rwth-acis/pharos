export class VersionModel {

  date: string;
  formattedDate: string;
  commitShaHtml: string;
  commitShaCss: string;
  commitShaImage: string;
  message: string;
  createdBy: string;

  constructor(json) {
    this.date = json.date;
    this.formattedDate = new Date(this.date).toLocaleString('en-EN');
    this.commitShaHtml = json.commitShaHtml;
    this.commitShaCss = json.commitShaCss;
    this.commitShaImage = json.commitShaImage;
    this.message = json.message;
    this.createdBy = json.createdBy;
  }
}
