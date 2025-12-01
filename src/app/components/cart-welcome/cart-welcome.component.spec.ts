import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartWelcomeComponent } from './cart-welcome.component';

describe('CartWelcomeComponent', () => {
  let component: CartWelcomeComponent;
  let fixture: ComponentFixture<CartWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartWelcomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
