import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ProjectsComponent} from './projects/projects.component';
import {ProjectComponent} from './project/project.component';
import {RequirementsComponent} from './project/requirements/requirements.component';
import {FeedbackComponent} from './project/feedback/feedback.component';
import {ScreenComponent} from './project/screen/screen.component';

const routes: Routes = [
  {path: '', redirectTo: 'projects', pathMatch: 'full'},
  {path: 'projects', component: ProjectsComponent},
  {path: 'projects/:key', component: ProjectComponent},
  {path: 'projects/:key/requirements', component: RequirementsComponent},
  {path: 'projects/:key/feedback', component: FeedbackComponent},
  {path: 'projects/:key/test', component: ProjectComponent},
  {path: 'projects/:key/screens/:screen_key', component: ScreenComponent}
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
