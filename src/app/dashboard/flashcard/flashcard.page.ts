import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '/Users/aashirsingh/Documents/testproject3/src/app/config.service';
import { DynamicLoaderService } from '../../services/dynamic-loader.service';
import { PracticeComponent } from '../../courses/practice/practice.component';
import { StudyComponent } from '../../courses/study/study.component';

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
      console.log("Routing params:", mode, courseId);  // Ensure we are getting the correct params
      this.loadComponent(mode, courseId);
    });
  }

  loadComponent(mode: string, courseId: string) {
    const component = mode === 'practice' ? PracticeComponent : StudyComponent;
    if (this.entry) {
      const componentRef = this.loaderService.loadComponent<any>(component, this.entry);
      if (componentRef) {
        componentRef.instance['courseId'] = courseId;
        console.log("Course ID set in component:", componentRef.instance['courseId']);  // Confirm courseId is set
      }
    } else {
      console.error('ViewContainerRef is not initialized');
    }
  }
}
