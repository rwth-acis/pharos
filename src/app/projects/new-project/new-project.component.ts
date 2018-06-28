import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Project} from '../../datamodels/project.model';
import {ProjectService} from '../../services/project.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent implements OnInit {

  project: Project;

  constructor(private activeModal: NgbActiveModal,
              private projectService: ProjectService) {
    this.project = new Project({});
  }

  ngOnInit() {}

  onSubmit() {
    this.projectService.createProject(this.project).then(
      (result) => {
        this.activeModal.close({result: 'success', project: result});
        },
      (error) => {
        console.log(error);
        this.activeModal.close({result: 'error', error: error});
      }
    );
  }

  onCancel() {
    this.activeModal.close({result: 'close'});
  }
}
