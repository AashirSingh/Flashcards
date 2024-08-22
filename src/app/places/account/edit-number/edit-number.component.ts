import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-edit-number',
  templateUrl: './edit-number.component.html',
  styleUrls: ['./edit-number.component.scss'],
})
export class EditNumberComponent implements OnInit {
  accountId!: string;
  userId!: string;
  name!: string;
  email!: string;
  items!: any[];

  constructor(private modalCtrl: ModalController, private accountService: AccountService) { }

  ngOnInit() {
    // Initialize or fetch these properties as needed
    this.accountId = 'some-account-id'; // Replace with actual value or logic
    this.userId = 'some-user-id';       // Replace with actual value or logic
    this.name = 'some-name';            // Replace with actual value or logic
    this.email = 'some-email';          // Replace with actual value or logic
    this.items = [];                    // Replace with actual value or logic
  }

  async openNumberModal() {
    const modal = await this.modalCtrl.create({
      component: NumberModalContent,
      componentProps: { existingNumber: '' }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.newNumber) {
      console.log('New Number:', data.newNumber);

      this.accountService.addPhone(
        this.userId,
        this.name,
        this.email,
        data.newNumber,
        this.items
      ).subscribe(() => {
        // Handle success if needed
      });
    }
  }
}

@Component({
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Enter New Number</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-item>
        <ion-label position="stacked">New Number</ion-label>
        <ion-input [(ngModel)]="newNumber" type="tel"></ion-input> 
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
