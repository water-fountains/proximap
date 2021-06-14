/*
 * @license
 * (c) Copyright 2019 - 2020 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 *
 * Each time you change the datablue/config/fountain.properties.js, you need to run
 *     
 *   ~/git/proximap$ npm run sync_datablue for=fountains
 */

// import fountain_properties.json from assets folder.
import * as fountainPropertiesJSON from './../assets/fountain_properties.json';

export const fountain_properties = fountainPropertiesJSON;
