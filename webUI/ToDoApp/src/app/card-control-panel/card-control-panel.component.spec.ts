import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardControlPanelComponent } from './card-control-panel.component';

describe('CardControlPanelComponent', () => {
  let component: CardControlPanelComponent;
  let fixture: ComponentFixture<CardControlPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardControlPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
