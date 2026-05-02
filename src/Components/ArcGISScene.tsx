import { loadModules } from "esri-loader";
import React, { ReactNode, useEffect, useMemo, useState } from "react";

interface IArcGISSceneProps {
    className?: string;
    loaderOptions?: {
        url?: string;
    };
    mapProperties?: Record<string, any>;
    viewProperties?: Record<string, any>;
    children?: ReactNode;
}

const ArcGISScene = (props: IArcGISSceneProps) => {
    const [map, setMap] = useState<any>(null);
    const [view, setView] = useState<any>(null);
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
        let cancelled = false;
        let sceneView: any = null;

        loadModules(["esri/Map", "esri/views/SceneView"], {
            url: props.loaderOptions?.url,
            css: true,
        })
            .then(([ArcGISMap, SceneView]) => {
                if (cancelled) {
                    return;
                }

                const createdMap = new ArcGISMap(mapProperties);
                sceneView = new SceneView({
                    map: createdMap,
                    container: containerId,
                    ...viewProperties,
                });

                setMap(createdMap);
                setView(sceneView);
            })
            .catch((err: any) => console.error(err));

        return () => {
            cancelled = true;
            if (sceneView) {
                sceneView.destroy();
            }
            setMap(null);
            setView(null);
        };
    }, [containerId, mapProperties, props.loaderOptions?.url, viewProperties]);

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
