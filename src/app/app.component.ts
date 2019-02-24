import { Component } from '@angular/core';
import { placesSample } from '../places-sample'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  value = '';
  places:any = placesSample;
  
  constructor() {
    console.log(this.places);
  }
}
