import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';



import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MapComponent } from './map/map.component';
import {YagaModule} from '@yaga/leaflet-ng2';




@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    YagaModule
  ],
  exports: [
    // YagaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
