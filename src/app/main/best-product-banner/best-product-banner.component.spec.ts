import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestProductBannerComponent } from './best-product-banner.component';

describe('BestProductBannerComponent', () => {
  let component: BestProductBannerComponent;
  let fixture: ComponentFixture<BestProductBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestProductBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestProductBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
