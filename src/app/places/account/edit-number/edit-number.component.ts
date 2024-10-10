import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AccountService } from '../account.service'; // Import the service

@Component({
  selector: 'app-edit-number',
  templateUrl: './edit-number.component.html',
  styleUrls: ['./edit-number.component.scss'],
})

export class EditNumberComponent {

  constructor(private modalCtrl: ModalController, private accountService: AccountService) { }

  async openNumberModal() {
    const modal = await this.modalCtrl.create({
      component: NumberModalContent, // This is the inline component defined below
      componentProps: { existingNumber: '' } // Pass any necessary data here
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.newNumber) {
      console.log('New Name:', data.newNumber);
      
      // Call addName method to update Firebase
      this.accountService.addName(
        'user-id', // You can get the actual user ID from AuthService
        'name',
        'user-email', // Pass the existing email or retrieve it from your service
        data.newNumber, // Pass the existing phone or retrieve it from your service
        [] // Pass the existing items or retrieve them from your service
      ).subscribe(() => {
        console.log('Phone Number updated successfully');
      });
    }
  }
}

// This is the inline NameModalContent component
@Component({
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Enter New Phone Number</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-item>
        <ion-label position="stacked">New Phone Number</ion-label>
        <ion-input [(ngModel)]="newNumber"></ion-input>
      </ion-item>
      <ion-button expand="full" (click)="submit()">Submit</ion-button>
    </ion-content>
  `
})
export class NumberModalContent {

  newNumber!: string;

  constructor(private modalCtrl: ModalController) { }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  submit() {
    this.modalCtrl.dismiss({ newNumber: this.newNumber });
  }
}