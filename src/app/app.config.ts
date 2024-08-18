import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { EnergyDataService } from './energyData.service';
import { EnergyDataProcessingService } from './energy-data-processing.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    EnergyDataService,
    EnergyDataProcessingService
  ]
};
