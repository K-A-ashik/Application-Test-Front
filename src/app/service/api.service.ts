import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order,Response } from '../interface/order';
import { environment } from 'src/environments';

@Injectable({
    providedIn: 'root'
  })

export class ApiDataService {
    constructor(private http: HttpClient) { }

    getAll(): Observable<Response> {
        return this.http.get<Response>(environment.contentful.baseUrl);
    }

    create(data: Order): Observable<Response> {
        return this.http.post<Response>(environment.contentful.baseUrl, data);
    }

    update(id: number, data: Order): Observable<Response> {
        return this.http.put<Response>(`${environment.contentful.baseUrl}/${id}`, data);
    }

    delete(id: string): Observable<Response> {
        return this.http.delete<Response>(`${environment.contentful.baseUrl}/${id}`);
    }
}