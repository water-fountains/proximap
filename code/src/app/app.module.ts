import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgRedux, NgReduxModule} from 'ng2-redux';


import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MapComponent } from './map/map.component';
import {YagaModule} from '@yaga/leaflet-ng2';
import { ListComponent } from './list/list.component';
import {IAppState, INITIAL_STATE, rootReducer} from './store';
import {HttpClientModule} from '@angular/common/http';
import {DataService} from './data.service';
import {MapConfig} from './map/map.config';





@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MapComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    YagaModule,
    NgReduxModule,
    HttpClientModule
  ],
  exports: [
    // YagaModule
  ],
  providers: [
    DataService,
    MapConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<IAppState>){
    ngRedux.configureStore(rootReducer, INITIAL_STATE);
  }
}
