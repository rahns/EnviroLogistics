// Adapted from https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/

import React from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

export default function MapBox({ height, width, mapState }) {
    const mapContainer = React.useRef(null);
    const map = React.useRef(null);
    const [markers, setMarkers] = React.useState([])

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
        
    });

    React.useEffect(() => {
        map.current.setCenter([144.946457, -37.840935]);
        map.current.setZoom(9);
        for (let i = 0; i < markers.length; i++) { markers[i].remove() }; // remove existing markers
        if (mapState && mapState.markerCoords){
            let markerList = []
            for (let i = 0; i < mapState.markerCoords.length; i++) {
                // Create a new marker.
                markerList.push(new mapboxgl.Marker()
                .setLngLat([mapState.markerCoords[i][0], mapState.markerCoords[i][1]])
                .addTo(map.current));
            }
            setMarkers(markerList);
        }
        if (mapState && mapState.controls) {
            mapState.controls.forEach((element) => {
                let control = element.control;
                let position = element.position;
                if (!map.current.hasControl(control)) {
                    // At this point we're assuming controls are never removed
                    map.current.addControl(control, position);
                }
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapState])  // Runs only when mapState changes
    
    return (
        <div>
            <div ref={mapContainer} style={{height: height, width: width, borderRadius: "13px"}} />
        </div>
    )
}
