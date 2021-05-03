import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../AppState';

@Component({
  selector: 'app-card-filter',
  templateUrl: './card-filter.component.html',
  styleUrls: ['./card-filter.component.css']
})
export class CardFilterComponent implements OnInit {

  constructor(private store: Store<{appState:AppState}>) { }

  ngOnInit(): void {
  }

  all():void {

  }

  toDo():void {

  }

  done():void {

  }
}
