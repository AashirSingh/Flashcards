import { Injectable, ComponentFactoryResolver, ViewContainerRef, Type } from '@angular/core';
import { PracticeComponent } from '../courses/practice/practice.component';
import { StudyComponent } from '../courses/study/study.component';

@Injectable({
  providedIn: 'root'
})
export class DynamicLoaderService {
  private componentsMap: { [key: string]: Type<any> } = {
    'PracticeComponent': PracticeComponent,
    'StudyComponent': StudyComponent
  };

  constructor(private resolver: ComponentFactoryResolver) {}

  loadComponent(componentName: string, viewContainerRef: ViewContainerRef) {
    const componentType = this.componentsMap[componentName];
    if (componentType) {
      const componentFactory = this.resolver.resolveComponentFactory(componentType);
      viewContainerRef.clear();
      viewContainerRef.createComponent(componentFactory);
    } else {
      console.error(`No component found for ${componentName}`);
    }
  }
}