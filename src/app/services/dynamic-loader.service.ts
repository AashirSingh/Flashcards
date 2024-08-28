// dynamic-loader.service.ts
import { Injectable, ComponentFactoryResolver, ViewContainerRef, Type, ComponentRef } from '@angular/core';

@Injectable({
  providedIn: 'root'})
export class DynamicLoaderService {
  constructor(private resolver: ComponentFactoryResolver) {}

  loadComponent<T>(componentType: Type<T>, viewContainerRef: ViewContainerRef): ComponentRef<T> {
    const componentFactory = this.resolver.resolveComponentFactory(componentType);
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    console.log("Component loaded:", componentRef.instance);
    return componentRef;
  }
}