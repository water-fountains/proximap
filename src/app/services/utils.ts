import { ParamMap } from '@angular/router';

export function getSingleStringQueryParam(paramMap: ParamMap, paramName: string): string;
export function getSingleStringQueryParam(paramMap: ParamMap, paramName: string, isOptional: true): string | undefined;
export function getSingleStringQueryParam(
  paramMap: ParamMap,
  paramName: string,
  isOptional = false
): string | undefined {
  return getSingleQueryParam(paramMap, paramName, isOptional, 'string');
}

export function getSingleNumberQueryParam(paramMap: ParamMap, paramName: string): number;
export function getSingleNumberQueryParam(paramMap: ParamMap, paramName: string, isOptional: true): number | undefined;
export function getSingleNumberQueryParam(
  paramMap: ParamMap,
  paramName: string,
  isOptional = false
): number | undefined {
  return getSingleQueryParam(paramMap, paramName, isOptional, 'number');
}

export function getSingleBooleanQueryParam(paramMap: ParamMap, paramName: string): boolean;
export function getSingleBooleanQueryParam(
  paramMap: ParamMap,
  paramName: string,
  isOptional: true
): boolean | undefined;
export function getSingleBooleanQueryParam(
  paramMap: ParamMap,
  paramName: string,
  isOptional = false
): boolean | undefined {
  return getSingleQueryParam(paramMap, paramName, isOptional, 'boolean');
}

function getSingleQueryParam<T>(
  paramMap: ParamMap,
  paramName: string,
  isOptional: boolean,
  type: string
): T | undefined {
  const arr: string[] = paramMap.getAll(paramName);
  if (arr.isEmpty() && isOptional) {
    return undefined;
  } else if (arr.length > 1) {
    throw Error(`${paramName} is not a single parameter, was ${JSON.stringify(arr)} ${typeof arr}`);
  } else {
    const v = arr[0];
    if (typeof v === type) {
      return v as unknown as T;
    } else {
      throw Error(`${paramName} was of a wrong type, expected ${type} was ${JSON.stringify(v)} ${typeof v}`);
    }
  }
}
