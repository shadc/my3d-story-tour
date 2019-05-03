
import React, { useState, useEffect } from 'react';
import { loadModules  } from '@esri/react-arcgis';
import basemapdata from '../basemaps.json';

interface IProps{
    view: any,
    map: any
}

const Basemaps = (props: IProps) => {
    const [basemaps, setBasemaps] = useState();
    const [basemapsCSS, setBasemapsCSS] = useState('basemapsSlideup');

    useEffect(() => {

        loadModules(["esri/layers/WebTileLayer",  "esri/Basemap"]).
            then(([WebTileLayer, Basemap]) => {

                const basemapsArr = basemapdata.basemaps.map((b, index) => {
                    const wtl = new WebTileLayer({
                        urlTemplate: b.url,
                        subDomains: b.subDomains
                    });
                    return new Basemap({
                        baseLayers: [wtl],
                        title: b.id,
                        id: b.id,
                        type: "WebTiledLayer"
                        
                    });
                })
                setBasemaps(basemapsArr);
            }).catch((err) => console.error(err))

            //document.addEventListener('mousedown', handleClick, false);
            return () => {
                setBasemaps(null);
                //document.removeEventListener('mousedown', handleClick, false);
             }
    }, []);

    
    function handleClick(e: any) {
        e.preventDefault();
        if (e.currentTarget.tagName.toLowerCase() == 'a') {
            var elementPos = basemapdata.basemaps.map(function(x) {return x.id; }).indexOf(e.currentTarget.innerHTML);
            props.map.basemap = basemaps[elementPos];
        }        
        (basemapsCSS == 'basemapsSlideup') ? setBasemapsCSS('basemapsSlidedown') : setBasemapsCSS('basemapsSlideup');
      }

    return (
        <div className="basemap-buttons-container">

            <div className="esri-widget--button esri-widget esri-interactive" role="button" title="Change Basemap" onClick={handleClick}  >
                <span aria-hidden="true" role="presentation" className="esri-icon esri-icon-basemap"></span>
                <span className="esri-icon-font-fallback-text">Change Basemap</span>
            </div>

            <div className={basemapsCSS}>
                <ul className="basemapbuttons">
                    {basemapdata.basemaps.map((b, index) =>
                        <li key={index}>
                            <a onClick={handleClick} href="#">
                                {b.id}
                            </a>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
    
}
  
export default Basemaps;




