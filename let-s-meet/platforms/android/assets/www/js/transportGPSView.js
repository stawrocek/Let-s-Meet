localStorage.setItem('geolocType', 'none');
localStorage.setItem('walking', false);
localStorage.setItem('driving', false);
localStorage.setItem('transit', false);
localStorage.setItem('cycling', false);

localStorage.setItem('locX', 'none');
localStorage.setItem('locY', 'none');
var geocoder;

function createGoogleMaps(){
	geocoder = new google.maps.Geocoder();
}

function setTransportType(typeMask){
	var tmpItem = localStorage.getItem(typeMask);
	if(tmpItem == "false"){
		localStorage.setItem(typeMask, true);
		document.getElementById(typeMask).className="btn btn-success btn-block";
	}
	else{
		localStorage.setItem(typeMask, false);
		document.getElementById(typeMask).className="btn btn-primary btn-block";
	}
}

function getPosition(position){
	localStorage.setItem('locX', position.coords.latitude.toString());
	localStorage.setItem('locY', position.coords.longitude.toString());
	console.log(localStorage.getItem('locX')+" "+localStorage.getItem('locY'));
	$("#chooseTransportType").show();
}

function displayError(error) {
  var errors = { 
    1: 'Permission denied',
    2: 'Position unavailable',
    3: 'Request timeout'
  };
  if(error.code==1){
	navigator.geolocation.getCurrentPosition(getPosition);
  }
  else alert("Error: " + errors[error.code]);
}

function setGeoInput(type){
	localStorage.setItem('geolocType', type);
	if(type=='gps'){
		if (navigator.geolocation) {
			//navigator.geolocation.getCurrentPosition(getPosition);
			navigator.geolocation.getCurrentPosition(
			getPosition, 
			displayError,
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
		  );

		} else {
			alert("GPS is not enabled!");
		}
	}
	if(type=='gps'){
		document.getElementById("btnGPS").className="btn btn-success btn-block";
		document.getElementById("btnInputAdress").className="btn btn-primary btn-block";
	}
	else{
		document.getElementById("btnInputAdress").className="btn btn-success btn-block";
		document.getElementById("btnGPS").className="btn btn-primary btn-block";
	}
}

function updateUserLocation(){
	localStorage.setItem('userLocationAddress', document.getElementById('usrLocation').value);
	geocodeAddress(localStorage.getItem('userLocationAddress'));
}

function geocodeAddress(address){
	geocoder.geocode({'address': address}, function(results, status) {
		if (status === 'OK'){
			localStorage.setItem('locX', results[0].geometry.location.lat());
			localStorage.setItem('locY', results[0].geometry.location.lng());
			console.log(localStorage.getItem('locX')+" "+localStorage.getItem('locY'));
		} 
		else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
	$("#chooseTransportType").show();
}

function acceptForm(){
	if(localStorage.getItem('geolocType') == 'none'){
		alert("please select method of geolocation");
		return;
	}
	var transportTypesCtr=0;
	if(localStorage.getItem('walking') == "true")
		transportTypesCtr++;
	if(localStorage.getItem('driving') == "true")
		transportTypesCtr++;
	if(localStorage.getItem('transit') == "true")
		transportTypesCtr++;
	if(localStorage.getItem('cycling') == "true")
		transportTypesCtr++;
	if(transportTypesCtr==0){
		alert("Please select transport type");
		return;
	}
	if(transportTypesCtr>2){
		alert("Maximally 2 transport types (due to query limits)");
		return;
	}
	window.location.href="targetsView.html";
}