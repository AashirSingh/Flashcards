import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-account-modal',
  templateUrl: './account-modal.component.html',
  styleUrls: ['./account-modal.component.scss'],
})
export class AccountModalContent {
  @Input() firstName!: string;
  @Input() lastName!: string;
  @Input() email!: string;

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  submit() {
    if (this.firstName && this.lastName && this.email) {
      this.modalCtrl.dismiss(
        {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
        },
        'confirm' // Add the 'confirm' role here
      );
    }
  }
}