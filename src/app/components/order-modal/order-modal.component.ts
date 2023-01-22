import { Component, Output, EventEmitter } from '@angular/core';
import {FormGroup,Validators,FormBuilder} from '@angular/forms';
import { Order } from 'src/app/interface/order';

/**
   * In this component I have made use of parent child comunication 
   * I have used Reactive Forms and validation
   * @param OrderForm Reactive Order Form object
   * @param submitted Validation flag
   * @param submitOrder Event Emitter is used to submit the form.
   * @param closeOrder Event Emitter is used to  close the form.
*/


@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.scss'],
  outputs:['closeOrder'], //This is one type of using parent child comi=unication
})
export class OrderModalComponent {

  OrderForm : FormGroup;
  submitted = false;

   // This is another method of declaring the output to child parent comunication 
  @Output() submitOrder : EventEmitter<Order> = new EventEmitter<Order>();
  closeOrder: EventEmitter<[]> = new EventEmitter<[]>();


  constructor(private formBuilder: FormBuilder) {
    // Adding the form validation in the reactive form.
    this.OrderForm = this.formBuilder.group({
        'name':['', [Validators.required, Validators.pattern("^[a-zA-Z ]*$"), Validators.maxLength(30)]],
        'state':['',[Validators.required, Validators.pattern("^[a-zA-Z ]*$"), Validators.maxLength(20)]],
        'zip':['',[Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(6), Validators.minLength(6)]],
        'amount':['',[Validators.required, Validators.pattern("([0-9]*[.])?[0-9]+")]],
        'qty':['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(8)]],
        'item':['',[Validators.required, Validators.pattern("^[a-zA-Z0-9 ]+$")]],
    });
  }

  get orderFormControl() {
    return this.OrderForm.controls;
  }

  // On form submit it will send the form data to parent.
  submitModal(){
    
    this.submitted = true;
    if (this.OrderForm.invalid) {
      return;
    }
    let orderDetails : Order = this.OrderForm.value;
    this.submitOrder.emit(orderDetails);
  }

  // close the custom modal on the parent side.
  closeModal() {
    this.closeOrder.emit();
  }
}
