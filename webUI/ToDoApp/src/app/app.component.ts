import { Component } from '@angular/core';
import { TokenService } from './user_services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ToDoApp';

  constructor(private tokenService:TokenService) {
    tokenService.getToken()
  } 
}
