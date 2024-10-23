import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/user.model';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { AccountModalContent } from './account-modal/account-modal.component'; // Import the modal component

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss']
})
export class AccountPage implements OnInit, OnDestroy {
  user: User | null = null;
  private userSub!: Subscription;

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  openEditAccountModal() {
    if (!this.user) {
      return;
    }

    this.modalCtrl.create({
      component: AccountModalContent,
      componentProps: {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email
      }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resultData => {
      if (resultData.role === 'confirm' && resultData.data) {
        const updatedDetails = resultData.data;
        this.authService.updateAccountDetails(
          this.user!.id,
          updatedDetails.firstName,
          updatedDetails.lastName,
          updatedDetails.email
        ).subscribe(() => {
          console.log('Profile updated successfully');
        });
      }
    });
  }
}
