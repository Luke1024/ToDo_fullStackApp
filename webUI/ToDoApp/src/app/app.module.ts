import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { TasksComponent } from './tasks/tasks.component';

import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './store.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment'; 
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'; 
import {MatIconModule} from '@angular/material/icon';
import { CardFilterComponent } from './card-filter/card-filter.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { FormPanelComponent } from './form-panel/form-panel.component'; 

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    TasksComponent,
    CardFilterComponent,
    TopBarComponent,
    FormPanelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    StoreModule.forRoot({appState: appReducer}),
    StoreDevtoolsModule.instrument()],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
