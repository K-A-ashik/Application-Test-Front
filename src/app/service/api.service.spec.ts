// Http testing module and mocking controller
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';

import { ApiDataService } from './api.service';
import { MOCK_ORDER } from '../interface/order';
import { environment } from 'src/environments';

describe('ApiDataService testing using HttpClientTestingModule', () => {

  let httpTestingController: HttpTestingController;
  let service: ApiDataService;

  beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [ApiDataService]
      })
  
    httpTestingController = TestBed.inject(HttpTestingController);

    service = TestBed.inject(ApiDataService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create a service `ApiDataService`', () => {
    expect(service).toBeTruthy();
  });

  it('Should fetch a list a of orders', (done) => {
    service = TestBed.inject(ApiDataService);

    service.getAll().subscribe((data:any) => {
      expect(data).toEqual(MOCK_ORDER.response);
      done();
    })
    
    const testRequest = httpTestingController.expectOne(environment.contentful.baseUrl);

    testRequest.flush(MOCK_ORDER.response);
  });

});

