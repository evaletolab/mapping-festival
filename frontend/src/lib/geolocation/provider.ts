export class Provider
{
    private listeners: ((x) => void)[] = [];
    
    _broadcastValue (value) {
        this.listeners.forEach(l => l(value));
    }

    addListener(listener){
        this.listeners.push(listener);
    }

    removeListener(listener) {
        const index = this.listeners.indexOf(listener);
        if (index >= 0) {
            this.listeners.splice(index, 1);
        }
    }

    provide(value) {
        this._broadcastValue(value);
    }
}

export const flyToProvider = new Provider();