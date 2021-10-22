import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MupdateScreenComponent } from './mupdate-screen.component';

describe('MupdateScreenComponent', () => {
  let component: MupdateScreenComponent;
  let fixture: ComponentFixture<MupdateScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MupdateScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MupdateScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
