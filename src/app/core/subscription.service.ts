import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * @author Tegonal GmbH
 * @license AGPL
 */
@Injectable()
export class SubscriptionService implements OnDestroy {
  private subscriptions = Array<Subscription>();
  private subjects = Array<Subject<any>>();

  public registerSubscriptions(...subscription: Subscription[]): void {
    this.subscriptions.push(...subscription);
  }

  public registerSubjects(...subjects: Subject<any>[]): void {
    this.subjects.push(...subjects);
  }

  ngOnDestroy(): void {
    this.cleanupSubscriptions();
  }

  public cleanupSubscriptions(): void {
    if (!environment.production) {
      console.log('cleanup ' + this.subscriptions.length + ' subscriptions and ' + this.subjects.length + ' subjects');
    }
    this.subscriptions.forEach(subscripton => subscripton.unsubscribe());
    this.subscriptions = [];
    this.subjects.forEach(subject => subject.complete());
    this.subjects = [];
  }
}
