export class Feedback {

  key: any;
  type: string;
  image: any;
  coord: any;
  general: boolean;
  screenId: any;
  message: string;
  projectId: any;
  parentId: any;
  childrenIds: any;
  vote: number;

  constructor(json) {
    this.key = (json.key) ? json.key : null;
    this.type = (json.type) ? json.type : null;
    this.image = (json.image) ? json.image : null;
    this.coord = (json.coord) ? json.coord : null;
    this.general = (json.general) ? json.general : null;
    this.screenId = (json.screenId) ? json.screenId : null;
    this.message = (json.message) ? json.message : '';
    this.projectId = (json.projectId) ? json.projectId : null;
    this.parentId = (json.parentId) ? json.parentId : null;
    this.childrenIds = (json.childrenIds) ? json.childrenIds : null;
    this.vote = (json.vote) ? json.vote : null;
  }
}
