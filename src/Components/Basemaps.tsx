
import { loadModules } from "@esri/react-arcgis";
import React, { useEffect, useState } from "react";
import basemapdata from "../basemaps.json";

interface IProps {
    view: any;
    map: any;
}

const Basemaps = (props: IProps) => {
    const [basemaps, setBasemaps] = useState();
    const [basemapsCSS, setBasemapsCSS] = useState("basemapsSlideup");

    useEffect(() => {

        loadModules(["esri/layers/WebTileLayer", "esri/Basemap"]).
            then(([WebTileLayer, Basemap]) => {

                const basemapsArr = basemapdata.basemaps.map((b, index) => {
                    const wtl = new WebTileLayer({
                        subDomains: b.subDomains,
                        urlTemplate: b.url,
                    });
                    return new Basemap({
                        baseLayers: [wtl],
                        id: b.id,
                        title: b.id,
                        type: "WebTiledLayer",

                    });
                });
                setBasemaps(basemapsArr);
                // tslint:disable-next-line: no-console
            }).catch((err) => console.log(err));
        // document.addEventListener('mousedown', handleClick, false);
        return () => {
            setBasemaps(null);
            // document.removeEventListener('mousedown', handleClick, false);
        };
    }, []);

    const handleClick = (e: any) => {
        e.preventDefault();
        if (e.currentTarget.tagName.toLowerCase() === "a") {
            const elementPos = basemapdata.basemaps.map((x) => x.id)
                .indexOf(e.currentTarget.innerHTML);
            props.map.basemap = basemaps[elementPos];
        }
        (basemapsCSS === "basemapsSlideup") ? setBasemapsCSS("basemapsSlidedown") : setBasemapsCSS("basemapsSlideup");
    };

    return (
        <>
            <div className="basemap-button-container">
                <div className="esri-widget--button esri-widget esri-interactive" role="button" title="Change Basemap" onClick={handleClick}>
                    <span aria-hidden="true" role="presentation" className="esri-icon esri-icon-basemap" />
                    <span className="esri-icon-font-fallback-text">Change Basemap</span>
                </div>
            </div>
            <div className={basemapsCSS}>
                <ul className="basemapbuttons">
                    {basemapdata.basemaps.map((b, index) =>
                        <li key={index}>
                            <a onClick={handleClick} href="#">
                                {b.id}
                            </a>
                        </li>,
                    )}
                </ul>
            </div>

        </>
    );

};

export default Basemaps;
