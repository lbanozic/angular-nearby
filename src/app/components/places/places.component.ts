import { Component, OnInit } from '@angular/core';
import { PlaceService } from '../../services/place.service'
import { PlaceResult } from '../../models/PlaceResult'

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit {
  searchValue = '';
  places: PlaceResult[];
  placeResults: PlaceResult[];
  filters: Filter[] = [];
  showLoadingError: boolean = false;
  showLoadingSpinner: boolean = false;
  showLocationError: boolean = false;
  locationError: string = '';
  nextPageToken: string;

  constructor(private placeService: PlaceService) { }

  ngOnInit() { }

  // get user location and then get places from service
  onGetPlaces() {
    this.getUserLocation((lat, lng) => {
      this.getPlacesFromService(lat, lng);
    })
  }

  // update places that match filters and search value
  onSearch() {
    let filteredPlaces = this.filterPlaces(this.placeResults);
    this.places = this.searchPlaces(filteredPlaces);
  }

  // reset search value and apply filters
  onResetSearch() {
    this.searchValue = '';
    this.places = this.filterPlaces(this.placeResults);
  }

  // update places that match search value and filters
  onFilterChange() {
    let searchedPlaces = this.searchPlaces(this.placeResults);
    this.places = this.filterPlaces(searchedPlaces);
  }

  // get more places from service
  onGetMorePlaces() {
    this.getMorePlacesFromService(this.nextPageToken);
  }

  // get user location
  getUserLocation(getLatLng?: (lat: number, lng: number) => void) {

    // reset location errors
    this.showLocationError = false;
    this.locationError = '';

    // show loading spinner
    this.showLoadingSpinner = true;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(

        // successfully fetched location, execute getLatLng callback with location data
        position => {
          getLatLng(position.coords.latitude, position.coords.longitude);
        },

        // location error occurred, set location error message
        error => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.locationError = 'User denied the request for Geolocation.';
              break;
            case error.POSITION_UNAVAILABLE:
              this.locationError = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              this.locationError = 'The request to get user location timed out.';
              break;
          }

          // show location error
          this.showLocationError = true;

          // hide loading spinner
          this.showLoadingSpinner = false;
        });
    } else {

      // geolocation not supported by browser error
      this.locationError = 'Geolocation is not supported by this browser.';
      this.showLocationError = true;
      this.showLoadingSpinner = false;
    }
  }

  // get places by lat and lng
  getPlacesFromService(lat: number, lng: number) {

    // set default values
    this.searchValue = '';
    this.places = [];
    this.placeResults = [];
    this.filters = [];
    this.showLoadingError = false;

    // get places from service by lat and lng
    this.placeService.getPlaces(lat, lng).subscribe(place => {

      // set fetched places data
      this.nextPageToken = place.next_page_token;
      this.places = place.results;
      this.placeResults = this.places;

      // set filters
      if (this.places && this.places.length) {
        this.setFilters(this.placeResults);
      } else {
        this.showLoadingError = true;
      }
      this.showLoadingSpinner = false;
    });

  }

  // get places from given places that match filters
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

  // get places from given places that match search value
  searchPlaces(places: PlaceResult[]) {
    return places.filter(p => p.name.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1);
  }

  // get places by next page token
  getMorePlacesFromService(nextPageToken: string) {

    // show loading spinner
    this.showLoadingSpinner = true;

    // set default values
    this.searchValue = '';
    this.filters = [];
    this.showLoadingError = false;

    if (nextPageToken) {
      this.placeService.getPlacesByPageToken(nextPageToken).subscribe(place => {

        // set fetched places data
        this.nextPageToken = place.next_page_token;
        this.places = this.placeResults.concat(place.results);
        this.placeResults = this.places;

        // set filters
        if (this.places && this.places.length) {
          this.setFilters(this.placeResults);
        } else {
          this.showLoadingError = true;
        }
        this.showLoadingSpinner = false;
      });
    } else {
      this.showLoadingSpinner = false;
    }
  }

  // set filters with place types
  setFilters(placeResults: PlaceResult[]) {
    placeResults.forEach(p => {
      p.types.forEach(t => {
        if (this.filters.filter(function (f) { return f.name === t; }).length === 0) {
          this.filters.push(new Filter(t));
        }
      });
    });
  }

}

class Filter {
  name: string;
  checked: boolean = true;

  constructor(name: string) {
    this.name = name;
  }

  public getName(): string {
    const name = this.name.replace(/_/g, ' ');
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}