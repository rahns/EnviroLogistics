// Adapted from https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/

import React from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoicmFobnN0YXZhciIsImEiOiJjazA2YXBvODcwNzZlM2NuMHlyYWUxY3YzIn0.3PUdd2L5DSLXWYcUnosvaQ';

export default function Map({ height, width}) {
    const mapContainer = React.useRef(null);
    const map = React.useRef(null);

    React.useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [30.5, 50.5],
            zoom: 9
        });

        // Create a new marker.
        const marker = new mapboxgl.Marker()
            .setLngLat([30.5, 50.5])
            .addTo(map.current);
    });

    return (
        <div>
            <div ref={mapContainer} style={{height: height}} />
        </div>
    )
}
