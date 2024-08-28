import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { DashboardCardComponent } from './dashboard-card/dashboard-card.component';
import { ConfigService } from '/Users/aashirsingh/Documents/testproject3/src/app/config.service';
import { EditCourseComponent } from './edit-course/edit-course.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule
  ],
  providers: [ConfigService],
  declarations: [DashboardPage, DashboardCardComponent, EditCourseComponent], 
})
export class DashboardModule {}