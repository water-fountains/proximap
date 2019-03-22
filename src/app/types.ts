/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

export interface PropertyMetadata {
  essential: boolean,
  type: string,
  description: string,
  src_pref: Array<string>,
  src_config: Object,
  name: string,
  value: any,
  comments: string,
  status: string,
  source: string
}

export interface PropertyMetadataCollection{
  [propName: string]: PropertyMetadata,
}

export interface QuickLink{
  name: string,
  value: string
}
