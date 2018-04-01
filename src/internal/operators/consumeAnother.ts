import { Operator } from '../Operator';
import { Subscriber } from '../Subscriber';
import { Observable } from '../Observable';
import { TeardownLogic } from '../Subscription';
import { MonoTypeOperatorFunction } from '../../internal/types';

/**
 * Returns an Observable that skips the first `count` items emitted by the source Observable.
 *
 * <img src="./img/skip.png" width="100%">
 *
 * @param {Number} count - The number of times, items emitted by source Observable should be skipped.
 * @return {Observable} An Observable that skips values emitted by the source Observable.
 *
 * @method skip
 * @owner Observable
 */
export function consumeAnother<T>(): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => source.lift(new ConsumeAnotherOperator());
}

class ConsumeAnotherOperator<T> implements Operator<T, T> {
  constructor() {
  }

  call(subscriber: Subscriber<T>, source: any): TeardownLogic {
    let current: any;

    for(current = source; source.hasOwnProperty('source'); current = source.source) {
      if (current.hasOwnProperty('consumableSubscriberAwayting') && current.consumableSubscriberAwayting) {
        current.consumableSubscriberAwayting = false;
        return source.subscribe(new ConsumeAnotherSubscriber(subscriber, current));
      }
    }
    throw new TypeError("You used consumeAnother but there is no usage of the 'toConsumableStream' operator in the observables chain");
    //return source.subscribe(new ConsumeAnotherSubscriber(subscriber));
  }
}

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ConsumeAnotherSubscriber<T> extends Subscriber<T> {
  consumableSource: any;

  constructor(destination: Subscriber<T>, consumableSource?: any) {
    super(destination);
    consumableSource ? this.consumableSource = consumableSource : null;
  }

  protected _next(x: T) {
      this.destination.next(x);
      this.consumableSource.operator.consumable.hasNext() ? this.consumableSource.operator.consumable.emitNext() : null; //Makes the next item be emitted 
  }
}