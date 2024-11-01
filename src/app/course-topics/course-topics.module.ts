import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CourseTopicsPageRoutingModule } from './course-topics-routing.module';
import { CourseTopicsPage } from './course-topics.page';
import { OptionsModalComponent } from './options-modal/options-modal.component'; // Import the modal component

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CourseTopicsPageRoutingModule
  ],
  declarations: [
    CourseTopicsPage,
    OptionsModalComponent  // Declare the modal component
  ],
  
})
export class CourseTopicsPageModule {}
