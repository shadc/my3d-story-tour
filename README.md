

# My 3D Story Tour
The best way I can describe this is a mapping based temporal photo journal.  [The demo](https://shadc.github.io/my3d-story-tour/debug/index.html)
 follows my day skiing
at Mt. Bachelor, but you can create your own story.  [Follow along my demo](https://shadc.github.io/my3d-story-tour/debug/index.html) as I ski and take pictures of a great day on the mountain. 

[Check out drone view](https://shadc.github.io/my3d-story-tour/debug/index.html?droneView=yes). It's a work in progress, and might make you sick, but it is pretty cool.
<br /><br />
**Controls...** <br />
Change the basemap to some unusual choices... MapBox Outdoors is one of my favorites.
<br />
Control the speed of the tour using the slider
<br /><br />

**URL Parameters...** <br />
Drone View follows you as if there were a drone behind you.  Default is no. <br />
droneView=yes <br />
Hide photos will supress showing photos along your path.  Default is no. <br />
hidePhotos=yes<br />
GeoJson is the url to the geojson file containing your story.  Default displays a day skiing at Mt. Bachelor.<br />
geoJson=https://gist.githubusercontent.com/shadc/1f6f670d5eba9246e660/raw/0888a854d8e0b9125b47b2eb27e6988a2eee5b55/Bend%2520Ale%2520Trail%2520-%2520part%25201.geojson <br />

## The Data...
The data or story that drives the application is geojson and for the demo comes from a geojson GIST
hosted from GitHub, however, the data could be hosted anywhere.

For my demo, I used my Garmin GPS watch to track my location throughout the day and took pictures with my cell phone. 
That afternoon I used a python script [imgdir2geojson.py](https://github.com/quzma/imgdir-to-geojson) to convert my picture locations to geojson. I then imported that data
and the data from my GPS watch to geojson.io. I split the runs up and added some attributes and saved the file from geojson.io to 
my GitHub account as a GIST. The pictures are also hosted from GitHub. That was it.  

## Disclaimer

This a learning project using React and Typescript for me. It is also a hack to get the Esri JSAPI
to do this kind of animation. There are likely many things I did
incorrectly or that could be improved.  I'm happy for any suggestions on best practices,
improvments, etc that will improve the code and my understanding of JavaScript, TypeScript, 
CSS, or React.


<br /><br /><br />

## Build and Run

In the project directory, you can run:

### `npm run dev`

Starts the Vite development server.<br>
Open [http://localhost:5173](http://localhost:5173) to view the app.

### `npm run build`

Builds the app for production to the `dist` folder.

### `npm run preview`

Serves the production build locally for verification.
