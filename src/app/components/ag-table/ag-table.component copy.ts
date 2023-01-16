import { Component, ViewChild } from '@angular/core';
import { GridApi, CellValueChangedEvent, RowValueChangedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ag-table',
  templateUrl: './ag-table.component.html',
  styleUrls: ['./ag-table.component.scss']
})
export class AgTableComponent {


  frameworkComponents: any;
  api: any;

  // Each Column Definition results in one Column.
  public columnDefs: ColDef[] = [
    { field: 'make'},
    { field: 'model'},
    { field: 'price' }
  ];

  // { field: 'id'},
  // { field: 'name'},
  // { field: 'state' },
  // { field: 'zip' },
  // { field: 'amount' },
  // { field: 'qty' },
  // { field: 'item' }

  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    editable: false, 
  };


  // 'orderData': new FormGroup({
  //   'name':new FormControl(null,[Validators.required]),
  //   'state':new FormControl(null,[Validators.required]),
  //   'zip':new FormControl(null,[Validators.required]),
  //   'amount':new FormControl(null,[Validators.required]),
  //   'qty':new FormControl(null,[Validators.required]),
  //   'item':new FormControl(null,[Validators.required]),
  // })

  // Data that gets displayed in the grid
  public rowData$!: Observable<any[]>;

  constructor(private http: HttpClient) {}

  // Example load data from sever
  onGridReady(params: GridReadyEvent) {
    this.rowData$ = this.http
      .get<any[]>('https://www.ag-grid.com/example-assets/row-data.json');
  }


  onRowValueChanged(event: RowValueChangedEvent) {
    
    var data = event.data;
    console.log(
      'onRowValueChanged: (' +
        data.make +
        ', ' +
        data.model +
        ', ' +
        data.price +
        ', ' +
        data.field5 +
        ')'
    );
  }

}
