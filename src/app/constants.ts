/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import {FilterData} from './types';

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
  waterType: {
    active: false,
    value: 'springwater'
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
