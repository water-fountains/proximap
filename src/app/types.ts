export interface PropertyMetadata {
  essential: boolean,
  type: string,
  src_pref: Array<string>,
  src_config: Object,
  name: string,
  value: any,
  comment: string,
  status: string,
  source: string
}

export interface PropertyMetadataCollection{
  [propName: string]: PropertyMetadata,
}
