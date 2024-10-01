import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../config.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-personal-best',
  templateUrl: './personal-best.component.html',
  styleUrls: ['./personal-best.component.scss'],
})
export class PersonalBestComponent implements OnInit {
  personalBest: number = 0;  // Track personal best

  constructor(private configService: ConfigService, private authService: AuthService) { }

  ngOnInit() {
    this.authService.userId.subscribe(userId => {
      if (userId) {
        // Fetch personal best streak
        this.configService.getPersonalBest(userId).then(personalBest => {
          this.personalBest = personalBest;
        });
      }
    });
  }
}
