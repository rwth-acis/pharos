import { Component, OnInit } from '@angular/core';
import {RequirementsBazaarDataService} from '../../dataservices/requirements-bazaar.service';

import '../../../../bower_components/reqbaz-project-widget/reqbaz-project-widget.html';



@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css']
})
export class RequirementsComponent implements OnInit {

  rbProject;
  selectedCategory = null;
  catRequirements = null;
  authToken = null;

  constructor(private rbDataService: RequirementsBazaarDataService) {
    // TODO: get auth token
  }

  ngOnInit() {
    this.rbDataService.getPoject(370).subscribe(
      (result) => {
        this.rbProject = result;
        console.log(this.rbProject);
        this.rbDataService.getCategories(370).subscribe(
          (result2) => {
            this.rbProject.categories = result2;
            console.log(this.rbProject.categories);
          }
        );
      }
      );

  }

  selectCategory(cat) {
    this.selectedCategory = cat;
    this.rbDataService.getRequirements(this.selectedCategory.id).subscribe(
      (result) => {
        this.catRequirements = result;
      }
    );
  }

}
