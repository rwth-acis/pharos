export class User {

  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  projects: any;

  constructor(json) {
    this.id = json.id;
    this.username = json.username;
    this.email = json.email;
    this.firstName = json.firstName;
    this.lastName = json.lastName;
    this.status = json.status;
    this.projects = json.projects;
  }

}
