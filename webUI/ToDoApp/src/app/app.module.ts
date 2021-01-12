import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { CardFoldedComponent } from './card-folded/card-folded.component';
import { CardUnfoldedComponent } from './card-unfolded/card-unfolded.component';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    CardFoldedComponent,
    CardUnfoldedComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
