import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseTopicsPage } from './course-topics.page';

const routes: Routes = [
  {
    path: '',
    component: CourseTopicsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseTopicsPageRoutingModule {}
