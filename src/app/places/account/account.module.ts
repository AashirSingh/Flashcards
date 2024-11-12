import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AccountPageRoutingModule } from './account-routing.module';
import { AccountPage } from './account.page';

import { ProfilePictureComponent } from 'src/app/places/account/profile-picture/profile-picture.component';
import { ProfileListComponent } from 'src/app/places/account/profile-list/profile-list.component';
import { AccountModalContent } from './account-modal/account-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountPageRoutingModule
  ],
  declarations: [
    AccountPage,
    ProfilePictureComponent,
    ProfileListComponent,
    AccountModalContent
  ],
  exports: [
    ProfilePictureComponent,
    ProfileListComponent
  ]
})
export class AccountPageModule {}