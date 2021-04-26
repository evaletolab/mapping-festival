
function createMapEventProvider(){
    let listeners = [];

    let map = null;

    function _broadcastCoords (coords) {
        listeners.forEach( l => l(coords));
    }

    function onClick(e){
        // console.log("MapEventProvider: onClick", e);
        _broadcastCoords({
            type: 'click',
            screenCoords: e.point,
            coordinates: e.lngLat
        });
    }

    function onTouchStart(e) {
        // console.log("touchstart", e);
        _broadcastCoords({
            type: 'touchstart',
            screenCoords: e.point,
            coordinates: e.lngLat
        });
    }

    function onTouchMove(e){
        // console.log("touchstart", e);
        _broadcastCoords({
            type: 'touchmove',
            screenCoords: e.point,
            coordinates: e.lngLat
        });
    }

    function onMouseMove(e) {
        // console.log("touchstart", e);
        _broadcastCoords({
            type: 'mousemove',
            screenCoords: e.point,
            coordinates: e.lngLat
        });
    }

    function onMouseDown(e) {
        // console.log("mousedown", e);
        _broadcastCoords({
            type: 'mousedown',
            screenCoords: e.point,
            coordinates: e.lngLat
        });
    }

    function onZoom(e) {
        // console.log("zoom", e.target.transform.tileZoom);
        _broadcastCoords({
            type: 'zoom',
            zoom: e.target.transform.tileZoom,
        });
    }
    
    function onDragStart(e) {
        // console.log("zoom", e.target.transform.tileZoom);
        _broadcastCoords({
            type: 'dragstart',
        });
    }

    function cleanup() {
        if (!map) return;

        console.log("cleaning up map provider-----------------")
        map.off('click', onClick);
        map.off('touchstart', onTouchStart);
        map.off('touchmove', onTouchMove);
        map.off('mousemove', onMouseMove);
        map.off('mousedown', onMouseDown);
        map.off('zoom', onZoom);
        map.off('dragstart', onDragStart);

        // listeners = [];
    }

    let result = {
        addListener: (listener) => {
            console.log("---------------------------------------adding map event listener", listener);
            listeners.push(listener);
        },
        removeListener: (listener) => {
            const index = listeners.indexOf(listener);
            console.log("attempting to remove map event listener", listener, "index", index, "listeners", listeners);
            if(index >= 0){
                console.log("removing map event listener", listener);
                listeners.splice(index, 1);
            }
        },
        initMap:(newMap) => {
            console.log("mapEventProvider: attempting new map init");
            if(map == newMap) return;

            cleanup();

            // console.log("initing map", newMap);
            map = newMap;
            map.on('click', onClick);
            map.on('touchstart', onTouchStart); 
            map.on('touchmove', onTouchMove);
            map.on('mousemove', onMouseMove);
            map.on('mousedown', onMouseDown);
            map.on('zoom', onZoom);
            map.on('dragstart', onDragStart);
            // console.log("inited map click provider");
        }
    }

    return result;
}

export const mapEventProvider = createMapEventProvider();