let handle;

//listen for auth status changes
auth.onAuthStateChanged((user) => {
	// var handle_name=document.getElementById('')
	if (user) {
		console.log('user logged in');
		db.collection('handles')
			.where('email', '==', user.email)
			.get()
			.then((snapshot) => {
				snapshot.docs.forEach((doc) => {
					const handle_list = doc.data();
					if (handle_list.email === user.email) {
						handle = handle_list.handle;
						console.log(handle);
					}
				});
				document.querySelector('.container11').classList.add('hidden');
				document.querySelector('.container1').classList.remove('hidden');
				document.querySelector('.loader12345').classList.add('disapper');
				dashboard(handle);
			});
	} else {
		console.log('user logged out');
		document.querySelector('.loader12345').classList.add('disapper');

		document.querySelector('.container11').classList.remove('hidden');
		document.querySelector('.container4').classList.add('hidden');
		document.querySelector('.container1').classList.add('hidden');
	}
});

// for signup
const signupform = document.querySelector('#signup-form');
const forgotform = document.querySelector('#forgot');
signupform.addEventListener('submit', (e) => {
	const email = signupform['signup-email'].value;
	const handle_name = signupform['signup-handle'].value;
	const pwd = signupform['signup-password'].value;
	// firebase.database().ref('users/' + userId).set({
	//     handle: handle_name
	// });

	console.log(email, handle_name, pwd);
	async function find_user() {
		let modified_url =
			'https://codeforces.com/api/user.info?handles=' + handle_name;
		const jsondata = await fetch(modified_url);
		const jsdata = await jsondata.json();
		if (jsdata.status === 'FAILED') {
			display_error();
		} else {
			auth
				.createUserWithEmailAndPassword(email, pwd)
				.then((cred) => {
					db.collection('handles').add({
						email: email,
						handle: handle_name,
						target: 16000,
					});
					console.log(cred);
					signupform.reset();
				})
				.catch(function (error) {
					alert(error.errorMessage);
					display_error();
				});
		}
	}
	find_user();
	e.preventDefault();
});

const logout2 = document.querySelectorAll('.logout2');
for (let i = 0; i < logout2.length; i++) {
	logout2[i].addEventListener('click', (e) => {
		e.preventDefault();
		auth.signOut();
	});
}

forgotform.addEventListener('submit', (e) => {
	e.preventDefault();
	let emailAddress = document.querySelector('#login-email-forgot').value;
	auth
		.sendPasswordResetEmail(emailAddress)
		.then(function () {
			forgotform.classList.add('hidden');
			document.querySelector('.after-forgot').classList.remove('hidden');
		})
		.catch(function (error) {
			display_error();
			alert(error.errorMessage);
			// An error happened.
		});
});

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const email = loginForm['login-email'].value;
	const pwd = loginForm['login-password'].value;
	document.querySelector('.loader12345').classList.remove('disapper');

	auth
		.signInWithEmailAndPassword(email, pwd)
		.then((cred) => {
			document.querySelector('.loader12345').classList.add('disapper');
			console.log(cred);
		})
		.catch(function (error) {
			display_error();
			alert(error.errorMessage);
		});
});

function display_error() {
	document.querySelector('.loader12345').classList.add('disapper');
	show_screen(index_screen);
	document.querySelector('.disp_err').classList.remove('hidden');
	document.querySelector('.disp_err').classList.add('disapper2');
}

document.querySelector('.google-sign-in').addEventListener('click', (e) => {
	var provider = new firebase.auth.GoogleAuthProvider();
	firebase
		.auth()
		.signInWithPopup(provider)
		.then(function (result) {
			// This gives you a Google Access Token. You can use it to access the Google API.
			var token = result.credential.accessToken;
			// The signed-in user info.
			var user = result.user;
			// ...
		})
		.catch(function (error) {
			console.log('hell');
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			alert(errorMessage);
			// The email of the user's account used.
			var email = error.email;
			// The firebase.auth.AuthCredential type that was used.
			var credential = error.credential;
			// ...
		});
	e.preventDefault();
});
