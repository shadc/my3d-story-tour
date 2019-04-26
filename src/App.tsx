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
import RoutePicture from './Components/RoutePicture';
import { length } from '@turf/turf';

const gist = "https://gist.githubusercontent.com/shadc/5f28c0d4f3d3fdf1e789/raw/4495bf6e4194adb1ce215c032c93c1fc8273e32a/Bluebird%2520Day%2520at%2520Mt.%2520Bachelor.geojson";


interface ITour {
  map: any,
  routeLayer: GeoJSONLayer,
  picsLayer: GeoJSONLayer,
  splits: number,
  scales: number[],
  pointGraphic: Graphic,
  routeCoords: any,
  picIndexes: number[],
  routeNum: number,
  coordNum: number
}

const tour = {} as ITour;



const App = () => {
  const [title, setTitle] = useState();
  const [caption, setCaption] = useState('');
  const [pics, setPics] = useState([] as Graphic[]);
  const [picAction, setPicAction] = useState([0, '']);

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
      setCaption('');
      return;
    }

    const featGeom = graphics[0].geometry as Polyline;
    tour.routeCoords = MapUtils.getRouteCoords(featGeom, tour.splits);
    setCaption(graphics[0].getAttribute("Caption"));

    tour.picIndexes = await MapUtils.getPicRouteIndex(tour.routeCoords, graphics[0].getAttribute("Route"), tour.picsLayer);

    tour.map.goTo(featGeom).then(() => {
      interval = window.setInterval(startRouteInterval, 4);
    })

  }


  let picIndex : number = 1; 
  const startRouteInterval = () => {

    //-- Move to the next route if at the end of the interval
    if (tour.coordNum > (tour.routeCoords.length - 1)) {
      clearInterval(interval);
      tour.coordNum = 0;
      tour.routeNum++;
      setTimeout(function () { startRoute(); }, 1000);
      return;
    }

    //-- Move the graphic
    const [longitude, latitude] = tour.routeCoords[tour.coordNum];
    const point = { type: "point", longitude, latitude } as Point;
    tour.pointGraphic.geometry = point;

    //-- Create Breadcrumb
    const graphic = tour.pointGraphic.clone();
    graphic.symbol.set('size', 1);
    graphic.geometry = point;
    tour.map.graphics.add(graphic);

    //-- Collide with picture???
    if (tour.picIndexes.includes(tour.coordNum)) {
      clearInterval(interval);
      setPicAction([picIndex, 'active']);
      setTimeout(function () {
        setPicAction([picIndex, 'deactive']);
        setTimeout(function () {
          interval = window.setInterval(startRouteInterval, 4);
          picIndex++;
        }, 1000);
      }, 4000);
    }
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

    setPics(((await picsLayer.queryFeatures()).features as Graphic[]));
    const filename = decodeURI(decodeURI(gist.substring(gist.lastIndexOf('/')+1)));
    setTitle(filename.substr(0, filename.lastIndexOf('.')) || filename);
  }

  const loaderOptions = { url: "http://js.arcgis.com/4.11" };
  return (
    <>
      <Header caption={caption} title={title} onClick={onStartTourClick} />

      {/* <Bookmarks /> */}

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

      {<ul>
        {pics.map((pic, index) =>
          <RoutePicture
            key={index}
            height={(10 / (pics.length + 1) * (index + 1) * 10) + "vh"}
            id={index + 1}
            picAction={picAction}
            caption={pic.getAttribute("Caption")}
            img={"http://shadc.github.io/presentations/" + pic.getAttribute("Pic")}
          />
        )}
      </ul>}
      
    </>
  );
}


export default App;
