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
        this.rowData = result.data;
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

  // on delete button clicked it will navigate here
  onDeleteButtonClick(params:any)
  {
    this.apiService.getAll().subscribe({
      next : (result : any) => {
        this.toastService.showErrorToast('', 'Order deleted!.');
        
      },
      error: (e) => console.error(e)
    })
    
  }

  // On order form popup submit this function will be called and order will be created.
  createOrder(orderDetails : Order): void {


      let newRowData = this.rowData.slice();
      orderDetails.id = parseInt(this.rowData[this.rowData.length-1].id)+1;
      console.log(orderDetails);
      newRowData.push(orderDetails);
      this.rowData = newRowData;
      this.showModal();
      this.toastService.showSuccessToast('','Order created successfully');
      console.log(newRowData);
      
      return;
      // this.apiService.getAll().subscribe({
      //   next : (result : any) => {
      //     console.log('deleted');
          
      //   },
      //   error: (e) => console.error(e)
      // })

      // Do API call here
  }

  // This function is to stop the editing on the ag grid.
  saveOrder() {
    this.saveBtn = false;
    this.api.stopEditing();
  }

  // After saveOrder() this function will be called, here we will call update API.
  onRowValueChanged(params:any)
  {    
    if(this.validate_user_data(params.data)) {
      // Call edit API here
      this.apiService.getAll().subscribe({
        next : (result : any) => {
          console.log('Updated');
          this.toastService.showSuccessToast('','Order Updated successfully');
        },
        error: (e) => console.error(e)
      })
      
    } else {
      console.log('error on saving params - ', params);
    }
  }

  // This is to validate the user input from ag grid and to make sure user enteres number only.
  checkNumber(params: ValueSetterParams, col : string) {
      let newValInt = parseInt(params.newValue);
      let valueChanged = params.data[col] !== newValInt;
      if (valueChanged) {
        params.data[col] = newValInt ? newValInt : params.oldValue;
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