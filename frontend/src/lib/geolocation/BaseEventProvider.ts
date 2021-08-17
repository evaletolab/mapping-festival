
export interface MyEvent {
    type: string,
    value: any,
}

export type Listener = (e: MyEvent) => void;

export class BaseEventProvider
{
    private listenersMap = new Map<string, Listener[]> ();

    _broadcastEvent (event: MyEvent) {
        const listeners: Listener[] = this.listenersMap.get(event.type) as Listener[];
        if(listeners){
            listeners.forEach((l: Listener) => l(event));
        }
    }

    addEventListener(eventType: string, listener: Listener){
        if(!eventType) return;

        console.log("adding event", eventType, listener);
        if(this.listenersMap.get(eventType)){
            (this.listenersMap.get(eventType)as Listener[]).push(listener);
        }else{
            console.log("creating type");
            this.listenersMap.set(eventType, [listener]);
        }
    }
    
    removeEventListener(eventType: string, listener: Listener) {
        if(!eventType) return;

        if(this.listenersMap.get(eventType)){
            let listeners = this.listenersMap.get(eventType) as Listener[];
            console.log("removing event listener of type", eventType, "before size", listeners.length);
            const index = listeners.indexOf(listener);
            if (index >= 0) {
                listeners.splice(index, 1);
            }
            console.log("removing event listener of type", eventType, 
                        "after size", (this.listenersMap.get(eventType) as Listener[]).length);
        }
    }

    provide(eventType: string, value: any) {
        const event = {
            type: eventType,
            value,
        };
        this._broadcastEvent(event);
    }
}