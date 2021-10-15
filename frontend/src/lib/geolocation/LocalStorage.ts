
class LocalStorage{

    get(key){
        let result;
        try{
            result = window.localStorage.getItem(key);
        }catch(e){
            return null;
        }

        return result;
    }

    set(key, value){
        console.log("calling window.localStorage.set with key", key, " and value", value);
        try{
            window.localStorage.setItem(key, value);
        }catch(e){
            console.log("localStorage setItem failed", e);
            return false;
        }
        return true;
    }

    clear(){
        try{
            window.localStorage.clear();
        }catch(e){
            console.log("localStorage clear failed", e);
        }
    }
}


export enum LocalStorageKeys  {
    geo_location_state = "geo_location_state",
    geo_location_successfully_activated = "geo_location_successfully_activated",
}

export const localStorage = new LocalStorage();