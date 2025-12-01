import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoEmailComponent } from './promo-email.component';

describe('PromoEmailComponent', () => {
  let component: PromoEmailComponent;
  let fixture: ComponentFixture<PromoEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromoEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
