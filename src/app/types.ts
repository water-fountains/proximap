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
