let _Map = null;
let _mapMarkers = [];
let _markerCluster = null;

function initMap() {
    
}

window.GoogleMap = {
    /**
        Makes a new map instance on the given target
        @param target HTMLElement The HTML element to mount the map onto
        @param config Object
        @param config.width the width of the target
        @param config.height the height of the target
        @param config.options The google map options
    */
	NewMap: (target, config) => {
        const { width, height, options } = config;
        
        _Map = new google.maps.Map(target, options);
        
        _Map.addListener('mouseup', function() {
            window.GoogleMap.AddMarkers();
        });
        window.addEventListener("resize", function() {
            google.maps.event.trigger(_Map, "resize");
        });
        
    },
	AddMarkers: () => {
        // Ping API endpoint
        const { north, east, west, south } = _Map.getBounds().toJSON();
        
        window.API.GetMarkerLocations({
            lat: _Map.center.lat(),
            lng: _Map.center.lng(),
            Math.min(threshold: Math.max(Math.abs(north - south), Math.abs(west - east)), 0.1)
        })
        .then(newMarkers => {
            if (_markerCluster) {
                for (var i = 0; i < _mapMarkers.length; i++) {
                    _markerCluster.removeMarker(_mapMarkers[i]);
                }
            }
            _mapMarkers = newMarkers.map(x => new google.maps.Marker(x));
            _markerCluster = new MarkerClusterer(_Map,
                _mapMarkers,
                { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' }
            );
        })
        .catch(err => {
            throw new Error(err)
        });
    }
}