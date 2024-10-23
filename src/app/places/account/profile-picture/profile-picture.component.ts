import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Import Firestore
import { AuthService } from '../../../auth/auth.service'; // Adjust path based on your structure
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
    // Get user ID from AuthService
    this.authService.userId.pipe(take(1)).subscribe((id) => {
      if (id) {
        this.userId = id;

        // Fetch user details from Firestore using the userId
        this.firestore
          .collection('users')
          .doc(id)
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
    });
  }
}
