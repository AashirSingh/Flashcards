import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynamicLoaderService } from '../../services/dynamic-loader.service';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.page.html',
  styleUrls: ['./flashcard.page.scss']
})
export class FlashcardPage implements OnInit {
  @ViewChild('loadComponentHere', { read: ViewContainerRef }) entry!: ViewContainerRef;

  constructor(
    private route: ActivatedRoute,
    private loaderService: DynamicLoaderService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const mode = params['mode'];  // Expecting 'practice' or 'study'
      const courseId = params['courseId'];  // Just for context, not used directly in loading the component
      this.loadComponent(mode);
    });
  }

  private loadComponent(mode: string) {
    const componentName = mode.charAt(0).toUpperCase() + mode.slice(1) + 'Component';  // Converts 'practice' to 'PracticeComponent'
    this.loaderService.loadComponent(componentName, this.entry);
  }
}