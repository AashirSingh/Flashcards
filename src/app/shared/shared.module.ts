import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';

@NgModule({
  declarations: [LocationPickerComponent],
  imports: [CommonModule, IonicModule],
  exports: [LocationPickerComponent]
})
export class SharedModule {}
