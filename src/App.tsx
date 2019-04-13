import React, { useState } from 'react';
import './App.css';
import { Map, Scene } from '@esri/react-arcgis';
import GeoJSONLayer from 'esri/layers/GeoJSONLayer';
import { Polyline, Point } from 'esri/geometry';
import Graphic from 'esri/Graphic'


import Bookmarks from "./Components/Bookmarks";
import Header from "./Components/Header";
import RouteLayer from "./Components/RouteLayer";
import MapUtils from './Components/MapUtils';

const gist = "https://gist.githubusercontent.com/shadc/5f28c0d4f3d3fdf1e789/raw/c75003ffb71ebde28d05db9e6fafc0466a19de94/Bluebird%2520Day%2520at%2520Mt.%2520Bachelor.geojson";

interface ITour {
  map: any,
  routeLayer: GeoJSONLayer,
  picsLayer: GeoJSONLayer,
  splits: number,
  scales: number[],
  pointGraphic: Graphic,
  routeCoords: any,
  picCoords: any,
  routeNum: number,
  coordNum: number
}

const tour = {} as ITour;

const App = () => {
  const [title, setTitle] = useState('Loading Tour...');
  const [caption, setCaption] = useState('');

  const onStartTourClick = async () => {
    tour.routeNum = 1; //1 base;
    tour.coordNum = 0; //0 base;
    startRoute();
  }

  let interval: number;
  const startRoute = async () => {

    if (tour.map.graphics) tour.map.graphics.removeAll();

    tour.routeLayer.definitionExpression = "OBJECTID < " + tour.routeNum;
    const graphics = await MapUtils.getGraphics(tour.routeLayer, tour.routeNum);

    if (!graphics.length) {
      setTitle('');
      setCaption("The End!");
      return;
    }

    const featGeom = graphics[0].geometry as Polyline;
    tour.routeCoords = MapUtils.getRouteCoords(featGeom, tour.splits);
    setCaption(graphics[0].getAttribute("Caption"));

    tour.map.goTo(featGeom).then(() => {
      interval = window.setInterval(startRouteInterval, 4);
    })

  }

  const startRouteInterval = () => {

    //-- Move to the next route if at the end of the interval
    if (tour.coordNum > (tour.routeCoords.length - 1)) {
      clearInterval(interval);
      tour.coordNum = 0;
      tour.routeNum++;
      setTimeout(function () { startRoute(); }, 1000);
      return;
    }

    //Move the graphic
    const [longitude, latitude] = tour.routeCoords[tour.coordNum];
    const point = { type: "point", longitude, latitude } as Point;
    tour.pointGraphic.geometry = point;

    //-- Create Breadcrumb
    var graphic = tour.pointGraphic.clone();
    graphic.symbol.set('size', 1);
    graphic.geometry = point;
    tour.map.graphics.add(graphic);

    tour.coordNum++;
  }



  const setTour = async (routeLayer: GeoJSONLayer, picsLayer: GeoJSONLayer, map: any, pointGraphic: Graphic) => {
    tour.routeLayer = routeLayer;
    tour.picsLayer = picsLayer;
    tour.map = map;
    tour.pointGraphic = pointGraphic;
    tour.routeNum = 1, //1 base;
      tour.coordNum = 0, //0 base;
      tour.scales = MapUtils.getScales([4]);
    tour.splits = await MapUtils.getSplit(routeLayer); //.then(result => tour.splits = result);
  }



  const loaderOptions = { url: "http://js.arcgis.com/4.11" };

  return (
    <>
      <Header caption={caption} title={title} onClick={onStartTourClick} />
      <Bookmarks />

      <Scene
        loaderOptions={loaderOptions}
        className='mapcontainer'
        mapProperties={{ basemap: 'satellite', ground: "world-elevation" }}
        viewProperties={{
          center: [-121.6788, 44.0033],
          zoom: 12
        }}
      >
        <RouteLayer view={Scene} map={Map} gist={gist} setTour={setTour} />
      </Scene>

    </>
  );
}


export default App;
