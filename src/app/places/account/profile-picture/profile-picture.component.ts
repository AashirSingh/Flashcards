import { Component, OnInit } from '@angular/core'; 
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../../auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss'],
})

export class ProfilePictureComponent implements OnInit {
  firstName = '';
  lastName = '';
  email = '';
  userId: string | null = null;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.userId.pipe(take(1)).subscribe((id) => {
      if (id) {
        this.userId = id;
        this.fetchUserDetails(id);
      }
    });
  }

  fetchUserDetails(userId: string) {
    this.firestore
      .collection('users')
      .doc(userId)
      .get()
      .pipe(take(1))
      .subscribe((docSnapshot) => {
        if (docSnapshot.exists) {
          const userData = docSnapshot.data() as any;
          this.firstName = userData.firstName;
          this.lastName = userData.lastName;
          this.email = userData.email;
        }
      });
  }
}