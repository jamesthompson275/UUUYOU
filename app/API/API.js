const _SERVER = "//greensland.space/"
window.API = {
    /**
    *	@return Promise<Object[]> Each Entry contains lat, lng, and label
    */
	GetMarkerLocations: (coords) => {
        const { lat, lng, threshold } = coords;
        return fetch(_SERVER  + "nearbyItems?lat=" + lat + "&lng=" + lng + "&thresh=" + threshold)
            .then(response => response.json())
            // .then(response => response.filter(x => true))
            // Filter out unchecked items
            .then(response => response.reduce((carry, item) => {
                if (!carry.find(x => item.park == x.park)) {
                    carry.push(item);
                }
                return carry;
            }, []))
            .then(response => response.map(x => ({
                 position: {
                     lat: +x.latitude,
                     lng: +x.longitude
                },
                label: x.park
            })));
    }
};
