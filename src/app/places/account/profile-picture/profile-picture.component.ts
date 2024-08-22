import { Component, OnInit, Input } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss'],
})
export class ProfilePictureComponent  implements OnInit {
  @Input() imageUrl: string = '';
  @Input() name: string = '';
  @Input() email: string = '';
  @Input() phone: string = '';

  constructor() { }

  ngOnInit() {}

}
