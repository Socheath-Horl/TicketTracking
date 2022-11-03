import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActivationDialogComponent } from './user-activation-dialog.component';

describe('UserActivationDialogComponent', () => {
  let component: UserActivationDialogComponent;
  let fixture: ComponentFixture<UserActivationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserActivationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserActivationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
