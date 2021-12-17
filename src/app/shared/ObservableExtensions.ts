/**
 * @author Tegonal GmbH
 * @license AGPL
 */

import { BehaviorSubject, Observable, OperatorFunction, pipe, Subscription, UnaryFunction } from 'rxjs';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';
import { SubscriptionService } from '../core/subscription.service';

declare module 'rxjs/internal/Observable' {
  interface Observable<T> {
    /**
     * @author Tegonal GmbH
     * @license AGPL
     */
    map<R>(f: (value: T) => R): Observable<R>;

    /**
     * @author Tegonal GmbH
     * @license AGPL
     */
    mapToBehavior<R>(f: (value: T) => R, r: R, subscriptionService: SubscriptionService): BehaviorSubject<R>;

    /**
     * @author Tegonal GmbH
     * @license AGPL
     */
    tap(next?: (x: T) => void, error?: (e: any) => void, complete?: () => void): Observable<T>;

    /**
     * @author Tegonal GmbH
     * @license AGPL
     */
    debug(key: string): Observable<T>;

    /**
     * @author Tegonal GmbH
     * @license AGPL
     */
    switchMap<R>(f: (value: T) => Observable<R>): Observable<R>;

    /**
     * @author Tegonal GmbH
     * @license AGPL
     */
    search<E>(this: Observable<E[]>, predicate: (value: E) => boolean): Observable<E | undefined>;

    /**
     * @author Tegonal GmbH
     * @license AGPL
     */
    searchUnique<E>(this: Observable<E[]>, predicate: (value: E) => boolean): Observable<E>;

    /**
     * @author Tegonal GmbH
     * @license AGPL
     */
    subscribeOnce<E>(
      this: Observable<E>,
      next: (value: E) => void,
      error?: (error: any) => void,
      complete?: () => void
    ): Subscription;
  }
}

/**
 * @author Tegonal GmbH
 * @license AGPL
 */
Observable.prototype.map = function <T, R>(this: Observable<T>, f: (value: T) => R): Observable<R> {
  return this.pipe(map(f));
};

/**
 * @author Tegonal GmbH
 * @license AGPL
 */
Observable.prototype.mapToBehavior = function <T, R>(
  this: Observable<T>,
  f: (value: T) => R,
  r: R,
  subscriptionService: SubscriptionService
): BehaviorSubject<R> {
  const behaviorSubject = new BehaviorSubject<R>(r);
  subscriptionService.registerSubjects(behaviorSubject);
  subscriptionService.registerSubscriptions(this.pipe(map(f)).subscribe(behaviorSubject));
  return behaviorSubject;
};

/**
 * @author Tegonal GmbH
 * @license AGPL
 */
Observable.prototype.tap = function <T>(
  this: Observable<T>,
  next?: (x: T) => void,
  error?: (e: any) => void,
  complete?: () => void
): Observable<T> {
  return this.pipe(tap(next, error, complete));
};

/**
 * @author Tegonal GmbH
 * @license AGPL
 */
Observable.prototype.debug = function <T>(this: Observable<T>, key: string) {
  return this.tap(
    x => console.log(key, 'next', x),
    x => console.log(key, 'error', x),
    () => console.log(key, 'complete')
  );
};

/**
 * @author Tegonal GmbH
 * @license AGPL
 */
Observable.prototype.switchMap = function <T, R>(this: Observable<T>, f: (value: T) => Observable<R>): Observable<R> {
  return this.pipe(switchMap(f));
};

/**
 * @author Tegonal GmbH
 * @license AGPL
 */
Observable.prototype.search = function <E>(
  this: Observable<E[]>,
  predicate: (value: E) => boolean
): Observable<E | undefined> {
  return this.map(arr => arr.find(predicate));
};

/**
 * @author Tegonal GmbH
 * @license AGPL
 */
Observable.prototype.searchUnique = function <E>(
  this: Observable<E[]>,
  predicate: (value: E) => boolean
): Observable<E> {
  return this.map(arr => arr.searchUnique(predicate));
};
/**
 * @author Tegonal GmbH
 * @license AGPL
 */
Observable.prototype.subscribeOnce = function <E>(
  this: Observable<E>,
  next: (value: E) => void,
  error?: (error: any) => void,
  complete?: () => void
): Subscription {
  return this.pipe(first()).subscribe(next, error, complete);
};

/**
 * @author Tegonal GmbH
 * @license AGPL
 */
export function filterUndefined<T>(): UnaryFunction<Observable<T | undefined>, Observable<T>> {
  return pipe(filter(x => x !== undefined) as OperatorFunction<T | undefined, T>);
}
