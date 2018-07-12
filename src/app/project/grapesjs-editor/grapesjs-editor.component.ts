import {Component, Input, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectService} from '../../services/project.service';
import {ScreenDataService} from '../../dataservices/screen-data.service';
import {ScreenModel} from '../../datamodels/screen.model';
import {Project} from '../../datamodels/project.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UpdateScreenComponent} from './update-screen/update-screen.component';

declare let grapesjs: any;

@Component({
  selector: 'app-grapesjs-editor',
  templateUrl: './grapesjs-editor.component.html',
  styleUrls: ['./grapesjs-editor.component.css']
})
export class GrapesjsEditorComponent implements OnInit, OnDestroy {
  @Input() htmlData: string;
  @Input() cssData: string;
  @Input() screen: ScreenModel;

  editor: any;
  projectId: string;
  project: Project;
  screenId: string;

  constructor( private toastr: ToastsManager,
               private vcr: ViewContainerRef,
               private router: Router,
               private route: ActivatedRoute,
               private screenDataService: ScreenDataService,
               private projectService: ProjectService,
               private modal: NgbModal) {
    this.toastr.setRootViewContainerRef(vcr);
    this.projectId = this.route.snapshot.params.key;
  }

  ngOnInit() {
    this.editor = grapesjs.init({
      container: '#gjs',
      fromElement: true,
      plugins: ['gjs-preset-webpage', 'grapesjs-style-gradient', 'gjs-blocks-flexbox', 'grapesjs-lory-slider', 'grapesjs-tabs'],
      pluginsOpts: {
        'gjs-blocks-basic': {},
        'gjs-style-gradient': {}
      }
    });
    this.editor.setComponents(this.htmlData);
    this.editor.setStyle(this.cssData);
  }

  ngOnDestroy() {

  }

  saveNewVersion() {
    const newHtmlData = this.editor.getHtml();
    const newCssData = this.editor.getCss();
    this.modal.open(UpdateScreenComponent).result.then(
      (data) => {
        if (data.result === 'success') {
          this.projectService.updateGrapesJSScreen(this.screen.repository, this.screen.repositoryOwner, this.screen, newHtmlData, newCssData, data.message).then(
            (result) => { this.toastr.success('Screen updated.', 'Success!'); },
            (error) => { this.toastr.error('We could not update your screen', 'There was an error'); }
          ).catch((error) => {
            this.toastr.error('We could not update your screen', 'There was an error');
            console.log(error);
          });
        }
      }
    );
  }
}
