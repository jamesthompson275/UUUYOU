const _SERVER = "//greensland.space/"
window.API = {
    /**
    *	@return Promise<Object[]> Each Entry contains lat, lng, and label
    */
	GetMarkerLocations: (coords) => {
        const { lat, lng, threshold } = coords;
        return fetch(_SERVER  + "nearbyItems?lat=" + lat + "&lng=" + lng + "&thresh=" + threshold)
            .then(response => response.json());
    }
};
