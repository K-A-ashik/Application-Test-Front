import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-edit-button',
  template: `
      <button class="btn btn-primary" [ngStyle]="buttonStyle" type="submit" (click)="onClick($event, 'edit')">
        <i class="bi bi-pen"></i>
      </button>
      <button class="btn btn-danger" [ngStyle]="buttonStyle" type="submit" (click)="onClick($event, 'delete')">
        <i class="bi bi-trash"></i>
      </button>
    `
})

export class EditButtonComponent implements ICellRendererAngularComp {

  params : any;

  buttonStyle = {
    'margin-right'  : '10px',
    'border-radius' : '8px',
    'margin-bottom' : '6px'
  }

  agInit(params : any): void {
    this.params = params;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event : any, action : string) {
    if (this.params.onClick instanceof Function) {

      const params = {
        event: $event,
        rowData: this.params.node.data,
        action : action,
        rowIndex : this.params.rowIndex
      }
      
      this.params.onClick(params);

    }
  }
}