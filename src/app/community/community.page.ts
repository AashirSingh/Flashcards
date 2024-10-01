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
  personalBest: number = 0;  // Add a variable for personal best streak
  chartData: any;
  chartOptions: any;

  constructor(private configService: ConfigService, private authService: AuthService) { }

  ngOnInit() {
    // Fetch streak and personal best
    this.authService.userId.subscribe(userId => {
      if (userId) {
        // Update the current streak
        this.configService.updateStreak(userId).then(streak => {
          this.streak = streak;
        });

        // Fetch the personal best streak
        this.configService.getPersonalBest(userId).then(personalBest => {
          this.personalBest = personalBest;
        });
      }
    });

    // Fetch leaderboard data
    this.configService.getLeaderboard().then(data => {
      const usernames = data.map(user => user.username);
      const correctAnswers = data.map(user => user.correctAnswers);

      // Set up the chart data
      this.chartData = {
        labels: usernames,
        datasets: [
          {
            label: 'Correct Answers',
            data: correctAnswers,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      };

      // Configure chart options including title
      this.chartOptions = {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Top Performers (Quiz)',
            font: {
              size: 18
            },
            padding: {
              top: 10,
              bottom: 30
            }
          }
        }
      };
    });
  }
}
