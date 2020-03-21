/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 *
 * Each time you change the datablue/config/fountain.properties.js, you need to run
 *     
 *   ~/git/proximap$ npm run fountain_properties
 */

// import fountain_properties.json from assets folder.
const fountainPropertiesJSON = require('./../assets/fountain_properties.json');

export const fountain_properties = fountainPropertiesJSON;