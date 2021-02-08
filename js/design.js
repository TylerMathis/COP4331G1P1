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

	const innerHTML = `
	<div class="d-flex" style="justify-content: space-between">
		<div>
			<strong>${title}</strong> ${desc}
		</div>
		<button class="btn-close" data-bs-dismiss="alert" type="button"></button>	
	</div>
	`

	let notiDiv = document.createElement("div");
	notiDiv.className = "alert " + alertType + " alert-dismissable fade show";
	notiDiv.style.width = "75%";
	notiDiv.id = "notiDiv";
	notiDiv.innerHTML = innerHTML;

	notificationLanding.prepend(notiDiv);
}

function displayError(error) {
	console.log(error);
	displayNotification(error.message, error.detail, "danger");
}
