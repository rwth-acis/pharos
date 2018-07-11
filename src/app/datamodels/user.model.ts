export class UserModel {

  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  type: string;

  constructor(json) {
    this.id = json.id;
    this.username = json.username;
    this.email = json.email;
    this.firstName = json.firstName;
    this.lastName = json.lastName;
    this.type = json.type;
  }

}
