import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardUnfoldedComponent } from './card-unfolded.component';

describe('CardUnfoldedComponent', () => {
  let component: CardUnfoldedComponent;
  let fixture: ComponentFixture<CardUnfoldedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardUnfoldedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardUnfoldedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
