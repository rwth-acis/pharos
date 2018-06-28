import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class RequirementsBazaarDataService {

  private rbPath = 'https://requirements-bazaar.org/bazaar';
  private projectPath = '/projects';
  private categoriesPath = '/categories';
  private requirementsPath = '/requirements';
  private commentsPath = '/comments';
  private votesPath = '/votes';

  constructor(private http: HttpClient) { }

  createProject() {}

  getPoject(projectId) {
    return this.http.get(this.rbPath + this.projectPath + '/' + projectId);
  }

  getCategories(projectId) {
    return this.http.get(this.rbPath + this.projectPath + '/' + projectId + this.categoriesPath);
  }

  addCategory(projectId) {}

  updateCategory(categoryId) {}

  deleteCategory(categoryId) {}

  getRequirements(categoryId) {
    return this.http.get(this.rbPath + this.categoriesPath + '/' + categoryId + this.requirementsPath);
  }

  addRequirement(projectId) {}

  updateRequirement(requirementId) {}

  deleteRequirement(requirementId) {}

  getComments(requirementId) {
    return this.http.get(this.rbPath + this.requirementsPath + '/' + requirementId + this.commentsPath);
  }

  addComment(requirementId) {}

  getVotes(requirementId) {
    return this.http.get(this.rbPath + this.requirementsPath + '/' + requirementId + this.votesPath);
  }

  addVote(requirementId) {}
}
