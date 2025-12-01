import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartItemListComponent } from './cart-itemlist.component';


describe('CartItemlistComponent', () => {
  let component: CartItemListComponent;
  let fixture: ComponentFixture<CartItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItemListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
