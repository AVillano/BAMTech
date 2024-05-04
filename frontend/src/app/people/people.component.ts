import { Component, ViewChild } from '@angular/core';
import { PeopleService } from '../services/people.service';
import { Observable, Subscription } from 'rxjs';
import { PersonAstronaut } from '../interfaces/personastronaut';
import { CommonModule } from '@angular/common';
import { PersonModalComponent } from '../person-modal/person-modal.component';
import { AstronautDutyService } from '../services/astronaut-duty.service';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [ CommonModule, PersonModalComponent ],  
  templateUrl: './people.component.html',
  styleUrl: './people.component.css'
})
export class PeopleComponent {
  @ViewChild(PersonModalComponent) personModal: PersonModalComponent | undefined;

  public people: PersonAstronaut[] = [];
  public errorLoading: boolean = false;

  public showModal: boolean = false;

  //private astronautDuties: any = {}

  private peopleSubscription$: Subscription = Subscription.EMPTY;
  private astronautDutySubscription$: Subscription = Subscription.EMPTY;

  constructor(private peopleService: PeopleService, private astronautDutyService: AstronautDutyService) {}

  ngOnInit(): void {
    // this.peopleSubscription$ = this.peopleService.getPeople().subscribe({
    //   next: (value: any) => {
    //     //console.log(value);
    //     this.people = value.people;
    //   },
    //   error: (err: any) => {
    //     console.error(err);
    //     this.errorLoading = true;
    //   },
    //   complete: () => this.loadAstronautDuties()
    // });
  }

  // since we want to push the data from loadAstronautDuties to personModal, we need it initialized
  // ngOnInit is too early for that
  ngAfterViewInit(): void {
    this.peopleSubscription$ = this.peopleService.getPeople().subscribe({
      next: (value: any) => {
        //console.log(value);
        this.people = value.people;
      },
      error: (err: any) => {
        console.error(err);
        this.errorLoading = true;
      },
      complete: () => this.loadAstronautDuties()
    });
  }

  ngOnDestroy(): void {
    // I could've sworn I've done this.[SUBSCRIPTION]?.unsubscribe() before but it doesn't seem to work now
    if (this.peopleSubscription$) {
      this.peopleSubscription$.unsubscribe();
    }
  }

  openModal(name: string) {
    if (this.personModal) { 
      this.personModal.openModal(name);
    }
  }

  loadAstronautDuties() {
    let loadedDuties: any = {}
    this.people.forEach(p => {
      this.astronautDutySubscription$ = this.astronautDutyService.getAstronautDutiesByName(p.name).subscribe({
        next: (value: any) => {
          loadedDuties = value.astronautDuties;
        },
        error: (err: any) => {
          console.error(err);
          this.errorLoading = true;
        },
        complete: () => {
          if (this.personModal) {
            this.personModal.preloadData(p.name, loadedDuties);
          }
        }
      })
    });
  }

  /*resubscribe() {
    this.peopleSubscription$ = this.peopleService.getPeople().subscribe({
      next: (value: any) => {
        //console.log(value);
        this.people = value.people;
      },
      error: (err: any) => {
        console.error(err);
        this.errorLoading = true;
      }
    });
  }*/
}
