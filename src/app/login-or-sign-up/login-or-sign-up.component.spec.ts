import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginOrSignUpComponent } from './login-or-sign-up.component';

describe('LoginOrSignUpComponent', () => {
  let component: LoginOrSignUpComponent;
  let fixture: ComponentFixture<LoginOrSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginOrSignUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginOrSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
