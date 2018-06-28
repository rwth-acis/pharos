import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import {ProjectsDataService} from './dataservices/projects-data.service';
import { ProjectsComponent } from './projects/projects.component';
import { AppRoutingModule } from './/app-routing.module';
import { ProjectComponent } from './project/project.component';
import { NewProjectComponent } from './projects/new-project/new-project.component';
import {FormsModule} from '@angular/forms';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ConfirmationDialogComponent } from './utils/confirmation-dialog/confirmation-dialog.component';
import {AppGlobals} from './appGlobals';
import { RequirementsComponent } from './project/requirements/requirements.component';
import {RequirementsBazaarDataService} from './dataservices/requirements-bazaar.service';
import { FeedbackComponent } from './project/feedback/feedback.component';
import {FeedbackDataService} from './dataservices/feedback-data.service';
import {PolymerModule} from '@codebakery/origami';
import { GrapesjsEditorComponent } from './project/grapesjs-editor/grapesjs-editor.component';
import { NewScreenComponent } from './project/new-screen/new-screen.component';
import {ScreenDataService} from './dataservices/screen-data.service';
import { ScreenComponent } from './project/screen/screen.component';
import {FileDropModule} from 'ngx-file-drop';
import {GithubDataService} from './dataservices/github-data.service';
import {ProjectService} from './services/project.service';
import { UpdateImageScreenComponent } from './project/update-image-screen/update-image-screen.component';
import { UpdateScreenComponent } from './project/grapesjs-editor/update-screen/update-screen.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProjectsComponent,
    ProjectComponent,
    NewProjectComponent,
    ConfirmationDialogComponent,
    RequirementsComponent,
    FeedbackComponent,
    GrapesjsEditorComponent,
    NewScreenComponent,
    ScreenComponent,
    UpdateImageScreenComponent,
    UpdateScreenComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpClientModule,
    AppRoutingModule,
    ToastModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    PolymerModule.forRoot(),
    FileDropModule
  ],
  providers: [
    AppGlobals,
    ProjectsDataService,
    RequirementsBazaarDataService,
    FeedbackDataService,
    ScreenDataService,
    GithubDataService,
    ProjectService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    NewProjectComponent,
    ConfirmationDialogComponent,
    NewScreenComponent,
    UpdateScreenComponent,
    UpdateImageScreenComponent
  ]
})
export class AppModule { }
