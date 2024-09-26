import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../config.service';


@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  chartData: any;
  chartOptions: any;

  constructor(private configService: ConfigService) { }

  ngOnInit() {
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
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Bar color
            borderColor: 'rgba(75, 192, 192, 1)', // Border color of bars
            borderWidth: 1
          }
        ]
      };

      // Configure chart options
      this.chartOptions = {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        responsive: true,
        maintainAspectRatio: false
      };
    });
  }
}
