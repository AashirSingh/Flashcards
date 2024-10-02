import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FlashcardPageRoutingModule } from './flashcard-routing.module';
import { FlashcardPage } from './flashcard.page';
import { PracticeComponent } from '../../courses/practice/practice.component';
import { StudyComponent } from '../../courses/study/study.component';
import { QuizComponent } from 'src/app/courses/quiz/quiz.component';
import { WriteModalComponent } from './write-modal/write-modal.component';
import { QuizResultsComponent } from 'src/app/courses/quiz/quiz-results/quiz-results.component';  


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlashcardPageRoutingModule
  ],
  declarations: [
    FlashcardPage,
    PracticeComponent,   
    StudyComponent,
    QuizComponent,
    WriteModalComponent,
    QuizResultsComponent 
  ],
})
export class FlashcardPageModule {}