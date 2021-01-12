import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { CardFoldedComponent } from './card-folded/card-folded.component';
import { CardUnfoldedComponent } from './card-unfolded/card-unfolded.component';
import { TasksComponent } from './tasks/tasks.component';

import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    CardFoldedComponent,
    CardUnfoldedComponent,
    TasksComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
