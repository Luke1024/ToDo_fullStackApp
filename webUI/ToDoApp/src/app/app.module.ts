import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { TasksComponent } from './tasks/tasks.component';

import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { CardControlPanelComponent } from './card-control-panel/card-control-panel.component';
import { ExperimentalSwitchComponent } from './experimental-switch/experimental-switch.component';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    TasksComponent,
    UserPanelComponent,
    CardControlPanelComponent,
    ExperimentalSwitchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
