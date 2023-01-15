import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { OrderModalComponent } from './order-modal.component';
import { Order } from 'src/app/interface/order';

describe('OrderModalComponent', () => {
  let component: OrderModalComponent;
  let fixture: ComponentFixture<OrderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderModalComponent ],
      imports: [ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component `OrderModalComponent`', () => {
    expect(component).toBeTruthy();
  });

  it('Test a Form Group Element Count', () => {
    const formElement = fixture.debugElement.nativeElement.querySelector('#orderForm');
    const inpuElements = formElement.querySelectorAll('input');
    expect(inpuElements.length).toEqual(6);
  });

  it('All the inital default form value should be empty',  () => {
    const orderFormGroup = component.OrderForm;
    const orderFormValues = {
      name : '',
      state : '',
      zip : '',
      amount : '',
      quantity : '',
      item : ''
    };

    expect(orderFormGroup.value).toEqual(orderFormValues);
  });

  it('Validate all form value on submit', () => {
      expect(component.OrderForm.valid).toBeFalsy();
      component.OrderForm.controls['name'].setValue("New Order");
      component.OrderForm.controls['state'].setValue("Karnataka");
      component.OrderForm.controls['zip'].setValue(56009);
      component.OrderForm.controls['amount'].setValue(150000);
      component.OrderForm.controls['quantity'].setValue(15);
      component.OrderForm.controls['item'].setValue('AHG54645L');
      expect(component.OrderForm.valid).toBeTruthy();

      let order: Order;
      // Subscribe to the Observable and store the user in a local variable.
      component.submitOrder.subscribe((value) => {

        order = value
        // Trigger the login function
        component.submitModal();
        
        // Now we can check to make sure the emitted value is correct
        expect(order.name).toBe("New Order");
        expect(order.state).toBe("Karnataka");
        expect(order.zip).toBe(56009);
        expect(order.amount).toBe(150000);
        expect(order.quantity).toBe(15);
        expect(order.item).toBe("AHG54645L");
      });
  });

});