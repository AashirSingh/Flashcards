import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  categories = ['Art', 'Technology', 'Language'];

  constructor() {}

  ngOnInit() {}

  getIconForCategory(category: string): string {
    switch (category) {
      case 'Art':
        return 'brush-outline';
      case 'Technology':
        return 'desktop-outline';
      case 'Language':
        return 'language-outline';
      default:
        return 'book-outline'; // Fallback icon if no match found
    }
  }
}
