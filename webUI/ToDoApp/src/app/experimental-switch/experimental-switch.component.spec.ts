import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentalSwitchComponent } from './experimental-switch.component';

describe('ExperimentalSwitchComponent', () => {
  let component: ExperimentalSwitchComponent;
  let fixture: ComponentFixture<ExperimentalSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperimentalSwitchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentalSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
