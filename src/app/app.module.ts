/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgRedux, DevToolsExtension, NgReduxModule } from '@angular-redux/store';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { ListComponent } from './list/list.component';
import { IAppState, INITIAL_STATE, rootReducer } from './store';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DataService } from './data.service';
import { MapConfig } from './map/map.config';
import { FormsModule } from '@angular/forms';
import { DetailComponent } from './detail/detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MediaMatcher } from '@angular/cdk/layout';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { FilterComponent } from './filter/filter.component';
import { DirectionsComponent } from './directions/directions.component';
import {
  GuideSelectorComponent,
  NewFountainGuideComponent,
  NameGuideComponent,
  ImagesGuideComponent,
  PropertyGuideComponent,
} from './guide/guide.component';
import { FountainPropertyComponent } from './fountain-property/fountain-property.component';
import { FountainPropertyBadgeComponent } from './fountain-property-badge/fountain-property-badge.component';
import { FountainPropertyDialogComponent } from './fountain-property-dialog/fountain-property-dialog.component';
import { TruncatePipe } from './pipes/truncate';
import { MinuteSecondsPipe } from './pipes/minute.seconds';
import { StateSelectorComponent } from './state-selector/state-selector.component';
import { RouterModule } from '@angular/router';
import { RouterComponent } from './router/router.component';
import { CallToActionComponent } from './call-to-action/call-to-action.component';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { IssueIndicatorComponent } from './issues/issue-indicator.component';
import { IssueListComponent } from './issues/issue-list.component';

import { IntroWindowComponent } from './intro-window/intro-window.component';
import { LegendComponent } from './legend/legend.component';
import { EscapeHtmlPipe } from './pipes/keep-html.pipe';
import { GoogleMaterialModule } from './core/google-material.module';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { NgProgressModule } from '@ngx-progressbar/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NavbarComponent } from './navbar/navbar.component';
import { LanguageSelectorComponent } from './core/language-selector.component';
import { LanguageService } from './core/language.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IssueService } from './issues/issue.service';
import { UserLocationService } from './map/user-location.service';
import { LayoutService } from './core/layout.service';

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
    LegendComponent,
    LanguageSelectorComponent,
  ],
  entryComponents: [
    GuideSelectorComponent,
    ImagesGuideComponent,
    IssueListComponent,
    NameGuideComponent,
    PropertyGuideComponent,
    NewFountainGuideComponent,
    FountainPropertyDialogComponent,
    IntroWindowComponent,
  ],
  imports: [
    GoogleMaterialModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    NgxGalleryModule,
    NgProgressModule.forRoot(),
    NgProgressHttpModule.forRoot(),
    NgReduxModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: ':city',
        component: RouterComponent,
      },
      {
        path: '',
        redirectTo: '/ch-zh',
        pathMatch: 'full',
      },
    ]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [RouterModule, TranslateModule, NavbarComponent, LanguageSelectorComponent],
  providers: [
    TranslateService,
    LanguageService,
    DataService,
    ListComponent,
    MapConfig,
    MediaMatcher,
    IssueService,
    UserLocationService,
    LayoutService,
  ],
  bootstrap: [AppComponent],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {
  constructor(ngRedux: NgRedux<IAppState>, devTools: DevToolsExtension) {
    // When DevTools is active, the page shows up blank on browsers other than chrome
    const enhancers = devTools.isEnabled() ? [devTools.enhancer()] : [];
    ngRedux.configureStore(rootReducer, INITIAL_STATE, [], enhancers);
  }
}

// Multilingual HttpLoader
// AoT requires an exported function for factories
function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
