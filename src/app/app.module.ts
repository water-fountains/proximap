import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode } from '@angular/core';
import { NgRedux, NgReduxModule, DevToolsExtension } from '@angular-redux/store';


import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MapComponent } from './map/map.component';
import { ListComponent } from './list/list.component';
import { IAppState, INITIAL_STATE, rootReducer } from './store';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { MapConfig } from './map/map.config';
import { FormsModule } from '@angular/forms';
import { DetailComponent } from './detail/detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { MediaMatcher } from '@angular/cdk/layout';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { FilterComponent } from './filter/filter.component';
import 'hammerjs';
import { NgxGalleryModule } from 'ngx-gallery';
import { DirectionsComponent } from './directions/directions.component';
import {GalleryGuideComponent, GuideSelectorComponent, ImageGuideComponent} from './guide/guide.component';
import { FountainPropertyComponent } from './fountain-property/fountain-property.component';
import { FountainPropertyDialogComponent } from './fountain-property-dialog/fountain-property-dialog.component';
import {TruncatePipe} from './pipes/truncate';
// Imports for Multilingual Integration
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import {RouterModule} from '@angular/router';
import { RouterComponent } from './router/router.component';


@NgModule({
  declarations: [
    AppComponent,
    DetailComponent,
    DirectionsComponent,
    FilterComponent,
    FountainPropertyComponent,
    FountainPropertyDialogComponent,
    GalleryGuideComponent,
    GuideSelectorComponent,
    ImageGuideComponent,
    ListComponent,
    MapComponent,
    MobileMenuComponent,
    NavbarComponent,
    TruncatePipe,
    LanguageSelectorComponent,
    RouterComponent,
    ],
    entryComponents: [
      GuideSelectorComponent,
      ImageGuideComponent,
      GalleryGuideComponent,
      FountainPropertyDialogComponent
    ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatToolbarModule,
    MatTooltipModule,
    NgReduxModule,
    NgxGalleryModule,
    RouterModule.forRoot([
      {
        path: ':city',
        component: RouterComponent
      },{
        path: '',
        redirectTo: '/zurich',
        pathMatch: 'full'
    }
    ]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    TranslateModule,
    RouterModule
  ],
  providers: [
    DataService,
    ListComponent,
    MapConfig,
    MediaMatcher
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
