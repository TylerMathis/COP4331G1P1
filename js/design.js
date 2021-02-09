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

	let icon;

	console.log(type);
	switch (type) {
		case "success":
			icon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16" style="margin-right: 10px;">
  						<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
					</svg>`
			break;
		case "danger":
			icon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16" style="margin-right: 10px;">
  						<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
					</svg>`
	}

	const innerHTML = `
	<div class="d-flex" style="justify-content: space-between">
		<div class="d-flex" style="justify-items: center; align-items: center">
			${icon}
			<strong style="padding-right: 10px;">${title}</strong> ${desc}
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
