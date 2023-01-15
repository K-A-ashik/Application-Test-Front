import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgGridModule } from 'ag-grid-angular';

import { AgTableComponent } from './ag-table.component';

describe('AgTableComponent', () => {
  let component: AgTableComponent;
  let fixture: ComponentFixture<AgTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AgGridModule],
      declarations: [ AgTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component `AgTableComponent`', () => {
    expect(component).toBeTruthy();
  });
});
