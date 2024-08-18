import { HttpClient } from "@angular/common/http";
import { EnergyData } from "./energydata";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class EnergyDataService {
  constructor(private httpClient: HttpClient) {};

  getEnergyData(): Observable<EnergyData> {
    return this.httpClient.get<EnergyData>('/market/v1/price', {
      headers: {}
    });
  }
}
