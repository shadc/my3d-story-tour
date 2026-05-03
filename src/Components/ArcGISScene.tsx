import "@arcgis/core/assets/esri/themes/light/main.css";
import ArcGISMap from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import React, { ReactNode, useEffect, useMemo, useState } from "react";

interface IArcGISSceneProps {
    className?: string;
    mapProperties?: Record<string, any>;
    viewProperties?: Record<string, any>;
    children?: ReactNode;
}

const ArcGISScene = (props: IArcGISSceneProps) => {
    const [map, setMap] = useState<ArcGISMap | null>(null);
    const [view, setView] = useState<SceneView | null>(null);
    const containerId = useMemo(() => `arcgis-scene-${Math.random().toString(36).slice(2, 10)}`, []);

    const mapProperties = useMemo(
        () => props.mapProperties || { ground: "world-elevation" },
        [props.mapProperties],
    );
    const viewProperties = useMemo(
        () => props.viewProperties || { zoom: 2 },
        [props.viewProperties],
    );

    useEffect(() => {
        const createdMap = new ArcGISMap(mapProperties);
        const sceneView = new SceneView({
            map: createdMap,
            container: containerId,
            ...viewProperties,
        });

        setMap(createdMap);
        setView(sceneView);

        return () => {
            sceneView.destroy();
            setMap(null);
            setView(null);
        };
    }, [containerId, mapProperties, viewProperties]);

    return (
        <div id="base-container" className={props.className} style={{ width: "100%", height: "100%", position: "relative" }}>
            <div id={containerId} style={{ position: "absolute", inset: 0 }} />
            {map && view
                ? React.Children.map(props.children, (child) => {
                    if (!React.isValidElement(child)) {
                        return child;
                    }
                    return React.cloneElement(child, { map, view } as any);
                })
                : null}
        </div>
    );
};

export default ArcGISScene;
