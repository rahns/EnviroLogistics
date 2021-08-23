// Adapted from https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/

import React from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoicmFobnN0YXZhciIsImEiOiJjazA2YXBvODcwNzZlM2NuMHlyYWUxY3YzIn0.3PUdd2L5DSLXWYcUnosvaQ';

export default function MapBox({ height, width, mapState}) {
    const mapContainer = React.useRef(null);
    const map = React.useRef(null);

    React.useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [144.946457, -37.840935],
            zoom: 9
        });

        console.log("Map initialised");

        map.current.addControl(new mapboxgl.NavigationControl());
        
        if (mapState.markerCoords){
            for (let i = 0; i < mapState.markerCoords.length; i++) {
                // Create a new marker.
                new mapboxgl.Marker()
                .setLngLat([mapState.markerCoords[i][0], mapState.markerCoords[i][1]])
                .addTo(map.current);
            }
        }
        
    });

    
    return (
        <div style={{overflow: "hidden"}}>
            <div ref={mapContainer} style={{height: height, width: width}} />
        </div>
    )
}
