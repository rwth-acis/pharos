export class QuestionTestModel {

  $key;
  testName: string
  repoName: string;
  repoOwner: string;
  questions;
  answers;
  date: string;
  formattedDate: string;
  screenName: string;
  imageName; string;
  introduction: string;
  imageExtension: string;
  participants = [];
  link: string;
  participantsCount: number;

  constructor(json) {
    this.testName = json.testName;
    this.repoName = json.repoName;
    this.repoOwner = json.repoOwner;
    this.questions = json.questions;
    this.date = json.date;
    this.formattedDate = new Date(this.date).toLocaleString('en-EN');
    this.screenName = json.screenName;
    this.imageName = json.imageName;
    this.introduction = (json.introduction) ? json.introduction : '';
    this.answers = (this.answers) ? this.answers : [];
    if (this.answers.length === 0) {
      for (let i = 0; i < this.questions.length; i++) {
        this.answers.push([]);
      }
    }
    this.imageExtension = json.imageExtension;
    this.participants = (json.participants) ? json.participants : [];
    this.link = (json.link) ? json.link : '';
    this.participantsCount = (json.participantsCount) ? json.participantsCount : 0;
  }
}
