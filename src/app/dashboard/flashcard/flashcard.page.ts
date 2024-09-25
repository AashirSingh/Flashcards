import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynamicLoaderService } from '../../services/dynamic-loader.service';
import { PracticeComponent } from '../../courses/practice/practice.component';
import { StudyComponent } from '../../courses/study/study.component';
import { QuizComponent } from 'src/app/courses/quiz/quiz.component';  // Import QuizComponent

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.page.html',
  styleUrls: ['./flashcard.page.scss']
})
export class FlashcardPage implements OnInit {
  @ViewChild('loadComponentHere', { read: ViewContainerRef, static: true }) entry!: ViewContainerRef;

  constructor(
    private route: ActivatedRoute,
    private loaderService: DynamicLoaderService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const mode = params['mode'];
      const courseId = params['courseId'];
      console.log("Routing params:", mode, courseId);
      this.loadComponent(mode, courseId);
    });
  }

  loadComponent(mode: string, courseId: string) {
    let component: any;

    // Determine which component to load based on the mode
    if (mode === 'practice') {
      component = PracticeComponent;
    } else if (mode === 'study') {
      component = StudyComponent;
    } else if (mode === 'quiz') {
      component = QuizComponent;  // Load QuizComponent for the 'quiz' mode
    }

    // Dynamically load the component into the view
    if (this.entry && component) {
      const componentRef = this.loaderService.loadComponent<any>(component, this.entry);
      if (componentRef) {
        componentRef.instance['courseId'] = courseId;  // Set the courseId in the dynamically loaded component
        console.log("Course ID set in component:", componentRef.instance['courseId']);
      }
    } else {
      console.error('ViewContainerRef is not initialized or component is undefined');
    }
  }
}
