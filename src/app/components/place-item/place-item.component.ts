import { Component, OnInit, Input } from '@angular/core';
import { PlaceResult } from '../../models/PlaceResult'

@Component({
  selector: 'app-place-item',
  templateUrl: './place-item.component.html',
  styleUrls: ['./place-item.component.css']
})
export class PlaceItemComponent implements OnInit {
  @Input() place: PlaceResult;

  constructor() { }

  ngOnInit() {
  }

}
