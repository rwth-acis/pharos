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
import {AnnotationsDataService} from './dataservices/annotations-data.service';
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
import { VoteComponent } from './project/vote/vote.component';
import { TestAdminComponent } from './project/test-admin/test-admin.component';
import { TestPreferenceComponent } from './project/test-preference/test-preference.component';
import { TestQuestionComponent } from './project/test-question/test-question.component';
import {TestsDataService} from './dataservices/tests-data.service';
import {TestService} from './services/test.service';
import { TestLinkComponent } from './project/test-link/test-link.component';
import {UserDataService} from './dataservices/user-data.service';
import {CommentDataService} from './dataservices/comment-data.service';
import { LoginComponent } from './login/login.component';
import { LoginGithubComponent } from './login-github/login-github.component';
import {VersionsDataService} from './dataservices/versions-data.service';


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
    UpdateScreenComponent,
    VoteComponent,
    TestAdminComponent,
    TestPreferenceComponent,
    TestQuestionComponent,
    TestLinkComponent,
    LoginComponent,
    LoginGithubComponent
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
    AnnotationsDataService,
    ScreenDataService,
    GithubDataService,
    ProjectService,
    TestsDataService,
    TestService,
    UserDataService,
    CommentDataService,
    VersionsDataService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    NewProjectComponent,
    ConfirmationDialogComponent,
    NewScreenComponent,
    UpdateScreenComponent,
    UpdateImageScreenComponent,
    TestLinkComponent
  ]
})
export class AppModule { }
