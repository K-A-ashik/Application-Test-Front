import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Order, Response, CellParam } from 'src/app/interface/order';
import { ApiDataService } from 'src/app/service/api.service';
import { CustomToastService } from 'src/app/service/custom-toast.service';
import {
  ColDef,
  DomLayoutType,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  RowEditingStartedEvent,
  RowEditingStoppedEvent,
  RowValueChangedEvent,
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
   * @param encapsulation Using ViewEncapsulation.None to make the styles available across the documents.
*/


function actionCellRenderer(params : ICellRendererParams) {

  let eGui = document.createElement("div");

  let editingCells = params.api.getEditingCells();
  // checks if the rowIndex matches in at least one of the editing cells
  let isCurrentRowEditing = editingCells.some((cell:CellParam) => {
    return cell.rowIndex === params.node.rowIndex;
  });

  if (isCurrentRowEditing) {
    eGui.innerHTML = `
    <button  class="buttonStyle btn btn-primary update"  data-action="update"> save <i class="bi bi-save"></i>  </button>
    <button  class="buttonStyle btn btn-primary cancel"  data-action="cancel"> cancel <i class="bi bi-x-square"></i> </button>
    `;
  } else {
    eGui.innerHTML = `
    <button class="buttonStyle btn btn-primary edit"  data-action="edit"> edit <i class="bi bi-pen"></i> </button>
    <button class="buttonStyle btn btn-primary delete" data-action="delete"> delete<i class="bi bi-trash3"></i> </button>
    `;
  }

  return eGui;
}


@Component({
  selector: 'app-ag-table',
  templateUrl: './ag-table.component.html',
  styleUrls: ['./ag-table.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class AgTableComponent implements OnInit  {

  // Defing column headers
  columnDefs : ColDef[] = [
      { headerName: 'Id', field: 'id', editable: false, maxWidth: 140,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
      },
      { headerName: 'Name', field: 'name', editable: true },
      { headerName: 'State', field: 'state', editable: true },
      { headerName: 'Zip', field: 'zip', editable: true, maxWidth: 130,
        valueSetter: (params: ValueSetterParams) => this.checkNumber(params, 'zip')  //to make sure user entered number only
      },
      { headerName: 'Amount', field: 'amount', editable: true, maxWidth: 130,
        valueSetter: (params: ValueSetterParams) => this.checkNumber(params, 'amount')  //to make sure user entered number only
      },
      { headerName: 'Quantity', field: 'qty', editable: true, maxWidth: 140,
        valueSetter: (params: ValueSetterParams) => this.checkNumber(params, 'qty')  //to make sure user entered number only
      },
      { headerName: 'Item', field: 'item', editable: true, maxWidth: 130 },
      {
        headerName: "action",
        minWidth: 150,
        cellRenderer: actionCellRenderer,
        editable: false,
        colId: "action",
        sortable : false
      }
  ];
  
  // Column Configuration
  defaultColDef : ColDef = {
        sortingOrder: ["asc", "desc"],
        sortable:true,
        filter: true
  };

  // Row Data
  rowData : Order[] = [];
  api!: GridApi;
  showOrderModal: boolean = false;
  domLayout: DomLayoutType = 'autoHeight';
  updateFlag : boolean = false;
  editingRow: Order = {
    id: 0,
    name: '',
    state: '',
    zip: 0,
    amount: 0,
    qty: 0,
    item: ''
  };

  constructor(private apiService : ApiDataService, private toastService: CustomToastService)
  {
  }

  // Once called in the component life-cycle.
  ngOnInit(): void {
    
    this.getOrder();
  }
  
  // on init calling get order API.
  getOrder() {
    this.apiService.getAll().subscribe({
      next : (result : Response) => {
        this.rowData = result.response;
      },
      error: (e) => this.toastService.showErrorToast('','Error on order listing!')
    })
  }

  // this will be called on inti of ag grid.
  onGridReady(params:GridReadyEvent)
  {
    this.api = params.api;
    params.api.sizeColumnsToFit();
  }
  
  //This is used open order form.
  showModal(){
    this.showOrderModal = !this.showOrderModal;
  }

  // On order form popup submit this function will be called and order will be created.
  createOrder(orderDetails : Order): void {

      if(orderDetails) {        
        this.apiService.create(orderDetails).subscribe({
          next : (result : Response) => {
            
            this.toastService.showSuccessToast('','Order created successfully');
            this.getOrder();
            this.showModal();
          },
          error: (e) => this.toastService.showErrorToast('','Error on creation please try again!')
        })
      } else {
        this.toastService.showErrorToast('','Error on creation please try again!');
      }
  }

  // This function is called on save, which will update the order data
  updateOrder(data:Order) {
    if(this.validate_user_data(data)) {
      // Call edit API here      
      this.apiService.update(data.id ,data).subscribe({
        next : () => {
          this.toastService.showSuccessToast('','Order Updated successfully');
          this.getOrder();
        },
        error: (e) => this.toastService.showErrorToast('','Please fill all the fields!')
      })
      
    } else {
      this.toastService.showErrorToast('','Please fill all the fields!');
    }    
    
  }

  // After saveOrder() this function will be called, here we will call update API.
  onRowValueChanged(params:RowValueChangedEvent)
  {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });

  }

  // On delete button clicked it will navigate here
  onDeleteButtonClick(id:string)
  {
    if(id) {
      this.apiService.delete(id).subscribe({
        next : (result : Response) => {
          if(result.status) {
            this.toastService.showSuccessToast('', 'Order deleted successfully!.');
            this.getOrder();
          } else {
            this.toastService.showErrorToast('','Error on delete please try again!');
          }
        },
        error: (e) => this.toastService.showErrorToast('','Error on delete please try again!')
      })
    } else {
      this.toastService.showErrorToast('','Error on delete please try again!');
    }
    
  }

  // This function will delete multiple data at once, params are passed as id seprated by commas.
  onDeleteMultiple() {
    let selectedData = this.api.getSelectedRows();
    let ids = selectedData.map(order => order.id).join(',');
    this.onDeleteButtonClick(ids);
    this.api.applyTransaction({
      remove: selectedData
    });
  }

  // This is to validate the user input from ag grid and to make sure user enteres number only.
  checkNumber(params: ValueSetterParams, col : string) {
      let newValInt = parseInt(params.newValue);
      let valueChanged = params.data[col] !== newValInt;
      if (valueChanged) {
        params.data[col] = newValInt ? newValInt : params.oldValue;
      }
      
      if(isNaN(newValInt)) {
        this.toastService.showErrorToast('','Please enter only number!');
      }
      return valueChanged;
  }

  // This function is to validate the user entered data after ag grid row editing.
  validate_user_data(rowData : Order) {
    if(!rowData.amount || !rowData.qty || !rowData.zip || !rowData.name || !rowData.item || !rowData.state) {
      return false;
    } else{
      return true;
    }

  }

  // On edit, update, cancel or delete button clicked this fn will be called.
  onCellClicked(params: any) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.parentNode.getAttribute('data-action')) {
      let action = params.event.target.parentNode.getAttribute('data-action');
      if (action === "edit") {
        params.api.startEditingCell({
          rowIndex: params.node.rowIndex,
          // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        });
      }

      if (action === "delete") {
        // call delete function
        this.onDeleteButtonClick(params.node.data.id);
        params.api.applyTransaction({
          remove: [params.node.data]
        });
      }

      if (action === "update") {
        // call update
        params.api.stopEditing(false);
        this.updateFlag = true;
        this.updateOrder(params.data)
      }

      if (action === "cancel") {
        params.api.stopEditing(true);
      }
    }
  }

  // This function is to toggle the action button onclick of edit
  onRowEditingStarted(params:RowEditingStartedEvent) {
    this.updateFlag = false;
    this.editingRow = JSON.parse(JSON.stringify(params.node.data));
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  }

  // This function is to toggle the action button when editing stopped
  onRowEditingStopped(params:RowEditingStoppedEvent) {
    if(this.editingRow.id !=0 && !this.updateFlag) {
      let rowNode = params.api.getRowNode(String(params.node.rowIndex))!;
      rowNode.setData(this.editingRow);
    }
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  }

  // To search order data
  onQuickFilterChanged() {
    this.api.setQuickFilter(
      (document.getElementById('quickFilter') as HTMLInputElement).value
    );
  }


}