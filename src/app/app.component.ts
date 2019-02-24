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
  // places: PlaceResult[];
  places: any;
  placeResults: PlaceResult[];

  filters: Filter[] = [];

  constructor(private placeService: PlaceService) { }

  ngOnInit() {
    // this.placeService.getPlaces().subscribe(place => {
    //   this.places = place.results;
    //   this.placeResults = this.places;
    // });
    // use code below to replace calling places API with sample places
    this.places = placesSample.results;
    this.placeResults = this.places;

    // construct filters with place types
    this.placeResults.forEach(p => {
      p.types.forEach(t => {
        if (this.filters.filter(function (f) { return f.name === t; }).length === 0) {
          this.filters.push(new Filter(t));
        }
      });
    });
  }

  onSearch() {
    let filteredPlaces = this.filterPlaces(this.placeResults);
    this.places = this.searchPlaces(filteredPlaces);
  }

  searchPlaces(places: PlaceResult[]) {
    return places.filter(p => p.name.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1);
  }

  resetSearch() {
    this.searchValue = '';
    this.places = this.filterPlaces(this.placeResults);
  }

  onFilterChange() {
    let searchedPlaces = this.searchPlaces(this.placeResults);
    this.places = this.filterPlaces(searchedPlaces);
  }

  filterPlaces(places: PlaceResult[]) {
    let checkedFilters = this.filters.filter(p => p.checked);
    return places.filter(p => {
      let matchesFilters = false;
      checkedFilters.forEach(f => {
        if (p.types.includes(f.name)) {
          matchesFilters = true;
        }
      });
      return matchesFilters;
    });
  }

}

class Filter {
  name: string;
  checked: boolean = true;

  constructor(name: string) {
    this.name = name;
  }
}