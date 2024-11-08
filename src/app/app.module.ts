import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApiModule } from './lib/usda/api.module'
import { Configuration } from './lib/usda/configuration';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AlertAuthGuard } from './guards/auth-guard.service';
import { MarketService } from './services/market.service';
import { DealService } from './services/deal.service';
import { EatsLocationsService } from './services/eats-locations.service';
import { LoginAuthGuard } from './guards/login-guard.service';

export function apiKeyGetter():Configuration {
  return new Configuration({ apiKeys: {api_key: "T0CUqfUYUm7HhgRPz7Uuga8IbscMIQ8xaeVblGSC" } });
}
@NgModule({ declarations: [
        AppComponent,
    ],
    bootstrap: [AppComponent],
    imports: [
      BrowserModule,
      IonicModule.forRoot(),
      AppRoutingModule,
      ApiModule.forRoot(apiKeyGetter),
      BrowserAnimationsModule,
      ServiceWorkerModule.register('/assets/js/ngsw-worker.js', { enabled: environment.production })], providers: [
      ApiService,
      AuthService,
      AlertAuthGuard,
      LoginAuthGuard,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      MarketService,
      EatsLocationsService,
      ApiService,
      DealService,
      provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}
