import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Firebase Auth (optional)

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {

  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  async logout() {
    try {
      // If using Firebase Auth, sign the user out
      await this.afAuth.signOut();

      // After sign out, navigate to the login page
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error during logout: ', error);
    }
  }
}
