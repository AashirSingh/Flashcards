import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {
  @Input() courseId!: string;
  studyMaterials!: any[]; // This should be replaced with the actual type

  constructor() { }

  ngOnInit(): void {
    // Load study materials based on courseId
  }
}