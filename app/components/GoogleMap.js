let _Map = null;
let _mapMarkers = [];
let _markerCluster = null;
let serverData = [];

function initMap() {
    
}

const checkChanged = e => {
    const label = e.target.value;
    
    const found = _mapMarkers.find(x => x.label == label);
    if (!found) return;
    
    found.setVisible(!found.visible);
    _markerCluster.repaint();
}

const doMarkers = newMarkers => {
    if (_markerCluster) {
        for (var i = 0; i < _mapMarkers.length; i++) {
            _markerCluster.removeMarker(_mapMarkers[i]);
        }
    }
    _mapMarkers = newMarkers.map(x => new google.maps.Marker(x));
    _markerCluster = new MarkerClusterer(_Map,
        _mapMarkers,
        { 
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' ,
            ignoreHidden: true 
        }
    );
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
            threshold: Math.min(Math.max(Math.abs(north - south), Math.abs(west - east)), 0.1)
        })
        .then(response => response.reduce((carry, item) => {
            if (_Map.getZoom() >= 17) {
                carry.push(item);
                return carry;
            }
            
            if (!carry.find(x => item.park == x.park)) {
                carry.push(item);
            }
            return carry;
        }, []))
        .then(x => {
            serverData  = x.slice();
            return x;
        })
        .then(response => response.map(x => {
            const label = _Map.getZoom() >= 17 ? x.label : x.park;
            return {
                 position: {
                     lat: +x.latitude,
                     lng: +x.longitude
                },
                label: label
            }
        }))
        .then(x => {
            const checkboxContainer = document.getElementById("mapCheckboxes");
            checkboxContainer.innerHTML = "";
            const header = document.createElement("h1");
            header.innerText = "Filter By: ";
            checkboxContainer.appendChild(header);
            x.reduce((carry, item) => {
                if (!carry.find(i => i == item)) {
                    carry.push(item);
                }
                return carry;
            }, [])
            .forEach(x => {
                const check = document.createElement("input");
                check.type = "checkbox";
                check.value = x.label;
                check.id = x.label;
                check.addEventListener("change", checkChanged);
                
                
                const label = document.createElement("label");
                label.innerText = x.label;
                label.htmlFor = x.ItemID;
                
                const container = document.createElement("div");
                container.appendChild(check);
                container.appendChild(label);
                
                checkboxContainer.appendChild(container);
            })
            
            return x;
        })
        // .then(response => response.filter(x => true))
        // Filter out unchecked items
        .then(doMarkers)
        .catch(err => {
            throw new Error(err)
        });
    },
    GoTo: to => {
        _Map.setCenter(to.getPosition());
        _Map.setZoom(19);
        window.GoogleMap.AddMarkers();
    },
    GetRandom: () => {
        
        if (serverData.length) {
            const i = Math.floor(Math.random() * serverData.length);
            return {
                original: serverData[i],
                marker: _mapMarkers[i]
            };
        }
    }
}