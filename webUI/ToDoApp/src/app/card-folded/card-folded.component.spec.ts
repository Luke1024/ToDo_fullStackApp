import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardFoldedComponent } from './card-folded.component';

describe('CardFoldedComponent', () => {
  let component: CardFoldedComponent;
  let fixture: ComponentFixture<CardFoldedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardFoldedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardFoldedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
