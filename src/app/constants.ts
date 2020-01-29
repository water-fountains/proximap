/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import {FilterData} from './types';
import {FeatureCollection} from 'geojson';
import {MatSnackBarConfig} from '@angular/material';

export const propertyStatuses = {
  ok: 'PROP_STATUS_OK',
  info: 'PROP_STATUS_INFO',
  warning: 'PROP_STATUS_WARNING'
};

// same value as defined in datablue. Issue datablue#27
export const PROP_VAL_UNDEFINED = 'PROP_VAL_UNDEFINED';

export const defaultFilter: FilterData = {
  text: '',
  onlyInView: false,
  onlyNotable: false,
  onlyOlderYoungerThan: {
    active: false,
    mode: "before",
    date: 1700
  },
  showRemoved: false,
  swimmingPlace: false,
  waterType: {
    active: false,
    value: 'springwater'
  },
  photo: {
    active: false,
    mode: 'with'
  },
  potable: {
    active: false,
    strict: true
  },
  access_wheelchair: {
    active: false,
    strict: true
  },
  access_pet: {
    active: false,
    strict: true
  },
  access_bottle: {
    active: false,
    strict: true
  }
};

export const WaterTypes = [
  'springwater',
  'groundwater',
  'tapwater',
  'own_supply'
];

export const EmptyFountainCollection:FeatureCollection = {
  features: [],
  type: 'FeatureCollection'
};

export const DialogConfig = {
  width: '800px',
  height:  '100vh',
  maxWidth: '1000',
  maxHeight: '100vh',
  // hasBackdrop: false,
};

export const IntroDialogConfig = {
  // width: '80vw',
  // height: '80vh',
  hasBackdrop: false,
};

export const SnackbarConfig:MatSnackBarConfig = {
  // duration: 5000
};

export const hideIntroVar = 'hideIntroVar';
