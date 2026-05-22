var map=L.map('map').setView(
[11.2448,125.0034],
18
);


L.tileLayer(

'https://tile.openstreetmap.org/{z}/{x}/{y}.png',

{

maxZoom:22

}

).addTo(map);



const places=[

{

name:"HRDC Gymnasium",

description:
"Gymnasium used for university events and sports.",

coords:[11.2450,125.0030]

},

{

name:"Administration Building",

description:
"Main administration office of LNU.",

coords:[11.2445,125.0037]

},

{

name:"Library",

description:
"University library and study area.",

coords:[11.2442,125.0033]

}

];



places.forEach(place=>{

let marker=
L.marker(place.coords)
.addTo(map);

marker.bindPopup(
place.name
);


marker.on(
"click",
function(){

document.getElementById(
"placeName"
).innerHTML=
place.name;


document.getElementById(
"placeDescription"
).innerHTML=
place.description;

});

});





function updateTime(){

const now=
new Date();


const options={

weekday:'long',

year:'numeric',

month:'long',

day:'numeric',

hour:'numeric',

minute:'numeric',

second:'numeric'

};


document.getElementById(
"pstTime"
).innerHTML=

now.toLocaleString(
'en-PH',
options
);

}


setInterval(
updateTime,
1000
);

updateTime();




document
.getElementById(
"searchBox"
)

.addEventListener(

"keyup",

function(){

let value=
this.value.toLowerCase();

let found=
places.find(

place=>

place.name
.toLowerCase()

.includes(
value
)

);

if(found){

map.setView(
found.coords,
20
);

document.getElementById(
"placeName"
).innerHTML=
found.name;

document.getElementById(
"placeDescription"
).innerHTML=
found.description;

}

});

setTimeout(()=>{

map.invalidateSize();

},300);

function goToWaypoint(name) {
    const waypoint = allMarkers.find(item => item.name === name);

    if (waypoint) {
        map.setView(waypoint.marker.getLatLng(), 19);
        waypoint.marker.openPopup();

        document.getElementById("placeTitle").textContent = waypoint.name;
        document.getElementById("placeImage").src = waypoint.image;
    }

}
