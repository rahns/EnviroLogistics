// Adapted from https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/

import React from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { MapState } from '../Classes';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

export default function MapBox({ height, width, mapState }) {
    const mapContainer = React.useRef(null);
    const map = React.useRef(null);
    const [mapReady, setMapReady] = React.useState(false);
    const [currentMapState, setCurrentMapState] = React.useState(undefined);

    const updateMap = () => {
        if (currentMapState) {
            for (let i = 0; i < currentMapState.markers.length; i++) { currentMapState.markers[i].remove(); console.log('done removing markers') }; // remove existing markers
            for (let i = 0; i < currentMapState.paths.length; i++) {if (map.current.getSource(i.toString())) {map.current.removeLayer(i.toString()); map.current.removeSource(i.toString()); console.log('done removing paths')}} // remove any existing path lines on the map
        }

        if (mapState) {
            if (mapState.markers) {
                for (let i = 0; i < mapState.markers.length; i++) {
                    mapState.markers[i].addTo(map.current);
                }
            }
            if (mapState.paths) {
                for (let i = 0; i < mapState.paths.length; i++) {
                    map.current.addSource(i.toString(), 
                    {
                        'type': 'geojson',
                        'data': {
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                            'type': 'LineString',
                            'coordinates': mapState.paths[i][0]
                            }
                        }
                    });
                    map.current.addLayer({
                        'id': i.toString(),
                        'type': 'line',
                        'source': i.toString(),
                        'layout': {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        'paint': {
                            'line-color': mapState.paths[i][1],
                            'line-width': 8
                        }
                    });
                }
            }
            
            let bbox = mapState.getBoundingBox()
            if (bbox) {
                map.current.fitBounds(bbox, {padding: 60});
            }
            else {
                map.current.setCenter([144.946457, -37.840935]);
                map.current.setZoom(9);
            }
            
            setCurrentMapState(mapState);
        }
    }

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
        
        map.current.on('load', () => setMapReady(true))
    });

    React.useEffect(() => {
        if (mapReady && mapState instanceof MapState) {
            updateMap();   
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
    }, [mapState, mapReady])  // Runs only when mapState or mapReady changes
    
    return (
        <div>
            <div ref={mapContainer} style={{height: height, width: width, borderRadius: "13px"}} />
        </div>
    )
}
