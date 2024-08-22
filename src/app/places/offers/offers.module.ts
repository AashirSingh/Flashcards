import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { OfferItemComponent } from '/Users/aashirsingh/Documents/testproject3/src/app/places/offers/offer-item/offer-item.component';
import { IonicModule } from '@ionic/angular';

import { OffersPage } from './offers.page';

const routes: Routes = [
  {
    path: '',
    component: OffersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OffersPage, OfferItemComponent]
})
export class OffersPageModule {}
