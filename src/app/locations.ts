/*
 * @license
 * (c) Copyright 2019 - 2020 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 *
 * Each time you change the datablue/config/locations.js, you need to run
 *
 *   ~/git/proximap$ npm run sync_datablue for=locations
 */

// import location.json from assets folder.
import * as locationsJSON from './../assets/locations.json';

export const locations = locationsJSON;
