import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { PracticeComponent } from '../courses/practice/practice.component';
import { StudyComponent } from '../courses/study/study.component';
import { QuizComponent } from '../courses/quiz/quiz.component';
import { QuizResultsComponent } from '../courses/quiz/quiz-results/quiz-results.component';

const routes: Routes = [
  {
    path: 'practice/:id', // Added :id to capture course ID
    component: PracticeComponent
  },
  {
    path: 'study/:id', // Added :id to capture course ID
    component: StudyComponent
  },
  {
    path: 'quiz/:id', // Added :id to capture course ID
    component: QuizComponent
  },
  {
    path: 'quiz-results/:id', // Added :id for the quiz results
    component: QuizResultsComponent
  },
  {
    path: '',
    redirectTo: 'practice/1', // Default to 'practice' with id 1
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    PracticeComponent,
    StudyComponent,
    QuizComponent,
    QuizResultsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    PracticeComponent,
    StudyComponent,
    QuizComponent,
    QuizResultsComponent
  ]
})
export class CoursesModule {}
