export class RequirementsBazaarModel {

  id: number;
  name: string;
  categories: any;
  requirements: any;

  constructor(json) {
    this.id = json.id;
    this.name = json.name;
    this.categories = json.categories;
    this.requirements = json.requirements;
  }
}
