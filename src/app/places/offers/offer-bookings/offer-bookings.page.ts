import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Place } from "/Users/aashirsingh/Documents/testproject3/src/app/places/place.model";
import { PlacesService } from '/Users/aashirsingh/Documents/testproject3/src/app/places/places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss']
})
export class OfferBookingsPage implements OnInit {
  place!: Place;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.pipe(
      switchMap(paramMap => {
        if (!paramMap.has('placeId')) {
          this.navCtrl.navigateBack('/places/tabs/discover');
          return new Observable<Place>(observer => observer.complete());
        }
        const placeId = paramMap.get('placeId');
        if (placeId) {
          return this.placesService.getPlace(placeId);
        } else {
          return new Observable<Place>(observer => observer.complete());
        }
      })
    ).subscribe(
      place => {
        if (place) {
          this.place = place;
          this.isLoading = false;
        } else {
          this.navCtrl.navigateBack('/places/tabs/discover');
        }
      },
      error => {
        this.isLoading = false;
        this.navCtrl.navigateBack('/places/tabs/discover');
      }
    );
  }
}
