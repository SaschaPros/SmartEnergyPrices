import { Injectable } from '@angular/core';
import { EnergyData } from './energydata';
import { GroupedData } from './groupedData';

@Injectable({
  providedIn: 'root'
})
export class EnergyDataProcessingService {

  processEnergyData(energyData: EnergyData): GroupedData[] {
    if (!energyData.data || energyData.data.length === 0) {
      return [];
    }

    const now = new Date();
    const interval = energyData.interval * 60 * 1000; // Convert interval to milliseconds
    const currentIntervalStart = new Date(Math.floor(now.getTime() / interval) * interval);

    // Filter data to include only entries from the current interval onwards
    const filteredData = energyData.data.filter(data => data.date >= currentIntervalStart);

    // Group data by price
    return this.groupDataByPrice(filteredData, interval);
  }

  private groupDataByPrice(data: { date: Date; value: number }[], interval: number): GroupedData[] {
    const groupedData: GroupedData[] = [];
    let currentGroup: GroupedData | null = null;

    for (const item of data) {
      if (currentGroup && currentGroup.value === item.value) {
        currentGroup.end = new Date(item.date.getTime() + interval);
      } else {
        if (currentGroup) {
          groupedData.push(currentGroup);
        }
        currentGroup = {
          start: item.date,
          end: new Date(item.date.getTime() + interval),
          value: item.value
        };
      }
    }

    if (currentGroup) {
      groupedData.push(currentGroup);
    }

    return groupedData;
  }
}
