import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ProjectsComponent} from './projects/projects.component';
import {ProjectComponent} from './project/project.component';
import {RequirementsComponent} from './project/requirements/requirements.component';
import {FeedbackComponent} from './project/feedback/feedback.component';
import {ScreenComponent} from './project/screen/screen.component';
import {TestPreferenceComponent} from './project/test-preference/test-preference.component';
import {TestQuestionComponent} from './project/test-question/test-question.component';
import {LoginComponent} from './login/login.component';
import {LoginGithubComponent} from './login-github/login-github.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'projects', component: ProjectsComponent},
  {path: 'projects/:key', component: ProjectComponent},
  {path: 'projects/:key/requirements', component: RequirementsComponent},
  {path: 'projects/:key/feedback', component: FeedbackComponent},
  {path: 'projects/:key/test', component: ProjectComponent},
  {path: 'projects/:key/screens/:screen_key', component: ScreenComponent},
  {path: 'preference-test/:key', component: TestPreferenceComponent},
  {path: 'question-test/:key', component: TestQuestionComponent},
  {path: 'login', component: LoginComponent},
  {path: 'login-github', component: LoginGithubComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule {}
