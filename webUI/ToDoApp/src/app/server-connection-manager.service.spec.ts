import { TestBed } from '@angular/core/testing';

import { ServerConnectionManagerService } from './server-connection-manager.service';

describe('ServerConnectionManagerService', () => {
  let service: ServerConnectionManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerConnectionManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
