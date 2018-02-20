import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode } from '@angular/core';
import {NgRedux, NgReduxModule, DevToolsExtension} from 'ng2-redux';


import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MapComponent } from './map/map.component';
import {MapProvider, YagaModule} from '@yaga/leaflet-ng2';
import { ListComponent } from './list/list.component';
import {IAppState, INITIAL_STATE, rootReducer} from './store';
import {HttpClientModule} from '@angular/common/http';
import {DataService} from './data.service';
import {MapConfig} from './map/map.config';
import {FormsModule} from '@angular/forms';
import { DetailComponent } from './detail/detail.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatFormFieldModule, MatInputModule, MatMenuModule, MatSelectModule, MatSidenavModule,
  MatToolbarModule
} from '@angular/material';
import {MediaMatcher} from '@angular/cdk/layout';





@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MapComponent,
    ListComponent,
    DetailComponent
  ],
  imports: [
    BrowserModule,
    YagaModule,
    NgReduxModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule, MatToolbarModule, MatMenuModule, MatInputModule, MatFormFieldModule, MatSidenavModule
  ],
  exports: [
    // YagaModule
  ],
  providers: [
    DataService,
    MapConfig,
    MapProvider,
    MediaMatcher
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    ngRedux: NgRedux<IAppState>,
    devTools: DevToolsExtension){
    let enhancers = isDevMode() ? [devTools.enhancer()]:[];
    ngRedux.configureStore(rootReducer, INITIAL_STATE, [], enhancers);
  }
}
