import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode } from '@angular/core';
import {NgRedux, NgReduxModule, DevToolsExtension} from 'ng2-redux';


import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MapComponent } from './map/map.component';
import { ListComponent } from './list/list.component';
import {IAppState, INITIAL_STATE, rootReducer} from './store';
import {HttpClientModule} from '@angular/common/http';
import {DataService} from './data.service';
import {MapConfig} from './map/map.config';
import {FormsModule} from '@angular/forms';
import { DetailComponent } from './detail/detail.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatDialogRef, MatDividerModule, MatExpansionModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatSidenavModule, MatSliderModule,
  MatToolbarModule
} from '@angular/material';
import {MediaMatcher} from '@angular/cdk/layout';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { FilterComponent } from './filter/filter.component';
import 'hammerjs';





@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MapComponent,
    ListComponent,
    DetailComponent,
    MobileMenuComponent,
    FilterComponent
  ],
  imports: [
    BrowserModule,
    NgReduxModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule, MatToolbarModule, MatMenuModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatSidenavModule, MatIconModule, MatDividerModule, MatListModule, MatDialogModule, MatCheckboxModule, MatSliderModule, MatExpansionModule, MatCardModule
  ],
  exports: [
  ],
  providers: [
    DataService,
    MapConfig,
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
