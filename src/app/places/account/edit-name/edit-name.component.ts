import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AccountService } from '../account.service'; // Import the service

@Component({
  selector: 'app-edit-name',
  templateUrl: './edit-name.component.html',
  styleUrls: ['./edit-name.component.scss'],
})
export class EditNameComponent {

  constructor(private modalCtrl: ModalController, private accountService: AccountService) { }

  async openNameModal() {
    const modal = await this.modalCtrl.create({
      component: NameModalContent, // This is the inline component defined below
      componentProps: { existingName: '' } // Pass any necessary data here
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.newName) {
      console.log('New Name:', data.newName);
      
      // Call addName method to update Firebase
      this.accountService.addName(
        'user-id', 
        data.newName,
        'user-email', 
        'user-phone', 
        [] 
      ).subscribe(() => {
        console.log('Name updated successfully');
      });
    }
  }
}


@Component({
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Enter New Name</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-item>
        <ion-label position="stacked">New Name</ion-label>
        <ion-input [(ngModel)]="newName"></ion-input>
      </ion-item>
      <ion-button expand="full" (click)="submit()">Submit</ion-button>
    </ion-content>
  `
})
export class NameModalContent {

  newName!: string;

  constructor(private modalCtrl: ModalController) { }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  submit() {
    this.modalCtrl.dismiss({ newName: this.newName });
  }
}