import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsComponent } from './inputs';

describe('Inputs', () => {
  let component: InputsComponent;
  let fixture: ComponentFixture<InputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
