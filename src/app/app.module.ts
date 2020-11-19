import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ApiModule } from './lib/usda/api.module'
import { Configuration } from './lib/usda/configuration';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    ApiModule.forRoot(() => new Configuration({ apiKeys: {api_key: "T0CUqfUYUm7HhgRPz7Uuga8IbscMIQ8xaeVblGSC"} })),
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ApiService,
    AuthService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
