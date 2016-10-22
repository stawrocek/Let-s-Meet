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
	this.setLocalStorageItem = setLocalStorageItem;
}

var createClickHandler = function(arg) {
  return function() { toogleSelectionOnClick(arg); };
}

function loadPage(){
	vecTargets.push(new Target("Museum"));
	vecTargets.push(new Target("Restaurant"));
	vecTargets.push(new Target("Cinema"));
	vecTargets.push(new Target("Shop"));
	for(var i = 0; i < vecTargets.length; i++){
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