import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromiseBannerComponent } from './promise-banner.component';

describe('PromiseBannerComponent', () => {
  let component: PromiseBannerComponent;
  let fixture: ComponentFixture<PromiseBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromiseBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromiseBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
