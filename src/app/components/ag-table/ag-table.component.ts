import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EditButtonComponent } from 'src/app/renderer/edit-button.component';
import { Order } from 'src/app/interface/order';
import { ApiDataService } from 'src/app/service/api.service';
import { EventTypes } from 'src/app/interface/event-types';
import { CustomToastService } from 'src/app/service/custom-toast.service';
import {
  ColDef,
  GridApi,
  ValueSetterParams,
} from 'ag-grid-community';


/**
   * In this component I used ag grid to display the order information
   * I have also included the custom toast service
   * In custom toast I have made use of `ChangeDetection strategy : OnPush`
   * @param toastService Toast to show the status success, failed etc.
   * @param apiService  to comunicate with the backend using service.
   * @param columnDefs Ag Grid Headers.
   * @param rowData Ag Grid row values.
   * @param frameworkComponents Ag Grid additional components.
   * @param encapsulation Using ViewEncapsulation.None to make the styles available across the documents.
*/



@Component({
  selector: 'app-ag-table',
  templateUrl: './ag-table.component.html',
  styleUrls: ['./ag-table.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class AgTableComponent implements OnInit  {

  // Defing column headers
  columnDefs : ColDef[] = [
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: 'Name', field: 'name', editable: true },
      { headerName: 'State', field: 'state', editable: true },
      { headerName: 'Zip', field: 'zip', editable: true, 
        valueSetter: (params: ValueSetterParams) => this.checkNumber(params, 'zip')  //to make sure user entered number only
      },
      { headerName: 'Amount', field: 'amount', editable: true,
        valueSetter: (params: ValueSetterParams) => this.checkNumber(params, 'amount')  //to make sure user entered number only
      },
      { headerName: 'Quantity', field: 'quantity', editable: true, 
        valueSetter: (params: ValueSetterParams) => this.checkNumber(params, 'quantity')  //to make sure user entered number only
      },
      { headerName: 'Item', field: 'item', editable: true },
      {
        headerName: 'Actions',
        cellRenderer: 'buttonRenderer',
        editable: false,
        cellRendererParams: {
          onClick: this.onButtonClick.bind(this),
        },
      }
  ];
  
  rowData : any = [];
  frameworkComponents: any;
  api!: GridApi;
  showOrderModal: boolean = false;
  saveBtn : boolean = false;
  EventTypes = EventTypes;

  constructor(private apiService : ApiDataService, private toastService: CustomToastService)
  {
    // components used in ag grid.
    this.frameworkComponents = {
      buttonRenderer: EditButtonComponent,
    }
  }

  // Once called in the component life-cycle.
  ngOnInit(): void {
    
    this.getOrder();
  }
  
  // on init calling get order API.
  getOrder() {
    this.apiService.getAll().subscribe({
      next : (result : any) => {
        this.rowData = result.response;
      },
      error: (e) => console.error(e)
    })
  }

  // this will be called on inti of ag grid.
  onGridReady(params:any)
  {
    this.api = params.api;
  }
  
  //This is used open order form.
  showModal(){
    this.showOrderModal = !this.showOrderModal;
  }

  // On edit or delete button clicked this fn will be called.
  onButtonClick(params:any)
  {
    if(params.action == 'edit') {
      
      this.saveBtn = true;
      this.api.startEditingCell({
        rowIndex: params.rowIndex,
        colKey: 'name'
      });

    } else {
      this.onDeleteButtonClick(params)
    }
  }

  // On order form popup submit this function will be called and order will be created.
  createOrder(orderDetails : Order): void {

      if(orderDetails) {
        orderDetails.id = parseInt(this.rowData[this.rowData.length-1].id)+1;
        
        this.apiService.create(orderDetails).subscribe({
          next : (result : any) => {
            
            this.toastService.showSuccessToast(result,'Order created successfully');
            this.getOrder();
            this.showModal();    
          },
          error: (e) => console.error(e)
        })
      } else {
        this.toastService.showErrorToast('','Error on creation please try again!');
      }
  }

  // This function is to stop the editing on the ag grid.
  saveOrder() {
    this.api.stopEditing();
  }

  // After saveOrder() this function will be called, here we will call update API.
  onRowValueChanged(params:any)
  {
    if(this.saveBtn) {
      if(this.validate_user_data(params.data)) {
        this.saveBtn = false;
        // Call edit API here      
        this.apiService.update(params.data.id ,params.data).subscribe({
          next : (result : any) => {
            this.toastService.showSuccessToast('','Order Updated successfully');
            this.getOrder();
          },
          error: (e) => console.error(e)
        })
        
      } else {
        this.toastService.showErrorToast('','Please fill all the fields!');
      }
    }
  }

  // on delete button clicked it will navigate here
  onDeleteButtonClick(params:any)
  {
    if(params.rowData.id) {
      this.apiService.delete(params.rowData.id).subscribe({
        next : (result : any) => {
          if(result.status) {
            this.toastService.showSuccessToast('', 'Order deleted!.');
            this.getOrder();
          } else {
            this.toastService.showErrorToast('','Error on delete please try again!');
          }
        },
        error: (e) => console.error(e)
      })
    } else {
      this.toastService.showErrorToast('','Error on delete please try again!');
    }
    
  }

  // This is to validate the user input from ag grid and to make sure user enteres number only.
  checkNumber(params: ValueSetterParams, col : string) {
      let newValInt = parseInt(params.newValue);
      let valueChanged = params.data[col] !== newValInt;
      if (valueChanged) {
        params.data[col] = newValInt ? newValInt : params.oldValue;
      }
      
      if(isNaN(newValInt)) {
        this.saveBtn = false;
        this.toastService.showErrorToast('','Please enter only number!');
      }
      return valueChanged;
  }

  // This function is to validate the user entered data after ag grid row editing.
  validate_user_data(rowData : Order) {
    if(!rowData.amount || !rowData.quantity || !rowData.zip || !rowData.name || !rowData.item || !rowData.state) {
      return false;
    } else{
      return true;
    }

  }
}