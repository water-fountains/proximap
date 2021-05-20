/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { MatBadgeModule} from '@angular/material/badge';
import { MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { MatButtonModule} from '@angular/material/button';
import { MatCardModule} from '@angular/material/card';
import { MatCheckboxModule} from '@angular/material/checkbox';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MediaMatcher } from '@angular/cdk/layout';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { FilterComponent } from './filter/filter.component';
import 'hammerjs';
import { DirectionsComponent } from './directions/directions.component';
import {
  GuideSelectorComponent,
  NewFountainGuideComponent,
  NameGuideComponent,
  ImagesGuideComponent, PropertyGuideComponent
} from './guide/guide.component';
import { FountainPropertyComponent } from './fountain-property/fountain-property.component';
import { FountainPropertyBadgeComponent } from './fountain-property-badge/fountain-property-badge.component';
import { FountainPropertyDialogComponent } from './fountain-property-dialog/fountain-property-dialog.component';
import {TruncatePipe} from './pipes/truncate';
import { MinuteSecondsPipe } from './pipes/minute.seconds';
// Imports for Multilingual Integration
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StateSelectorComponent } from './state-selector/state-selector.component';
import {RouterModule} from '@angular/router';
import { RouterComponent } from './router/router.component';
import { CallToActionComponent } from './call-to-action/call-to-action.component';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import {IssueIndicatorComponent} from './issue-indicator/issue-indicator.component';
import { IssueListComponent} from './issue-list/issue-list.component';


// Locales
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeDe from '@angular/common/locales/de';
import localeIt from '@angular/common/locales/it';
import localeTr from '@angular/common/locales/tr';
import { IntroWindowComponent } from './intro-window/intro-window.component';
import { LegendComponent } from './legend/legend.component';
import { EscapeHtmlPipe } from './pipes/keep-html.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DetailComponent,
    DirectionsComponent,
    FilterComponent,
    EscapeHtmlPipe,
    FountainPropertyComponent,
    FountainPropertyBadgeComponent,
    FountainPropertyDialogComponent,
    GuideSelectorComponent,
    ImagesGuideComponent,
    IssueIndicatorComponent,
    IssueListComponent,
    NewFountainGuideComponent,
    PropertyGuideComponent,
    NameGuideComponent,
    ListComponent,
    MinuteSecondsPipe,
    MapComponent,
    MobileMenuComponent,
    NavbarComponent,
    TruncatePipe,
    StateSelectorComponent,
    RouterComponent,
    CallToActionComponent,
    IntroWindowComponent,
    LegendComponent
    ],
    entryComponents: [
      GuideSelectorComponent,
      ImagesGuideComponent,
      IssueListComponent,
      NameGuideComponent,
      PropertyGuideComponent,
      NewFountainGuideComponent,
      FountainPropertyDialogComponent,
      IntroWindowComponent
    ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    NgxGalleryModule,
    HttpClientModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    NgProgressModule.forRoot(),
    NgProgressHttpModule.forRoot(),
    NgReduxModule,
    RouterModule.forRoot([
      {
        path: ':city',
        component: RouterComponent
      },{
        path: '',
        redirectTo: '/ch-zh',
        pathMatch: 'full'
    }
    ], {useHash: false}),
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
    const enhancers = devTools.isEnabled() ? [devTools.enhancer()] : [];
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

// Register locales
registerLocaleData(localeFr, 'fr');
registerLocaleData(localeDe, 'de');
registerLocaleData(localeIt, 'it');
registerLocaleData(localeTr, 'tr');
