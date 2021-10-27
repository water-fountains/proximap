import { ParamMap } from '@angular/router';

export function getSingleStringQueryParam(paramMap: ParamMap, paramName: string): string;
export function getSingleStringQueryParam(paramMap: ParamMap, paramName: string, isOptional: true): string | undefined;
export function getSingleStringQueryParam(
  paramMap: ParamMap,
  paramName: string,
  isOptional = false
): string | undefined {
  return getSingleQueryParamTypeOfCheck(paramMap, paramName, isOptional, 'string');
}

export function getSingleNumericQueryParam(paramMap: ParamMap, paramName: string): number;
export function getSingleNumericQueryParam(paramMap: ParamMap, paramName: string, isOptional: true): number | undefined;
export function getSingleNumericQueryParam(
  paramMap: ParamMap,
  paramName: string,
  isOptional = false
): number | undefined {
  return getSingleQueryParam(
    paramMap,
    paramName,
    isOptional,
    'number',
    v => isNumeric(v),
    v => Number(v)
  );
}

function isNumeric(v: string | undefined): boolean {
  if (typeof v === 'number') return true;
  if (typeof v !== 'string') return false;
  return (
    // we also use parseFloat next to Number because Number returns 0 for a blank string and we don't want to accept a blank string
    // on the other hand parseFloat accepts things like `10 bananas` which we also don't want, thus the combination
    !isNaN(Number(v)) && !isNaN(parseFloat(v))
  );
}

export function getSingleNumberQueryParam(paramMap: ParamMap, paramName: string): number;
export function getSingleNumberQueryParam(paramMap: ParamMap, paramName: string, isOptional: true): number | undefined;
export function getSingleNumberQueryParam(
  paramMap: ParamMap,
  paramName: string,
  isOptional = false
): number | undefined {
  return getSingleQueryParamTypeOfCheck(paramMap, paramName, isOptional, 'numberic');
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
  return getSingleQueryParamTypeOfCheck(paramMap, paramName, isOptional, 'boolean');
}

function getSingleQueryParamTypeOfCheck<T>(
  paramMap: ParamMap,
  paramName: string,
  isOptional: boolean,
  type: string
): T | undefined {
  return getSingleQueryParam(
    paramMap,
    paramName,
    isOptional,
    type,
    v => typeof v === type,
    v => v as unknown as T
  );
}

function getSingleQueryParam<T>(
  paramMap: ParamMap,
  paramName: string,
  isOptional: boolean,
  type: string,
  typeCheck: (v: string | undefined) => boolean,
  typeConversion: (v: string | undefined) => T
): T | undefined {
  const arr: string[] = paramMap.getAll(paramName);
  if (arr.isEmpty() && isOptional) {
    return undefined;
  } else if (arr.length > 1) {
    throw Error(`${paramName} is not a single parameter, was ${JSON.stringify(arr)} ${typeof arr}`);
  } else {
    const v = arr[0];
    if (typeCheck(v)) {
      return typeConversion(v);
    } else {
      throw Error(`${paramName} was of a wrong type, expected ${type} was ${JSON.stringify(v)} ${typeof v}`);
    }
  }
}
