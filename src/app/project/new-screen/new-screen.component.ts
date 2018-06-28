import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ScreenModel} from '../../datamodels/screen.model';
import {FileSystemDirectoryEntry, FileSystemFileEntry, UploadEvent, UploadFile} from 'ngx-file-drop';
import {ProjectService} from '../../services/project.service';

@Component({
  selector: 'app-new-screen',
  templateUrl: './new-screen.component.html',
  styleUrls: ['./new-screen.component.css']
})
export class NewScreenComponent implements OnInit {
  @Input() githubRepoName;
  @Input() githubRepoOwner;

  screen: ScreenModel;
  public files: UploadFile[] = [];
  file;
  showImgTypeErrorMessage = false;

  constructor(private activeModal: NgbActiveModal,
              private projectService: ProjectService) {
    this.screen = new ScreenModel({type: 'image'});
  }

  ngOnInit() {
    this.screen.repository = this.githubRepoName;
    this.screen.repositoryOwner = this.githubRepoOwner;
  }

  onSubmit() {
    if (this.screen.type === 'image') {
      this.projectService.createScreenImage(this.githubRepoName, this.githubRepoOwner, this.screen, this.file, this.screen.description).then(
        (result) => {
          this.activeModal.close({result: 'success', screen: result});
        },
        (error) => {
          console.log(error);
          this.activeModal.close({result: 'error', error: error});
        }
      );
    } else if (this.screen.type === 'grapesjs') {
      this.projectService.createScreenGrapesJS(this.githubRepoName, this.githubRepoOwner, this.screen, '', '', this.screen.description).then(
        (result) => {
          this.activeModal.close({result: 'success', screen: result});
        },
        (error) => {
          console.log(error);
          this.activeModal.close({result: 'error', error: error});
        }
      );
    }
  }

  onCancel() {
    this.activeModal.close({result: 'close'});
  }

  public dropped (event: UploadEvent) {
    const self = this;
    for (const droppedFile of event.files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          // Only accept images
          if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/svg+xml') {
            self.files = event.files;
            this.screen.imageExtension = file.name.split('.').pop();
            this.readFile(file);
            this.showImgTypeErrorMessage = false;
          } else {
            this.showImgTypeErrorMessage = true;
          }
        });
      }
    }
  }

  public fileOver(event) {
    // console.log(event);
  }

  public fileLeave(event) {
    // console.log(event);
  }

  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.file = reader.result.replace(/data:.*?;base64,/g, '');
    };
    reader.readAsDataURL(file);
  }
}
