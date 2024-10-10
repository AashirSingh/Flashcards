import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.scss']
})
export class QuizResultsComponent implements OnInit {
  @Input() correctAnswers: number = 0;
  @Input() totalQuestions: number = 0;

  constructor(private modalCtrl: ModalController) {} 

  ngOnInit(): void {
    if (this.passedQuiz()) {
      this.launchConfetti();
    }
  }

  passedQuiz(): boolean {
    return this.correctAnswers / this.totalQuestions >= 0.7; // Pass if 70% or more correct
  }

  launchConfetti(): void {
    console.log(confetti);
    
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  }

  // Method to dismiss the modal
  dismiss(): void {
    this.modalCtrl.dismiss();
  }
}