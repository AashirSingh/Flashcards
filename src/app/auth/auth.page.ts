import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from './user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  authenticate(form: NgForm, email: string, password: string, firstName?: string, lastName?: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: this.isLogin ? 'Logging in...' : 'Signing up...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<User>;

        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          console.log('First Name:', firstName);
          console.log('Last Name:', lastName);
          
          authObs = this.authService.signup(email, password, firstName!, lastName!);
        }

        authObs.subscribe(
          () => {
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/places/tabs/discover');
          },
          errRes => {
            this.isLoading = false;
            loadingEl.dismiss();

            let message = 'Could not sign you up, please try again.';
            
            if (errRes && errRes.error && errRes.error.error) {
              const code = errRes.error.error.message;

              if (code === 'EMAIL_EXISTS') {
                message = 'This email address exists already!';
              } else if (code === 'EMAIL_NOT_FOUND') {
                message = 'E-Mail address could not be found.';
              } else if (code === 'INVALID_PASSWORD') {
                message = 'This password is not correct.';
              }
            } else {
              message = errRes.message || 'An unknown error occurred!';
            }
            this.showAlert(message);
          }
        );
      });
  }  

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    const firstName = form.value.firstName;
    const lastName = form.value.lastName;

    if (this.isLogin) {
      this.authenticate(form, email, password);
    } else {
      this.authenticate(form, email, password, firstName, lastName);
    }
    
    form.reset();
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

  onLoginWithGoogle() {
    this.isLoading = true;
    this.authService.loginWithGoogle().subscribe(
      () => {
        this.isLoading = false;
        this.router.navigateByUrl('/places/tabs/discover');
      },
      errRes => {
        this.isLoading = false;
        const message = 'Could not log you in with Google, please try again.';
        this.showAlert(message);
      }
    );
  }
}
