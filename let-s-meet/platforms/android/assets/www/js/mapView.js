/*
	g00glemaps.stawrocek@gmail.com -> API key mail
	API_KEY -> AIzaSyCjSNcbxLngWgQHrHte2nyD24duvrp0xkQ
	Yep, I should't put it here for free, but it is a test application
*/

var searchTheaters = false;
var searchRestaurants = false;
var searchCinemas = false;
var locationX=51.5, locationY=-0.2; //London

var map;
var placesService;
var directionsDisplay;
var directionsService;

var vecTargets=[];
var vecRoutes=[];
var vecRoutesTargets=[];
var showAll=false;

function booleanToStr(x){
	if(x=="false")return false;
	if(x=="true")return true;
	return NaN;
}
 
function Target(typeStr, googleId){
	this.typeStr = typeStr;
	this.googleId = googleId;
	this.isEnabled = booleanToStr(localStorage.getItem(this.typeStr));
}

function RouteResult(response, destObj, travelType){
	this.response = response;
	this.destinationObject = destObj;
	this.travelType = travelType;
	this.time = response.routes[0].legs[0].duration.text;
	this.timeValue = response.routes[0].legs[0].duration.value;
	this.dist = response.routes[0].legs[0].distance.text;
}

function RouteTarget(destObj, travelType){
	this.destinationObject = destObj;
	this.travelType = travelType;
	this.returnedOK = false;
}

function OverQueryError(destObj, travelType){
	this.destinationObject = destObj;
	this.travelType = travelType;
}

function loadPage(){
	/*vecTargets.push(new Target("Museum", "museum"));
	vecTargets.push(new Target("Restaurant", "restaurant"));
	vecTargets.push(new Target("Cinema", "movie_theater"));
	vecTargets.push(new Target("Shop", "store"));*/
	vecTargets.push(new Target("Airport", "airport"));
	vecTargets.push(new Target("Art Gallery, art_gallery"));
	vecTargets.push(new Target("Atm", "atm"));
	vecTargets.push(new Target("Bakery", "bakery"));
	vecTargets.push(new Target("Bank", "bank"));
	vecTargets.push(new Target("Bar", "bar"));
	vecTargets.push(new Target("Bowling Alley", "bowling_alley"));
	vecTargets.push(new Target("Cafe", "cafe"));
	vecTargets.push(new Target("Cinema", "movie_theater"));
	vecTargets.push(new Target("Doctor", "doctor"));
	vecTargets.push(new Target("Fire Station", "fire_station"));
	vecTargets.push(new Target("Gas Station", "gas_station"));
	vecTargets.push(new Target("Gym", "gym"));
	vecTargets.push(new Target("Hospital", "hospital"));
	vecTargets.push(new Target("Library", "library"));
	vecTargets.push(new Target("Movie Rental", "movie_rental"));
	vecTargets.push(new Target("Museum", "museum"));
	vecTargets.push(new Target("Night Club", "night_club"));
	vecTargets.push(new Target("Park", "park"));
	vecTargets.push(new Target("Parking", "parking"));
	vecTargets.push(new Target("Pharmacy", "pharmacy"));
	vecTargets.push(new Target("Police", "police"));
	vecTargets.push(new Target("Post Office", "post_office"));
	vecTargets.push(new Target("Restaurant", "restaurant"));
	vecTargets.push(new Target("Shop", "store"));
	vecTargets.push(new Target("Shopping Mall", "shopping_mall"));
	vecTargets.push(new Target("Stadium", "stadium"));
	vecTargets.push(new Target("Subway Station", "subway_station"));
	vecTargets.push(new Target("Taxi Stand", "taxi_stand"));
}

function createGoogleMaps(){
	var mapOptions = {
		center: new google.maps.LatLng(51.5, -0.2),
		zoom: 16
	}
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	directionsDisplay = new google.maps.DirectionsRenderer;
	directionsDisplay.setMap(map);
	directionsService = new google.maps.DirectionsService;
	service = new google.maps.places.PlacesService(map);
	locationX = parseFloat(localStorage.getItem('locX'));
	locationY = parseFloat(localStorage.getItem('locY'));
	
	var geolocate = new google.maps.LatLng(locationX, locationY);
	createInfoWindow("You!", geolocate);
            
    map.setCenter(geolocate);
	setTimeout("findPlacesSelectedByUser();", 4000);
}

function loadMap(){
	$("#sortedLocations").hide();
}

function loadLocations(){
	$("#sortedLocations").show();
}

function drawRoute(response){
	directionsDisplay.setDirections(response);
}

function shortenName(name){
	return name.substr(0, 15)+"...";
}

function calcRouteToObjectAndTravelType(destObj, travelType, rtCtr){
	directionsService.route({
		origin: {lat: locationX, lng: locationY},
		destination: {placeId: destObj.place_id},
		travelMode: travelType
	}, 
	function(response, status) {
		if (status == 'OK') {
			var point = response.routes[0].legs[0];
			console.log("good: " + destObj.name);
			vecRoutes.push(new RouteResult(response, destObj, travelType));
			vecRoutesTargets[rtCtr].returnedOK=true;
			return true;
		} else {
			console.log("bad: " + destObj.name);
			return false;
		}
	});
}

function calculateRoute(destObj) {
	if(localStorage.getItem("walking") == "true"){
		vecRoutesTargets.push(new RouteTarget(destObj, google.maps.TravelMode.WALKING));
	}
	if(localStorage.getItem("driving") == "true"){
		vecRoutesTargets.push(new RouteTarget(destObj, google.maps.TravelMode.DRIVING));
	}
	if(localStorage.getItem("transit") == "true"){
		vecRoutesTargets.push(new RouteTarget(destObj, google.maps.TravelMode.TRANSIT));
	}
	if(localStorage.getItem("cycling") == "true"){
		vecRoutesTargets.push(new RouteTarget(destObj, google.maps.TravelMode.BICYCLING));
	}
}

function createInfoWindow(str, geolocate){
	var infowindow = new google.maps.InfoWindow({
        map: map,
        position: geolocate,
        content: str
    });
	return infowindow;
}

function createMarker(iconUrl, geolocate){

	var icon = {
		url: iconUrl, // url
		scaledSize: new google.maps.Size(20, 20),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(0,0) 
	};

	var marker = new google.maps.Marker({
		position: geolocate,
		map: map,
		icon: icon
	});
	return marker;
}

function createLocationRequest(typeStr, radiusInMeters, locationLatLng){
	var request = {
		location: locationLatLng,
		radius: radiusInMeters,
		types: [typeStr]
	};
	return request;
}

function infoWindowOnClick(place){
	var minTime = 1000000;
	var minIdx=-1;
	for(var i = 0; i < vecRoutes.length; i++){
		if(vecRoutes[i].destinationObject.place_id == place){
			if(vecRoutes[i].timeValue < minTime){
				minTime = vecRoutes[i].timeValue;
				minIdx = i;
			}
		}
	}
	if(minIdx==-1)
		alert("location not loaded yet");
	else
		locationOnclick(minIdx);
}

var createClickHandlerMarker = function(arg) {
  return function() { infoWindowOnClick(arg); };
}

function nearbySearchCallback(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			var place = results[i];
			calculateRoute(place);
			/*createInfoWindow("<img src='" + place.icon + "' style='width: 16px; height: auto;'"+ 
			"onclick='infoWindowOnClick(\""+place.place_id+"\")'></img>", place.geometry.location);*/
			
			var tmpMarker = createMarker(place.icon, place.geometry.location);
			tmpMarker.addListener('click', createClickHandlerMarker(place.place_id));
		}
	}
	else if(status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS){
		alert("No matching places");
	}
	else{
		alert("Error!");
	}
}

function locationOnclick(id){
	drawRoute(vecRoutes[id].response);
	$("#sortedLocations").hide();
	
	$("#locationDescriptionContent").empty();
	var a = document.createElement('div');
	var iHtml = vecRoutes[id].destinationObject.name+"("+vecRoutes[id].time+", " + vecRoutes[id].dist + ") | " + vecRoutes[id].travelType;
	a.innerHTML = iHtml;
	a.className='well well-sm';
	$("#locationDescriptionContent").append(a);
		
	var _br = document.createElement('br');
	$("#locationDescriptionContent").append(_br);
		
	var infoContent="<h5>"+vecRoutes[id].destinationObject.name+"</h5>";
	infoContent += ("<div>Time of travel: " + vecRoutes[id].time+"<br>");
	infoContent += ("Distance: " + vecRoutes[id].dist+"<br>");
	infoContent += ("Travel type: " + vecRoutes[id].travelType+"<br>");
	infoContent += ("Address: " + vecRoutes[id].destinationObject.vicinity+"<br>");
	infoContent += "<br></div>";
	var newDetailedWindow = createInfoWindow(infoContent, vecRoutes[id].destinationObject.geometry.location);
	
	$("#locationDescription").show();
}

var createClickHandler = function(arg) {
  return function() { locationOnclick(arg); };
}

function timeOutRoutes(){
	var routeCtr=-1;
	var loadedRoutes=0;
	for(var i = 0; i < vecRoutesTargets.length; i++){
		if(vecRoutesTargets[i].returnedOK)
			loadedRoutes++;
	}
	document.getElementById("topHrefLocations").innerHTML="Routes ("+loadedRoutes.toString()+"/"+vecRoutesTargets.length.toString()+")";
	for(var i = 0; i < vecRoutesTargets.length; i++){
		if(vecRoutesTargets[i].returnedOK==false){
			routeCtr = i;
			break;
		}
	}
	if(routeCtr != -1){
		console.log("timeOutRoutes() for route " + routeCtr);
		calcRouteToObjectAndTravelType(vecRoutesTargets[routeCtr].destinationObject, vecRoutesTargets[routeCtr].travelType, routeCtr);
		setTimeout("timeOutRoutes();", 200);
	}
	else{
		console.log("And... it's done!!");
		displayRoutesAsButtons(10);
	}
}

function checkIfAllRoutesFound(){
	setTimeout("timeOutRoutes();", 100);
}

function displayRoutesAsButtons(maxiVal){
	if(maxiVal == 1000)  //show/hide more button
	{
		showAll=!showAll;
		if(showAll){
			maxiVal = 1000;
			document.getElementById("showAll").innerHTML = "Show Less";
		}
		else{
			maxiVal = 10;
			document.getElementById("showAll").innerHTML = "Show All";
		}
	}

	vecRoutes.sort(function(a,b){
		return a.timeValue > b.timeValue ? 1 : -1;
	});
	$("#sortedLocationsContent").empty();
	//console.log("dbg start");
	for(var i = 0; i < Math.min(vecRoutes.length, maxiVal); i++){
		//console.log(vecRoutes[i].destinationObject.name+ " " + vecRoutes[i].time + " " + vecRoutes[i].dist);
		var a = document.createElement('a');
		a.href = "#";
		a.text = shortenName(vecRoutes[i].destinationObject.name)+"("+vecRoutes[i].time+") | " + vecRoutes[i].travelType;
		a.className='btn btn-primary btn-lg active btn100Width';
		a.onclick=createClickHandler(i);
		$("#sortedLocationsContent").append(a);
		
		var _br = document.createElement('br');
		$("#sortedLocationsContent").append(_br);
	}
	$("#sortedLocations").show();
}

function findPlacesSelectedByUser(){
	var geolocate = new google.maps.LatLng(locationX, locationY);
	var radius = 1500;
	var lastIdx=0;
	for(var i = 0; i < vecTargets.length; i++){
		if(vecTargets[i].isEnabled)
			lastIdx=i;
	}
	for(var i = 0; i < vecTargets.length; i++){
		if(vecTargets[i].isEnabled){
			if(i == lastIdx){
				setTimeout("checkIfAllRoutesFound();", 2000);
			}
			service.nearbySearch(createLocationRequest(vecTargets[i].googleId, radius, geolocate), nearbySearchCallback);
		}
	}
}