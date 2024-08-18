export interface EnergyData {
  tariff: string;
  unit: string;
  interval: number;
  data: {
    date: Date;
    value: number;
  }[];
}
