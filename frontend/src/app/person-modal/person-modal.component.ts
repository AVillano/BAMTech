import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AstronautDuty } from '../interfaces/astronautduty';
import { AstronautDutyService } from '../services/astronaut-duty.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-person-modal',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './person-modal.component.html',
  styleUrl: './person-modal.component.css'
})
export class PersonModalComponent {
  public visible: boolean = false;
  public name: string = "";
  public astronautDuties: AstronautDuty[] = [];

  private astronautDutySubscription$: Subscription = Subscription.EMPTY;
  // I want to stress that I would never do this in production
  private preloadedData: any = {};

  constructor(private astronautDutyService: AstronautDutyService) {}

  ngOnInit(): void {
    // this.name = "Manfred";
    // this.astronautDutySubscription$ = this.astronautDutyService.getAstronautDutiesByName(this.name).subscribe({
    //   next: (value: any) => {
    //     console.log(value);
    //     //this.astronautDuties = value.astronautDuties;
    //   },
    //   error: (err: any) => {
    //     console.error(err);
    //     //this.errorLoading = true;
    //   },
    //   complete: () => {
    //     //this.visible = !this.visible;
    //   }
    // });
  }

  preloadData(name: string, data: any): void {
    this.preloadedData[name] = data;
  }

  openModal(name: string): void {
    // this.name = name;
    // this.astronautDutySubscription$ = this.astronautDutyService.getAstronautDutiesByName(this.name).subscribe({
    //   next: (value: any) => {
    //     console.log(value);
    //     //this.astronautDuties = value.astronautDuties;
    //   },
    //   error: (err: any) => {
    //     console.error(err);
    //     //this.errorLoading = true;
    //   },
    //   complete: () => {
    //     //this.visible = !this.visible;
    //   }
    // });
    this.name = name;
    this.astronautDuties = this.preloadedData[this.name] as AstronautDuty[];
    this.toggleVisibility();
  }

  toggleVisibility(): void {
    this.visible = !this.visible;
  }

  ngOnDestroy(): void {
    if (this.astronautDutySubscription$) {
      this.astronautDutySubscription$.unsubscribe();
    }
  }
}
