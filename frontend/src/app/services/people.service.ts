import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PersonAstronaut } from '../interfaces/personastronaut';

@Injectable({
  providedIn: 'root'
})

export class PeopleService {

  constructor(private httpClient: HttpClient) { }

  getPeople() : Observable<any> {
    // const pA1: PersonAstronaut = {
    //   personId: 123,
    //   name: "Jeff",
    //   currentRank: "some rank",
    //   currentDutyTitle: "some duty",
    //   careerStartDate: new Date(),
    //   careerEndDate: new Date()
    // };
    // const pA2: PersonAstronaut = {
    //   personId: 123,
    //   name: "Jeff2",
    //   currentRank: "some rank",
    //   currentDutyTitle: "some duty",
    //   careerStartDate: new Date(),
    //   careerEndDate: new Date()
    // };
    //return of(pA1, pA2);
    return this.httpClient.get("http://localhost:5204/person");
  }
}
