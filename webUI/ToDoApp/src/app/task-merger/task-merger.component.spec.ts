import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMergerComponent } from './task-merger.component';

describe('TaskMergerComponent', () => {
  let component: TaskMergerComponent;
  let fixture: ComponentFixture<TaskMergerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskMergerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskMergerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
