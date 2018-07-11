export class PreferenceTestModel  {

  $key;
  testName: string
  repoName: string;
  repoOwner: string;
  votesV1: number;
  votesV2: number;
  date: string;
  formattedDate: string;
  screenName: string;
  imageName1: string;
  imageName2: string;
  introduction: string;
  imageExtension: string;
  participants = [];
  link;

  constructor(json) {
    this.testName = json.testName;
    this.repoName = json.repoName;
    this.repoOwner = json.repoOwner;
    this.votesV1 = (json.votesV1) ? json.votesV1 : 0;
    this.votesV2 = (json.votesV2) ? json.votesV2 : 0;
    this.date = json.date;
    this.formattedDate = new Date(this.date).toLocaleString('en-EN');
    this.screenName = json.screenName;
    this.imageName1 = json.imageName1;
    this.imageName2 = json.imageName2;
    this.introduction = (json.introduction) ? json.introduction : '';
    this.imageExtension = json.imageExtension;
    this.participants = (json.participants) ? json.participants : [];
    this.link = json.link;
    this.link = (json.link) ? json.link : '';
  }
}
