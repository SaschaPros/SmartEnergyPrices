import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgFor, NgIf, DatePipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { EnergyDataService } from './energyData.service'; // Correct import
import { EnergyData } from './energydata'; // Correct import

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'electricityPrices';
  energyData$!: Observable<EnergyData>;
  groupedData$!: Observable<any[]>;
  errorMessage = '';

  constructor(private energyDataService: EnergyDataService) {}

  ngOnInit() {
    this.energyData$ = this.energyDataService.getEnergyData().pipe(
      catchError(err => {
        this.errorMessage = 'An error occurred while fetching data. Please try again later.';
        console.error('Error:', err); // Debugging statement
        return of({} as EnergyData); // Provide an empty object as a default value
      }),
      startWith({} as EnergyData) // Start with an empty object while loading
    );

    this.groupedData$ = this.energyData$.pipe(
      map(energyData => {
        if (!energyData.data) {
          return [];
        }

        const now = new Date();
        const interval = energyData.interval * 60 * 1000; // Convert interval to milliseconds
        const currentIntervalStart = new Date(Math.floor(now.getTime() / interval) * interval);

        // Filter data to include only entries from the current interval onwards
        const filteredData = energyData.data.filter(data => new Date(data.date) >= currentIntervalStart);

        // Group data by price
        const groupedData = [];
        let currentGroup = null;

        for (const data of filteredData) {
          if (currentGroup && currentGroup.value === data.value) {
            currentGroup.end = new Date(new Date(data.date).getTime() + interval);
          } else {
            if (currentGroup) {
              groupedData.push(currentGroup);
            }
            currentGroup = {
              start: new Date(data.date),
              end: new Date(new Date(data.date).getTime() + interval),
              value: data.value
            };
          }
        }

        if (currentGroup) {
          groupedData.push(currentGroup);
        }

        return groupedData;
      })
    );
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
}
