import React, { Component } from 'react';
import { loadModules  } from '@esri/react-arcgis';


const Bookmarks = () => (
    <div className="btn-group">
        <button className="btn btn-sm dropdown-toggle basemap-button" data-toggle="dropdown">
            <span className="glyphicon glyphicon-th" aria-hidden="true"></span>
        </button>

        <ul className="dropdown-menu">
            <li>
                <a href="#" data-options='{ "id": "MapBox Run/Bike/Hike", "visible": false, "subDomains": ["a", "b", "c", "d"], "copyright": "MapBox" }'
                    data-url="http://{subDomain}.tiles.mapbox.com/v4/mapbox.run-bike-hike/${level}/${col}/${row}.png?access_token=pk.eyJ1Ijoic2hhZGMiLCJhIjoiZjRUSnJTYyJ9.gUL3T1N9m_twjfHArn-UNw">
                    MapBox Run/Bike/Hike
                </a>
            </li>
            <li>
                <a href="#" data-options='{ "id": "MapBox Outdoors", "visible": false, "subDomains": ["a", "b", "c", "d"], "copyright": "MapBox" }'
                    data-url="http://{subDomain}.tiles.mapbox.com/v4/mapbox.outdoors/${level}/${col}/${row}.png?access_token=pk.eyJ1Ijoic2hhZGMiLCJhIjoiZjRUSnJTYyJ9.gUL3T1N9m_twjfHArn-UNw">
                    MapBox Outdoors
                </a>
            </li>
            <li>
                <a href="#" data-options='{ "id": "MapBox Dark", "visible": false, "subDomains": ["a", "b", "c", "d"], "copyright": "MapBox" }'
                    data-url="http://{subDomain}.tiles.mapbox.com/v4/mapbox.dark/${level}/${col}/${row}.png?access_token=pk.eyJ1Ijoic2hhZGMiLCJhIjoiZjRUSnJTYyJ9.gUL3T1N9m_twjfHArn-UNw">
                    MapBox Dark
                </a>
            </li>
            <li>
                <a href="#" data-options='{"id": "National Geographic", "visible": false, "subDomains": ["services", "server"],
        "copyright": "National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC"}'
                    data-url="http://{subDomain}.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/${level}/${row}/${col}">
                    National Geographic
                </a>
            </li>
            <li>
                <a href="#" data-options='{"id": "Esri World Imagery", "visible": true, "subDomains": ["services", "server"],
            "copyright": "Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community "}'
                    data-url="http://{subDomain}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${level}/${row}/${col}">
                    Esri World Imagery
                </a>
            </li>
            <li>
                <a href="#" data-options='{"id": "Esri World Topo", "visible": false, "subDomains": ["services", "server"],
        "copyright": "Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community "}'
                    data-url="http://{subDomain}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${level}/${row}/${col}">
                    Esri World Topo
                </a>
            </li>
            <li>
                <a href="#" data-options='{"id": "Esri Street Map", "visible": false, "subDomains": ["services", "server"],
        "copyright": "Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community "}'
                    data-url="http://{subDomain}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/${level}/${row}/${col}">
                    Esri Street Map
                </a>
            </li>
            <li>
                <a href="#" data-options='{ "id": "Stamen Watercolor", "visible": false, "subDomains": ["a", "b", "c", "d"], "copyright": "Stamen Watercolor" }'
                    data-url="http://{subDomain}.tile.stamen.com/watercolor/${level}/${col}/${row}.jpg">
                    Stamen Watercolor
                </a>
            </li>
            <li>
                <a href="#" data-options='{ "id": "Open Cycle Map", "visible": false, "subDomains": ["a", "b", "c"], "copyright": "Open Cycle Map" }'
                    data-url="http://{subDomain}.tile.opencyclemap.org/cycle/${level}/${col}/${row}.png">
                    Open Cycle Map
                </a>
            </li>
            <li>
                <a href="#" data-options='{ "id": "Open Street Map", "visible": false, "subDomains": ["a", "b", "c"], "copyright": "Open Street Maps" }'
                    data-url="https://{subDomain}.tile.openstreetmap.org/${level}/${col}/${row}.png">
                    Open Street Map
                </a>
            </li>
            <li>
                <a href="#" data-options='{ "id": " Open Topo Map", "visible": false, "subDomains": ["a", "b", "c"], "copyright": "Open Topo Map" }'
                    data-url=" https://{subDomain}.tile.opentopomap.org/${level}/${col}/${row}.png">
                    Open Topo Map
                </a>
            </li>
            <li>
                <a href="#" data-options='{ "id": "Thunderforest Outdoors", "visible": false, "subDomains": ["a", "b", "c"], "copyright": "Thunderforest" }'
                    data-url=" https://{subDomain}.tile.thunderforest.com/outdoors/${level}/${col}/${row}.png?apikey=a5dd6a2f1c934394bce6b0fb077203eb">
                    Thunderforest Outdoors
                </a>
            </li>
            <li>
                <a href="#" data-options='{ "id": "Thunderforest Spinal Map", "visible": false, "subDomains": ["a", "b", "c"], "copyright": "Thunderforest" }'
                    data-url=" https://{subDomain}.tile.thunderforest.com/spinal-map/${level}/${col}/${row}.png?apikey=a5dd6a2f1c934394bce6b0fb077203eb">
                    Thunderforest Spinal Map
                </a>
            </li>
            <li>
                <a href="#" data-options='{ "id": " Deschutes County Imagery", "visible": false, "copyright": " Deschutes County Imagery" }'
                    data-url="https://maps.deschutes.org/arcgis/rest/services/Dial/DOQ_Deschutes_1ft/MapServer/tile/${level}/${row}/${col}">
                    Deschutes County Imagery
                </a>
            </li>
        </ul>


    </div>
  );
  
  export default Bookmarks;


