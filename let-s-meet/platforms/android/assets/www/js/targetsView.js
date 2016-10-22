var vecTargets=[];

function toogleSelectionOnClick(idx){
	vecTargets[idx].isEnabled = !vecTargets[idx].isEnabled;
	if(vecTargets[idx].isEnabled)
		document.getElementById(vecTargets[idx].htmlId).className="btn btn-success btn-block";
	else
		document.getElementById(vecTargets[idx].htmlId).className="btn btn-primary btn-block";
}

function setLocalStorageItem(){
	localStorage.setItem(this.typeStr, this.isEnabled.toString());
}

function Target(typeStr){
	this.typeStr = typeStr;
	this.isEnabled = false;
	this.htmlId = "btn"+typeStr.charAt(0).toUpperCase() + typeStr.slice(1);
	this.htmlId = this.htmlId.replace(/\s+/g, '');
	this.setLocalStorageItem = setLocalStorageItem;
}

var createClickHandler = function(arg) {
  return function() { toogleSelectionOnClick(arg); };
}

function loadPage(){
	vecTargets.push(new Target("Airport"));
	vecTargets.push(new Target("Art Gallery"));
	vecTargets.push(new Target("Atm"));
	vecTargets.push(new Target("Bakery"));
	vecTargets.push(new Target("Bank"));
	vecTargets.push(new Target("Bar"));
	vecTargets.push(new Target("Bowling Alley"));
	vecTargets.push(new Target("Cafe"));
	vecTargets.push(new Target("Cinema"));
	vecTargets.push(new Target("Doctor"));
	vecTargets.push(new Target("Fire Station"));
	vecTargets.push(new Target("Gas Station"));
	vecTargets.push(new Target("Gym"));
	vecTargets.push(new Target("Hospital"));
	vecTargets.push(new Target("Library"));
	vecTargets.push(new Target("Movie Rental"));
	vecTargets.push(new Target("Museum"));
	vecTargets.push(new Target("Night Club"));
	vecTargets.push(new Target("Park"));
	vecTargets.push(new Target("Parking"));
	vecTargets.push(new Target("Pharmacy"));
	vecTargets.push(new Target("Police"));
	vecTargets.push(new Target("Post Office"));
	vecTargets.push(new Target("Restaurant"));
	vecTargets.push(new Target("Shop"));
	vecTargets.push(new Target("Shopping Mall"));
	vecTargets.push(new Target("Stadium"));
	vecTargets.push(new Target("Subway Station"));
	vecTargets.push(new Target("Taxi Stand"));

	for(var i = 0; i < vecTargets.length; i++){
		console.log(vecTargets[i]);
		vecTargets[i].isEnabled = false;
		vecTargets[i].setLocalStorageItem();
		document.getElementById(vecTargets[i].htmlId).onclick = createClickHandler(i);
	}
}

function acceptLocations(){
	var atLeastOneSelected=true;
	var selectedCtr=0;
	for(var i = 0; i < vecTargets.length; i++){
		if(vecTargets[i].isEnabled)
			selectedCtr++;
	}
	
	if(selectedCtr > 3){
		alert("Please select maximally 3 locations types");
		return;
	}
	
	if(selectedCtr >= 1){
		for(var i = 0; i < vecTargets.length; i++)
			vecTargets[i].setLocalStorageItem();
			
		document.location="mapView.html";
	}
	else{
		alert("Please select at least one location");
	}
}