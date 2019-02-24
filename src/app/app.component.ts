import { Component, OnInit } from '@angular/core';
import { PlaceService } from './services/place.service'
import { PlaceResult } from './models/PlaceResult'

import { placesSample } from '../places-sample'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  searchValue = '';
  places: PlaceResult[];
  placeResults: PlaceResult[];

  constructor(private placeService: PlaceService) {}

  ngOnInit() {
    this.placeService.getPlaces().subscribe(place => {
      this.places = place.results;
      this.placeResults = this.places;
    });
    // use code below to replace calling places API with sample places
    // this.places = placesSample.results;
    // this.placeResults = this.places;
  }

  onSearch() {
    this.places = this.placeResults.filter(p => p.name.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1);
  }

  resetSearch() {
    this.searchValue = '';
    this.places = this.placeResults;
  }
}
