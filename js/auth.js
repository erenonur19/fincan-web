//db connection
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDjLb585R1Cx_tlxbZ--XIqrQeeVcXaJ5U",
    authDomain: "fincan-60676.firebaseapp.com",
    databaseURL: "https://fincan-60676-default-rtdb.firebaseio.com",
    projectId: "fincan-60676",
    storageBucket: "fincan-60676.appspot.com",
    messagingSenderId: "529863764278",
    appId: "1:529863764278:web:139cab88aebd137ce5ab97"
});

const auth = firebaseApp.auth();
const db = firebaseApp.firestore();
const storage = firebaseApp.storage();

function showsignuppassword() {
    var signupResPassword = document.getElementById("signupResPassword");

    if (signupResPassword.type === "password") {
        signupResPassword.type = "text";
    } else {
        signupResPassword.type = "password";
    }
}

function showloginpassword() {
    var loginpassword = document.getElementById("loginpassword")
    if (loginpassword.type === "password") {
        loginpassword.type = "text";
    } else {
        loginpassword.type = "password";
    }
}

const resSignupValidation = () => {
    let signupResName = document.getElementById('signupResName').value;
    let signupResEmail = document.getElementById('signupResEmail').value;
    let signupResPassword = document.getElementById('signupResPassword').value;
    let file = document.getElementById('MainResImage').files[0];
    let resSignupButton = document.getElementById('resSignupButton');
    if ((signupResName && signupResEmail && signupResPassword).length === 0 || (file === undefined)) {
        resSignupButton.disabled = true;
    } else {
        resSignupButton.disabled = false;
    }
}

const validationLogin = () => {
    let loginnameoremail = document.getElementById('loginnameoremail').value;
    let loginpassword = document.getElementById('loginpassword').value;
    let loginBtn = document.getElementById('loginBtn');
    if ((loginnameoremail && loginpassword).length === 5) {
        loginBtn.disabled = true;
    } else {
        loginBtn.disabled = false;
    }
}

const validationForget = () => {
    let forgetInput = document.getElementById('forgetInput').value;
    let sendForgetlinkBtn = document.getElementById('sendForgetlinkBtn');

    if (forgetInput.length === 5) {
        sendForgetlinkBtn.disabled = true;
    } else {
        sendForgetlinkBtn.disabled = false;
    }
}

// Sign UP
const caffeeSignUp = () => {
    let loader = document.getElementById('loader');

    loader.style.display = "block";
    let signupResEmail = document.getElementById('signupResEmail').value;
    let signupResPassword = document.getElementById('signupResPassword').value;

    auth.createUserWithEmailAndPassword(signupResEmail, signupResPassword)
        .then((userCredential) => {
            var caffee = userCredential.user;
            console.log(caffee);
            setcaffeeInitialData(caffee);
            sendEmailVerification();
        })
        .catch((error) => {
            console.log(error.message);
            loader.style.display = "none";
            swal(error.message);
        });
}

const setcaffeeInitialData = (caffee) => {
    let loader = document.getElementById('loader');

    let signupResName = document.getElementById('signupResName').value;
   
    let signupResEmail = document.getElementById('signupResEmail').value;


    db.collection("caffee").doc(caffee.uid).set({
        email: signupResEmail,
        name: signupResName,
        type: "caffee",
        restaurantkey: caffee.uid,
        imageurl: "",
        deal: "No deal",
        openorclose: "",
        wrkinghours: "",
        address: "",
        category: "",
        phonenumber: "",
        deliverycharges: "0",
    })
        .then(() => {
            console.log("Document successfully written!");
            loader.style.display = "none"
            uploadImageSignup(caffee);
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
            loader.style.display = "none";
            swal(error)

        });
}

function sendEmailVerification() {
    auth.currentUser.sendEmailVerification()
        .then(() => {
            console.log("send");
        });
}

const login = () => {
    let loginnameoremail = document.getElementById('loginnameoremail').value;
    let loginpassword = document.getElementById('loginpassword').value;
    let loader = document.getElementById('loader');

    loader.style.display = "block";
    auth.signInWithEmailAndPassword(loginnameoremail, loginpassword)
        .then((userCredential) => {
            var user = userCredential.user;
            authStateListener();
        })
        .catch((error) => {
            loader.style.display = "none";
            swal(error.message);
        });
}

const authStateListener = () => {
    let loader = document.getElementById('loader');
    let sendverfemailagain = document.getElementById('sendverfemailagain');
    auth.onAuthStateChanged((user) => {
        if (true) {
            if (user) {
                var uid = user.displayName;
                console.log(user.emailVerified);
                typeCheck(user);
            } else {
                console.log("no user");
            }
        } else {

            //email verification-disabled
            loader.style.display = "none"
            swal("Please verify your email address, Go on your given email and click on the given link. If you did not receive any Email Click on SEND EMAIL VERIFICATION to receive an email");
            sendverfemailagain.style.display = "block";
        }
    });
}
const typeCheck = (user) => {
    let loader = document.getElementById('loader');

    var docRef = db.collection("users").doc(user.uid);
    docRef.get().then((usersnapshot) => {
        if (usersnapshot.data() == undefined) {
            var resdocRef = db.collection("caffee").doc(user.uid);
            resdocRef.get().then((ressnapshot) => {
                if (ressnapshot.data().type == "caffee") {
                    window.location.href = "./cafeDash.html";
                    loader.style.display = "none"
                }
            });
        } else if (usersnapshot.data().type == "user") {
            window.location.href = "./userhome.html"
            loader.style.display = "none"
        }
    });
}

const logout = () => {
    let loader = document.getElementById('loader');

    loader.style.display = "block"
    auth.signOut().then(() => {
        console.log("Sign-out successful.");
        loader.style.display = "none";
        window.location.href = "./index.html"
    }).catch((error) => {
        console.log(error);
        loader.style.display = "none"
    });
}

const forgetpassword = () => {
    let loader = document.getElementById('loader');
    loader.style.display = "block";

    const email = document.getElementById('forgetInput').value;
    auth.sendPasswordResetEmail(email)
        .then(() => {
            console.log("Password reset email sent!");
            loader.style.display = "none";
            swal("Password reset email sent!");
            document.getElementById('forgetInput').value = "";
        })
        .catch((error) => {
            loader.style.display = "none";
            console.log(error.message);
            swal(error.message)
        });
}

const uploadImageSignup = (res) => {
    let loader = document.getElementById('loader');
    loader.style.display = "block";
    const ref = storage.ref('caffeeProfile');
    let file = document.getElementById('MainResImage').files[0];
    const metadata = {
        contentType: file.type
    }
    const task = ref.child(res.uid).put(file, metadata);
    task.then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            uploadImageFirestoreSignup(url, res)
            console.log(url);
            window.location.href = "./index.html";
            loader.style.display = "none";
        })
        .catch((err) => { console.log(err); swal(err) })
}

const uploadImageFirestoreSignup = (url, res) => {
    var resRef = db.collection("caffee").doc(res.uid);
    resRef.update({
        imageurl: url
    })
        .then(() => {
            console.log("Document successfully updated!");
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
            console.log(error);
        });
}
