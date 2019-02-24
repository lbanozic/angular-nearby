import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Place } from '../models/Place'

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  proxyUrl: string = 'https://cors-anywhere.herokuapp.com/';
  placesUrl: string = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
  placesLocation: string = 'location=45.992941,15.914833';
  placesRadius: string = 'radius=1000';
  placesKey: string = 'key=AIzaSyC0jgH98w3m1VT1oEZVQiBK23XQmYhfuX4';

  constructor(private http: HttpClient) {}

  // get places
  getPlaces(): Observable<Place> {
    let requestUrl = `${this.proxyUrl}${this.placesUrl}?${this.placesLocation}&${this.placesRadius}&${this.placesKey}`;
    console.log(`request url: ${requestUrl}`);
    return this.http.get<Place>(requestUrl);
  }
}
