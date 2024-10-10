import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAuthPageComponent } from './main-auth-page.component';

describe('MainAuthPageComponent', () => {
  let component: MainAuthPageComponent;
  let fixture: ComponentFixture<MainAuthPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainAuthPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainAuthPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
