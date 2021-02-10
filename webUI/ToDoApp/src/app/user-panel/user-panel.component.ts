import { Component, OnInit } from '@angular/core';
import { ServerConnectionManagerService } from '../server-connection-manager.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements OnInit {

  constructor(connectionManager:ServerConnectionManagerService) { }

  ngOnInit(): void {
  }

}
