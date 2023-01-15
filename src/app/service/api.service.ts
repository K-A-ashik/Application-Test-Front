import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../interface/order';
import { environment } from 'src/environments';

@Injectable({
    providedIn: 'root'
  })

export class ApiDataService {
    constructor(private http: HttpClient) { }

    getAll(): Observable<any[]> {
        return this.http.get<any[]>(environment.contentful.baseUrl);
    }

    create(data: any): Observable<any> {
        return this.http.post(environment.contentful.baseUrl, data);
    }

    update(id: any, data: any): Observable<any> {
        return this.http.put(`${environment.contentful.baseUrl}/${id}`, data);
    }

    delete(id: any): Observable<any> {
        return this.http.delete(`${environment.contentful.baseUrl}/${id}`);
    }
}