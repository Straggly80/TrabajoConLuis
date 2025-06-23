import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlackPage } from './black.page';

describe('BlackPage', () => {
  let component: BlackPage;
  let fixture: ComponentFixture<BlackPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BlackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
