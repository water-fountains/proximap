/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 *
 * Each time you change the datablue/config/locations.js, you need to run
 *     
 *   ~/git/proximap$ npm run locations
 */

// import location.json from assets folder.
const locationsJSON = require('./../assets/locations.json');

// GOOGLE API KEY
const googleApiKey = 'mykey';

// set const for gak(googleApiKey);
locationsJSON.gak =  googleApiKey;

export const locations = locationsJSON;
