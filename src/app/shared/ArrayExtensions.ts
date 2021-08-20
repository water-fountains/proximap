/**
 * @author Tegonal GmbH
 * @license AGPL
 */

import { take } from 'lodash';
import { Observable, of, combineLatest, zip } from 'rxjs';
import { compareI18n } from '../core/compare';
import { illegalState } from '../shared/illegalState';

export {};

/**
 * @author Tegonal GmbH
 * @license AGPL
 */
declare global {
  interface Array<T> {
    /**
     * @author Tegonal GmbH
     * @license AGPL
     */
    searchUnique(this: T[], predicate: (value: T) => boolean): T;

    /**
     * @author Tegonal GmbH
     * @license AGPL
     */
    sequence<E>(this: Observable<E>[], operator?: (thisArr: Observable<T>[]) => Observable<T[]>): Observable<E[]>;

    /**
     * @author Tegonal GmbH
     * @license AGPL
     */
    sequenceLatest<E>(this: Observable<E>[]): Observable<E[]>;

    /**
     * @author Tegonal GmbH
     * @license AGPL
     */
    isEmpty(this: T[]): boolean;

    /**
     * @author Tegonal GmbH
     * @license AGPL
     */
    nonEmpty(this: T[]): boolean;

    /**
     * @author Tegonal GmbH
     * @license AGPL
     */
    take(number: number): T[];

    /**
     * @author Tegonal GmbH
     * @license AGPL
     */
    sortI18n<T>(this: T[], propertyAccessFn?: (x: T, y: T) => [string, string]): T[];

    /**
     * @author Tegonal GmbH
     * @license AGPL
     */
    groupBy<K>(this: T[], keyGetter: (input: T) => K): Map<K, T[]>;
  }
}

/**
 * @author Tegonal GmbH
 * @license AGPL
 */
Array.prototype.searchUnique = function <T>(this: T[], predicate: (value: T) => boolean): T {
  const result = this.find(predicate);
  if (result !== undefined) {
    return result;
  } else {
    illegalState('searched in array for unique match, nothing found', this, 'used predicate', predicate);
  }
};

/**
 * @author Tegonal GmbH
 * @license AGPL
 */
Array.prototype.sequence = function <T>(
  this: Observable<T>[],
  operator?: (thisArr: Observable<T>[]) => Observable<T[]>
): Observable<T[]> {
  if (this.length > 0) {
    if (operator === undefined) {
      operator = arr => zip(...arr);
    }
    return operator(this);
  } else {
    return of([]);
  }
};

/**
 * @author Tegonal GmbH
 * @license AGPL
 */
Array.prototype.sequenceLatest = function <T>(this: Observable<T>[]): Observable<T[]> {
  return this.sequence(arr => combineLatest(arr));
};

/**
 * @author Tegonal GmbH
 * @license AGPL
 */
Array.prototype.isEmpty = function <T>(this: T[]): boolean {
  return this.length === 0;
};

/**
 * @author Tegonal GmbH
 * @license AGPL
 */
Array.prototype.nonEmpty = function <T>(this: T[]): boolean {
  return !this.isEmpty();
};

/**
 * @author Tegonal GmbH
 * @license AGPL
 */
Array.prototype.take = function <T>(this: T[], number: number): T[] {
  return take(this, number);
};

/**
 * @author Tegonal GmbH
 * @license AGPL
 */
Array.prototype.sortI18n = function <T>(this: T[], propertyAccessFn?: (a: T, b: T) => [string, string]): T[] {
  return this.sort((a, b) => {
    const [as, bs] = propertyAccessFn ? propertyAccessFn(a, b) : ['' + a, '' + b];

    return compareI18n(as, bs);
  });
};

/**
 * @description
 * Takes an Array<V>, and a grouping function,
 * and returns a Map of the array grouped by the grouping function.
 *
 * @param this The receiver array of type V.
 * @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
 *                  K is generally intended to be a property key of V.
 *
 * @returns Map of the array grouped by the grouping function.
 *
 * @author Tegonal GmbH
 * @license AGPL
 */
Array.prototype.groupBy = function <K, V>(this: V[], keyGetter: (input: V) => K): Map<K, V[]> {
  const map = new Map<K, V[]>();
  this.forEach((item: V) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};
