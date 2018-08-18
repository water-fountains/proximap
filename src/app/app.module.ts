import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode } from '@angular/core';
import { NgRedux, NgReduxModule, DevToolsExtension } from '@angular-redux/store';


import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MapComponent } from './map/map.component';
import { ListComponent } from './list/list.component';
import { IAppState, INITIAL_STATE, rootReducer } from './store';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './data.service';
import { MapConfig } from './map/map.config';
import { FormsModule } from '@angular/forms';
import { DetailComponent } from './detail/detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { MediaMatcher } from '@angular/cdk/layout';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { FilterComponent } from './filter/filter.component';
import 'hammerjs';
import { NgxGalleryModule } from 'ngx-gallery';
import { DirectionsComponent } from './directions/directions.component';

// Imports for Multilingual Integration
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './/app-routing.module';
import { RouteCheckerService } from "./route-checker.service";





@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MapComponent,
    ListComponent,
    DetailComponent,
    MobileMenuComponent,
    FilterComponent,
    DirectionsComponent
  ],
  imports: [
    BrowserModule,
    NgReduxModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxGalleryModule,
    MatButtonModule, MatToolbarModule, MatMenuModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatSidenavModule, MatIconModule, MatDividerModule, MatListModule, MatDialogModule, MatCheckboxModule, MatSliderModule, MatExpansionModule, MatCardModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule
  ],
  exports: [
    TranslateModule
  ],
  providers: [
    DataService,
    MapConfig,
    MediaMatcher,
    RouteCheckerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    ngRedux: NgRedux<IAppState>,
    devTools: DevToolsExtension) {
    // When DevTools is active, the page shows up blank on browsers other than chrome
    let enhancers = devTools.isEnabled() ? [devTools.enhancer()] : [];
    ngRedux.configureStore(rootReducer, INITIAL_STATE, [], enhancers);

    // hide address bar after load
    // window.addEventListener("load",function() {
    //   setTimeout(function(){
    //     // This hides the address bar:
    //     window.scrollTo(0, 1);
    //   }, 0);
    // });
  }
}

// Multilingual HttpLoader
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
