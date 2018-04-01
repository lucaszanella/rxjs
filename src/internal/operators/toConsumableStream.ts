import { Operator } from '../Operator';
import { Subscriber } from '../Subscriber';
import { Observable } from '../Observable';
import { TeardownLogic } from '../Subscription';
import { MonoTypeOperatorFunction } from '../../internal/types';

export interface ConsumableObject {
  HasNext() : boolean;
  isClosed(): boolean;
  next()    : any;
}

//interface Pointer<T> {
//  pointer: T
//}

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

export function toConsumableStream<T>(consumable: ConsumableObject): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => source.lift(new ToConsumableStreamOperator(consumable));
}

class ToConsumableStreamOperator<T> implements Operator<T, T> {
  consumable: ConsumableObject;
  subscriber: ToConsumableStreamSubscriber<T>

  constructor(consumable: ConsumableObject) {
    this.consumable = consumable;
  }

  call(subscriber: Subscriber<T>, source: any): TeardownLogic {
    this.subscriber = new ToConsumableStreamSubscriber(subscriber, this.consumable)
    return source.subscribe(this.subscriber);
  }
}

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ToConsumableStreamSubscriber<T> extends Subscriber<T> {
  consumableSubscriberAwayting = true;
  consumable: ConsumableObject;

  emitNext = () => {
    this._next(this.consumable.next());
  }

  constructor(destination: Subscriber<T>, consumable: ConsumableObject) {
    super(destination);
    this.consumable = consumable;
  }

  protected _next(x: T) {
      this.destination.next(x);
  }
}
