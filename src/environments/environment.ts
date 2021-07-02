/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { sharedConstants } from '../app/shared-constants';

export const environment = {
  production: false,
  apiUrlBeta: '//localhost:3000/',
  apiUrlStable: '//localhost:3001/',
  mapboxApiKey: 'pk.eyJ1Ijoid2F0ZXItZm91bnRhaW5zIiwiYSI6ImNqZGZ1cDR4bTA5OGcyeGxuamYzZnI2c20ifQ.aE2ji5z01HuLBGXNYraZYQ',
  gak: sharedConstants.gak,
};
