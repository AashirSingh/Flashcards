import { Component, OnInit } from '@angular/core';
import { ConfigService } from './../config.service';
import { AuthService } from './../auth/auth.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
  streak: number = 0;

  constructor(private configService: ConfigService, private authService: AuthService) { }

  ngOnInit() {
    this.authService.userId.subscribe(userId => {
      if (userId) {
        this.configService.getStreak(userId).then(streak => {
          this.streak = streak;
        });
      }
    });
  }
}