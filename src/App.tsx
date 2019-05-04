import React, { useState } from 'react';
import './App.css';
import { Map, Scene } from '@esri/react-arcgis';
import GeoJSONLayer from 'esri/layers/GeoJSONLayer';
import { Polyline, Point, Extent } from 'esri/geometry';
import Graphic from 'esri/Graphic'

import Basemaps from "./Components/Basemaps";
import Header from "./Components/Header";
import RouteLayer from "./Components/RouteLayer";
import MapUtils from './Components/MapUtils';
import RoutePicture from './Components/RoutePicture';
import Slider from './Components/Slider';


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

const _tour = {} as ITour;

let _gist = "https://gist.githubusercontent.com/shadc/5f28c0d4f3d3fdf1e789/raw/4495bf6e4194adb1ce215c032c93c1fc8273e32a/Bluebird%2520Day%2520at%2520Mt.%2520Bachelor.geojson";
let _interval = 0;
let _sliderNum = 10;
let _sliderChanged = false;


const App = () => {
  const [title, setTitle] = useState();
  const [caption, setCaption] = useState('');
  const [pics, setPics] = useState([] as Graphic[]);
  const [picAction, setPicAction] = useState([0, '']);


  const droneView = MapUtils.getUrlVars('droneView') == 'true' ? true : false;
  const hidePhotos = MapUtils.getUrlVars('hidePhotos') == 'true' ? true: false;
  const geoJson = MapUtils.getUrlVars('geoJson') == 'false' ? _gist : MapUtils.getUrlVars('geoJson');

  const onStartTourClick = async () => {
    _tour.routeNum = 1; //1 base;
    _tour.coordNum = 0; //0 base;
    startRoute();
  }

  const startRoute = async () => {
    if (_tour.map.graphics) _tour.map.graphics.removeAll();
    _tour.routeLayer.definitionExpression = "OBJECTID < " + _tour.routeNum;
    const graphics = await MapUtils.getGraphics(_tour.routeLayer, _tour.routeNum);

    if (!graphics.length) {
      setCaption('');
      return;
    }

    const featGeom = graphics[0].geometry as Polyline;
    _tour.routeCoords = MapUtils.getRouteCoords(featGeom, _tour.splits);
    setCaption(graphics[0].getAttribute("Caption"));

    _tour.picIndexes = await MapUtils.getPicRouteIndex(_tour.routeCoords, graphics[0].getAttribute("Route"), _tour.picsLayer);

    if (droneView) {
      _interval = window.setInterval(startRouteInterval, intTime(_sliderNum));
    } else {
      _tour.map.goTo(featGeom).then(() => {
        _interval = window.setInterval(startRouteInterval, intTime(_sliderNum));
      })
    }

  }


  let picIndex: number = 1;
  const startRouteInterval = () => {

    //-- Move to the next route if at the end of the interval
    if (_tour.coordNum > (_tour.routeCoords.length - 1)) {
      clearInterval(_interval);
      _tour.coordNum = 0;
      _tour.routeNum++;
      setTimeout(function () { startRoute(); }, 1000);
      return;
    }

    if (_sliderChanged) {
      clearInterval(_interval);
      _interval = window.setInterval(startRouteInterval, intTime(_sliderNum));
      _sliderChanged = false;
    }

    //-- Move the graphic
    const [longitude, latitude] = _tour.routeCoords[_tour.coordNum];
    const point = { type: "point", longitude, latitude } as Point;
    _tour.pointGraphic.geometry = point;

    //-- Create Breadcrumb
    const graphic = _tour.pointGraphic.clone();
    graphic.symbol.set('size', 1);
    graphic.geometry = point;
    _tour.map.graphics.add(graphic);

    if (droneView && _tour.coordNum % 2 && _tour.map.stationary) {
      const point1 = (_tour.coordNum > 10) ? _tour.routeCoords[_tour.coordNum - 10] : _tour.routeCoords[_tour.coordNum];
      const point2 = (_tour.coordNum < _tour.routeCoords.length - 10) ? _tour.routeCoords[_tour.coordNum + 10] : _tour.routeCoords[_tour.coordNum];
      let heading = MapUtils.getHeading(point1, point2);

      _tour.map.goTo({
        center: [longitude, latitude],
        zoom: 16,
        heading: heading,
        tilt: (_tour.map.camera.tilt > 1) ? _tour.map.camera.tilt : 60
      },
        {
          speedFactor: .9, // animation is 10 times slower than default
          easing: "linear" // easing function to slow down when reaching the target
        }
      );
    }

    //-- Collide with picture???
    if (!hidePhotos && _tour.picIndexes.includes(_tour.coordNum)) {
      clearInterval(_interval);
      setPicAction([picIndex, 'active']);
      setTimeout(function () {
        setPicAction([picIndex, 'deactive']);
        setTimeout(function () {
          _interval = window.setInterval(startRouteInterval, intTime(_sliderNum));
          picIndex++;
        }, 1000);
      }, 4000);
    }
    _tour.coordNum++;
  }

  const setTour = async (routeLayer: GeoJSONLayer, picsLayer: GeoJSONLayer, map: any, pointGraphic: Graphic) => {
    _tour.routeLayer = routeLayer;
    _tour.picsLayer = picsLayer;
    _tour.map = map;
    _tour.pointGraphic = pointGraphic;
    _tour.routeNum = 1, //1 base;
    _tour.coordNum = 0, //0 base;
    _tour.scales = MapUtils.getScales([4]);
    _tour.splits = await MapUtils.getSplit(routeLayer); //.then(result => _tour.splits = result);

    routeLayer.queryExtent().then((response : Extent) =>{
      _tour.map.goTo(response.extent.expand(2), {easing : 'in-out-expo'})
    })

    setPics(((await picsLayer.queryFeatures()).features as Graphic[]));
    const filename = decodeURI(decodeURI(geoJson.substring(geoJson.lastIndexOf('/') + 1)));
    setTitle(filename.substr(0, filename.lastIndexOf('.')) || filename);
  }

  const scales = [4] // Start at 4 because it's the minimum milliseconds HTML 5 setinterval spec will go.
  for (let i = 0; i < 19; i++) {
    const ts = scales[0];
    const scaleVal = (ts * ((ts / 100) + 1.03))
    scales.unshift(scaleVal);
  }

  const intTime = (val: number) => {
    return scales[val - 1]
  }

  const sliderChange = (num: any) => {
    _sliderNum = num;
    _sliderChanged = true;
  }


  const loaderOptions = { url: "https://js.arcgis.com/4.11" };
  return (
    <>
      <Header caption={caption} title={title} onClick={onStartTourClick} />

      <Scene
        loaderOptions={loaderOptions}
        className='mapcontainer'
        mapProperties={{ ground: "world-elevation" }} //basemap: 'satellite',
        viewProperties={{
          //center: [-121.6788, 44.0033],
          zoom: 2
        }}
      >
        <Slider handleChange={sliderChange} initSliderVal={_sliderNum} />
        <RouteLayer view={Scene} map={Map} gist={geoJson} setTour={setTour} />
        <Basemaps view={Scene} map={Map} />
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
