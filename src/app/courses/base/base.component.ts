// src/app/courses/base/base.component.ts

import { Directive, Input } from '@angular/core';

/**
 * BaseComponent to handle common properties and functionalities
 * for components like PracticeComponent and StudyComponent.
 * Using @Directive() as this is an abstract base class.
 */
@Directive({
  selector: '[base]' // This selector is never used but necessary for Angular internals.
})
export class BaseComponent {
  @Input() courseId!: string; // Common property shared by both components.

  constructor() {
    // Base constructor logic if needed
  }

  // Add common methods here if needed
}