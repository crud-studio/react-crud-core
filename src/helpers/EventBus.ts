import {EventBus} from "ts-bus";
import {createEventDefinition} from "ts-bus";

export const eventBus = new EventBus();
eventBus.emitter.setMaxListeners(100);

export const EventRequestCacheClearedKey = "requestCacheCleared";

export const eventRequestCacheCleared = createEventDefinition<{
  cacheName: string;
}>()(EventRequestCacheClearedKey);
