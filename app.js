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

	if (cookiesList.children.length) displayCookies();
}


function doesCookieExist(name) {
    const cookies = document.cookie.split("; ");
    const cookiesName = cookies.map(cookie => cookie.split("=")[0]);
    return cookiesName.some(cookie => cookie === encodeURIComponent(name));
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

const cookiesList = document.querySelector(".cookies-list");
const displayCookiesBtn = document.querySelector(".display-cookies-btn");
const infoTxt = document.querySelector(".info-txt");

displayCookiesBtn.addEventListener("click", displayCookies);
let lock = false;

function displayCookies() {

	if (cookiesList.children.length) cookiesList.textContent = "";

	const cookies = document.cookie.split("; ").reverse();
	if (!cookies[0]) {
		if (lock) return;
		lock = true;
		infoTxt.textContent = "No cookies found, create one !";

		setTimeout(() => {
			infoTxt.textContent = "";
			lock = false;
		}, 1500);
		return;
	}

	createCookiesList(cookies);
}

function createCookiesList(cookies) {
	cookies.forEach(cookie => {
		const formatCookie = cookie.split("=");
		const listItem = document.createElement("li");
		const name = decodeURIComponent(formatCookie[0]);
		const value = decodeURIComponent(formatCookie[1]);
		const itemContent = `
			<p><span>Name : </span>${name}</p>
			<p><span>Value : </span>${value}</p>
			<button>X</button>
		`;
		listItem.innerHTML = itemContent;
		listItem.querySelector("button").addEventListener("click", (e) => {
			createToast({name: name, state: "deleted", color: "crimson"});
			document.cookie = `${name}=; expires=${new Date(0)}`;
			e.target.parentElement.remove();
		});
		cookiesList.appendChild(listItem);
	});
}