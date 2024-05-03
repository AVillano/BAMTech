import { Component } from '@angular/core';
import { PeopleService } from '../services/people.service';
import { Observable } from 'rxjs';
import { PersonAstronaut } from '../interfaces/personastronaut';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [],
  templateUrl: './people.component.html',
  styleUrl: './people.component.css'
})
export class PeopleComponent {
  private peopleSubscription$: any//: Observable<any>

  constructor(private peopleService: PeopleService) {}

  ngOnInit(): void {
    this.peopleService.getPeople().subscribe({
      next: (value: any) => console.log(value)//,
      //error: (err: any) => console.error(err),
      //complete: () => console.log("observable complete")
      }
    );
  }

  ngOnDestroy(): void {
    //this.peopleSubscription$.unsubscribe();
  }
}
