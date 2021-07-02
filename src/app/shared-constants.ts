/*
 * @license
 * (c) Copyright 2020 - 2020 | MY-D Foundation | Created by Miroslav Stankovic, Ralf Hauser
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 *
 * Each time you change the datablue/server/shared-constants.js, you need to run
 *
 *   ~/git/proximap $ npm run sync_datablue for=constants
 */

// import fountain_properties.json from assets folder.
import * as sharedConstantsJSON from './../assets/shared-constants.json';

export const sharedConstants = sharedConstantsJSON;
