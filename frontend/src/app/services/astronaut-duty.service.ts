import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AstronautDutyService {

  constructor(private httpClient: HttpClient) { }

  getAstronautDutiesByName(name: string) : Observable<any> {
    return this.httpClient.get("http://localhost:5204/astronautduty/" + (name ? name : ""));
  }
}
