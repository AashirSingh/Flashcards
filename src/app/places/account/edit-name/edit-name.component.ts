import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AccountService } from '../account.service'; // Ensure the service is properly imported
import { AuthService } from '../../../auth/auth.service'; // Import AuthService to fetch user details
import { take } from 'rxjs/operators'; // Import take for best practice subscription

@Component({
  selector: 'app-edit-name',
  templateUrl: './edit-name.component.html',
  styleUrls: ['./edit-name.component.scss'],
})
export class EditNameComponent {

  constructor(
    private modalCtrl: ModalController,
    private accountService: AccountService,
    private authService: AuthService // Inject AuthService
  ) {}

  async openNameModal() {
    // Best practice: subscribe to the userId and use take(1) to retrieve it once
    this.authService.userId.pipe(take(1)).subscribe(userId => {
      if (userId) {
        // Fetch user's current details from your AccountService
        this.accountService.fetchAccount().pipe(take(1)).subscribe(accounts => {
          const account = accounts.find(acc => acc.userId === userId);
          if (account) {
            this.presentModal(account);
          }
        });
      }
    });
  }

  async presentModal(user: any) {
    const modal = await this.modalCtrl.create({
      component: NameModalContent,
      componentProps: {
        existingFirstName: user.firstName,
        existingLastName: user.lastName
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.firstName && data.lastName) {
      // Call updateAccountDetails method to update Firebase
      this.accountService.updateAccountDetails(
        user.userId,  // Correct the user ID
        data.firstName,  // Updated first name
        data.lastName,   // Updated last name
        user.email,  // Keep the same email
        user.role    // Keep the role the same
      ).subscribe(() => {
        console.log('Account updated successfully');
      });
    }
  }
}

// Inline NameModalContent component for name update
@Component({
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Update Name</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-item>
        <ion-label position="floating">First Name</ion-label>
        <ion-input [(ngModel)]="firstName"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Last Name</ion-label>
        <ion-input [(ngModel)]="lastName"></ion-input>
      </ion-item>
      <ion-button expand="full" (click)="submit()">Submit</ion-button>
    </ion-content>
  `
})
export class NameModalContent {
  firstName!: string;
  lastName!: string;

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  submit() {
    if (this.firstName && this.lastName) { // Ensure both fields are filled
      this.modalCtrl.dismiss({ firstName: this.firstName, lastName: this.lastName });
    }
  }
}