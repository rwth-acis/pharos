import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FileSystemFileEntry, UploadEvent, UploadFile} from 'ngx-file-drop';
import {ProjectService} from '../../services/project.service';
import {ScreenModel} from '../../datamodels/screen.model';

@Component({
  selector: 'app-update-image-screen',
  templateUrl: './update-image-screen.component.html',
  styleUrls: ['./update-image-screen.component.scss']
})
export class UpdateImageScreenComponent implements OnInit {
  @Input() screen: ScreenModel;

  public files: UploadFile[] = [];
  file = null;
  showImgTypeErrorMessage = false;
  message = '';

  constructor(private activeModal: NgbActiveModal,
              private projectService: ProjectService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.projectService.updateImageScreen(this.screen.repository, this.screen.repositoryOwner, this.screen, this.file, this.message).then(
      (result) => {
        this.activeModal.close({result: 'success', screen: result});
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
            const extension = file.name.split('.').pop().toLowerCase();
            if (extension !== this.screen.imageExtension) {
              this.showImgTypeErrorMessage = true;
            } else {
              this.readFile(file);
              this.showImgTypeErrorMessage = false;
            }
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
