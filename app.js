const inputs = document.querySelectorAll('input');

inputs.forEach(input => {
    input.addEventListener('input', handleValidation);
    input.addEventListener('invalid', handleValidation);
});

function handleValidation(event) {
	if (event.type === 'invalid') {
		event.target.setCustomValidity("This input can't be empty");
	} else if (event.type === 'input') {
		event.target.setCustomValidity("");
	}
}

const cookieForm = document.querySelector("form");

cookieForm.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
	event.preventDefault();

	const newCookie = {};

	inputs.forEach(input => {
		const inputName = input.getAttribute("name");
		newCookie[inputName] = input.value;
	});

	newCookie.expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7);

	cookieForm.reset();

	createCookie(newCookie);
}

function createCookie(cookie) {
	if (doesCookieExist(cookie.name)) {
		createToast({name: cookie.name, state: "updated", color: "orangered"});
	} else {
		createToast({name: cookie.name, state: "created", color: "green"});
	}
	document.cookie = `${encodeURIComponent(cookie.name)}=${encodeURIComponent(cookie.value)}; expires=${cookie.expires.toUTCString()}`;
}

function doesCookieExist(name) {
	const cookies = document.cookie.split("; ");
	const cookiesName = cookies.map(cookie => cookie.split("=")[0]);
	const cookieExists = cookiesName.find(cookie => cookie === encodeURIComponent(name));
	return cookieExists;
}

const toastsContainer = document.querySelector(".toasts-container");

function createToast({name, state, color}) {
	const toastInfo = document.createElement("p");
	toastInfo.className = "toast";
	toastInfo.textContent = `Cookie ${name} ${state}`;
	toastInfo.style.backgroundColor = color;
	toastsContainer.appendChild(toastInfo);

	setTimeout(() => {
		toastInfo.remove();
	}, 2500);

}