import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CoursePopupComponent } from '../../discover/course-popup/course-popup.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  categories = ['🖌️ Art', '💻 Technology', '🌐 Language'];
  selectedCategory: string = '';
  courses: string[] = [];
  courseIds: { [key: string]: number } = {}; // Holds course names and their corresponding IDs

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.loadCourses(); // Load courses for the selected category
    this.loadCourseIds(); // Load course IDs for the selected category
  }

  loadCourses() {
    switch (this.selectedCategory) {
      case '🖌️ Art':
        this.courses = ['3D Modeling'];
        break;
      case '💻 Technology':
        this.courses = ['Algorithms', 'Databases', '3D Modeling', 'Python 1A'];
        break;
      case '🌐 Language':
        this.courses = ['Sanskrit'];
        break;
      default:
        this.courses = [];
        break;
    }
  }

  loadCourseIds() {
    switch (this.selectedCategory) {
      case '🖌️ Art':
        this.courseIds = { '3D Modeling': 3 };
        break;
      case '💻 Technology':
        this.courseIds = {
          'Algorithms': 1,
          'Databases': 2,
          '3D Modeling': 3, // Keeping the same ID for "3D Modeling" as in Art
          'Python 1A': 5, // Assign a unique ID
        };
        break;
      case '🌐 Language':
        this.courseIds = { 'Sanskrit': 4 };
        break;
      default:
        this.courseIds = {};
        break;
    }
  }

  async showCoursePopup(course: string) {
    const modal = await this.modalCtrl.create({
      component: CoursePopupComponent,
      componentProps: {
        courseName: course,
        courseDescription: this.getCourseDescription(course), // Get the course description dynamically
        courseId: this.courseIds[course], // Pass the course ID to the popup
      },
    });
    return await modal.present();
  }

  getCourseDescription(course: string): string {
    switch (course) {
      case '3D Modeling':
        return 'Master 3D modeling basics with hands-on projects. Learn to create, texture, and render stunning 3D objects using industry tools, perfect for beginners.';
      case 'Algorithms':
        return 'Learn about various data structures and algorithms.';
      case 'Databases':
        return 'Master SQL and understand how databases work.';
      case 'Sanskrit':
        return 'Learn the basics of Sanskrit letters and pronunciation.';
      case 'Python 1A':
        return 'Introduction to Python programming for beginners.';
      default:
        return 'Course details go here.';
    }
  }

  goBack() {
    this.selectedCategory = ''; // Clear the selected category to go back to the category list
    this.courses = []; // Clear the courses array
    this.courseIds = {}; // Clear the course IDs
  }

  getIconForCategory(category: string): string {
    switch (category) {
      case '🖌️ Art':
        return 'brush-outline';
      case '💻 Technology':
        return 'desktop-outline';
      case '🌐 Language':
        return 'language-outline';
      default:
        return 'book-outline'; // Fallback icon if no match found
    }
  }
}