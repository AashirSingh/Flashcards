import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { DashboardCardComponent } from './dashboard-card/dashboard-card.component';
import { ConfigService } from '../config.service';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LogoutComponent } from './logout/logout.component';
import { CreateCourseComponent } from './create-course/create-course.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    ReactiveFormsModule
  ],
  providers: [ConfigService],
  declarations: [DashboardPage, DashboardCardComponent, EditCourseComponent, LogoutComponent, CreateCourseComponent], 
})
export class DashboardModule {}