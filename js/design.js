function loadHiRes() {
	const image = new Image();

	// Swap blurred background on load.
	image.onload = function () {
		this.style.objectFit = "cover";
		this.style.width = "100%";
		this.style.height = "100%";
		document.getElementById("background").appendChild(this);
		document.getElementById("background").style.removeProperty("filter");
	};
	image.src = "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw=&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80";
}

// Displays a notification to the user
function displayNotification(title, desc, type) {
	let alertType = "alert-" + type;
	let notificationLanding = document.getElementById("notificationLanding");

	if (document.getElementById("notiDiv") != null) {
		let curNoti = document.getElementById("notiDiv");
		curNoti.parentNode.removeChild(curNoti);
	}

	let notiDiv = document.createElement("div");
	notiDiv.className = "alert " + alertType;
	notiDiv.style.width = "75%";
	notiDiv.id = "notiDiv";

	let notiHeader = document.createElement("h5");
	notiHeader.style.textAlign = "left";
	notiHeader.innerHTML = title;
	notiDiv.appendChild(notiHeader);

	let notiClose = document.createElement("button");
	notiClose.type = "button";
	notiClose.className = "btn.close";
	notiClose.dataset.bsDismiss = "alert";
	notiHeader.appendChild(notiClose);

	let notiDesc = document.createElement("p");
	notiDesc.style.textAlign = "left";
	notiDesc.innerHTML = desc;
	notiDesc.style.marginBottom = "0px";
	notiDiv.appendChild(notiDesc);

	notificationLanding.prepend(notiDiv);
}
