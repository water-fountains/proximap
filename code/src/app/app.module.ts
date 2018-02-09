import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';



import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MapComponent } from './map/map.component';
import {YagaModule} from '@yaga/leaflet-ng2';
import { ListComponent } from './list/list.component';




@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MapComponent,
    ListComponent
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
