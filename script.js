var map = L.map("map").setView([11.2378, 125.0014], 13);

L.tileLayer(
"https://tile.openstreetmap.org/{z}/{x}/{y}.png",
{
    maxZoom: 22,
    attribution: "© OpenStreetMap"
}
).addTo(map);

let campusLayer;
let allMarkers = [];

function updateLegend(data){

    const legendList = document.getElementById("legendList");

    legendList.innerHTML = "";

    data.features.forEach(function(feature){

        if(feature.properties && feature.properties.name){

            let li = document.createElement("li");

            li.innerHTML = "📍 " + feature.properties.name;

            li.onclick = function(){
                goToLocation(feature.properties.name);
            };

            legendList.appendChild(li);

        }

    });

}

function showPlaceInfo(feature){

    document.getElementById("placeName").innerHTML =
    feature.properties.name;

    document.getElementById("placeDescription").innerHTML =
    `
    ${feature.properties.image ?
    `<img src="${feature.properties.image}" class="place-img">`
    : ""}

    <p>
    ${feature.properties.description || "No description available."}
    </p>
    `;

}

function loadCampus(file){

    if(campusLayer){
        map.removeLayer(campusLayer);
    }

    allMarkers = [];

    fetch(file)
    .then(function(response){

        if(!response.ok){
            throw new Error("GeoJSON file not found: " + file);
        }

        return response.json();

    })
    .then(function(data){

        updateLegend(data);

        campusLayer = L.geoJSON(data, {

            onEachFeature: function(feature, layer){

                if(feature.properties && feature.properties.name){

                    allMarkers.push({
                        name: feature.properties.name,
                        marker: layer,
                        feature: feature
                    });

                    layer.bindPopup(feature.properties.name);

                    layer.on("click", function(){
                        showPlaceInfo(feature);
                    });

                }

            }

        }).addTo(map);

        map.fitBounds(campusLayer.getBounds());

    })
    .catch(function(error){

        console.log(error);
        alert("GeoJSON failed to load. Check file path or filename.");

    });

}

function goToLocation(name){

    const found = allMarkers.find(function(item){
        return item.name === name;
    });

    if(found){

        if(found.marker.getLatLng){

            map.setView(
                found.marker.getLatLng(),
                19
            );

        }

        found.marker.openPopup();
        showPlaceInfo(found.feature);

    }

}

loadCampus("waypoints/Independencia.geojson");

document
.getElementById("campusSelector")
.addEventListener("change", function(){

    document.getElementById("searchBox").value = "";
    loadCampus(this.value);

});

document
.getElementById("searchBox")
.addEventListener("keyup", function(){

    let searchValue = this.value.toLowerCase();

    if(searchValue === ""){
        return;
    }

    const found = allMarkers.find(function(item){

        return item.name
        .toLowerCase()
        .includes(searchValue);

    });

    if(found){

        if(found.marker.getLatLng){

            map.setView(
                found.marker.getLatLng(),
                19
            );

        }

        found.marker.openPopup();
        showPlaceInfo(found.feature);

    }

});

function updateTime(){

    const options = {
        weekday:"long",
        year:"numeric",
        month:"long",
        day:"numeric",
        hour:"numeric",
        minute:"2-digit",
        second:"2-digit"
    };

    document.getElementById("clock").innerHTML =
    new Date().toLocaleString("en-PH", options);

}

updateTime();

setInterval(updateTime, 1000);

setTimeout(function(){
    map.invalidateSize();
}, 300);