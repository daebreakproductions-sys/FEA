import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ApiModule } from './lib/usda/api.module'
import { Configuration } from './lib/usda/configuration';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AuthGuard } from './guards/auth-guard.service';
import { MarketService } from './services/market.service';
import { DealService } from './services/deal.service';

export function apiKeyGetter():Configuration {
  return new Configuration({ apiKeys: {api_key: "T0CUqfUYUm7HhgRPz7Uuga8IbscMIQ8xaeVblGSC" } });
}
@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        ApiModule.forRoot(apiKeyGetter),
        BrowserAnimationsModule,
        HttpClientModule,
        ServiceWorkerModule.register('/assets/js/ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [
        ApiService,
        AuthService,
        AuthGuard,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        MarketService,
        ApiService,
        DealService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
