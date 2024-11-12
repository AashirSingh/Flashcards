import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-display-all',
  templateUrl: './display-all.component.html',
  styleUrls: ['./display-all.component.scss'],
})
export class DisplayAllComponent implements OnInit {
  courses = [
    { title: 'Data Structures & Algorithms', description: 'Learn about various data structures and algorithms.' },
    { title: 'SQL & Databases', description: 'Master SQL and understand how databases work.' },
    { title: 'Sanskrit', description: 'Learn the basics of Sanskrit letters and pronunciation.' },
    { title: '3D Modeling', description: 'Master 3D modeling basics with hands-on projects.' },
    { title: 'Python 1A', description: 'Introduction to Python programming for beginners.' } // Added Python 1A
  ];

  constructor() { }

  ngOnInit() {}
}