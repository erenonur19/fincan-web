const addItem = () => {
    loader.style.display = "block"
    const ref = storage.ref('caffeeItems');
    let file = document.getElementById('resFoodImage').files[0];
    let date = new Date;
    let name = date.getTime() + '-' + file.name

    const metadata = { contentType: file.type }
    const task = ref.child(name).put(file, metadata);

    task.then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            let resItemName = document.getElementById('resItemName').value; resPrice = document.getElementById('resPrice').value; resCatrgory = document.getElementById('resCatrgory').value;
            let genID = date.getTime();
            auth.onAuthStateChanged((res) => {
                db.collection("items").doc(`${genID}`).set({
                    itemname: resItemName, itemprice: resPrice, itemcategory: resCatrgory, key: res.uid, imageurl: url, imagename: name,
                })
                    .then(() => {
                        console.log("Document successfully written!");
                        showItem();
                        loader.style.display = "none"
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                        alert(error);
                        loader.style.display = "none"
                    });
            })
        })
        .catch((err) => { alert(err); })
}

const showItem = () => {
    loader.style.display = "block"
    let resItem = document.getElementById('resItem');
    let html = '';
    auth.onAuthStateChanged((res) => {
        db.collection("items").where("key", "==", res.uid).get().then((querySnapshot) => {
            if (querySnapshot.empty) {
                resItem.innerHTML = `<h2 class="text-center">No Items Added</h2>`;
                loader.style.display = "none";
            }
            else {
                querySnapshot.forEach((doc) => {
                    html += `<div class="col-lg-3 col-md-4 col-sm-6 pt-4 d-flex justify-content-center">
                    <div class="card" style="width: 17rem; height: 30 !important;">
                        <div class="dropdown">
                                <i class="bi bi-three-dots-vertical dropbtn three-dot"></i>
                            <div class="dropdown-content">
                                <a href="#" onclick="editItem(${doc.id})">Edit</a>
                                <a href="#" onclick="deleteItem(${doc.id}, '${doc.data().imagename}')">Delete</a>
                            </div>
                        </div>
                        <img src="${doc.data().imageurl}" id="image" class="card-img-top" alt="...">
                    
                        <div class="card-body">
                                <p class="" style="font-size: 25px;"><b>${doc.data().itemname}</b></p>
                            <div class="d-flex justify-content-between">
                                <p class="" style="font-size: 16px;">TL: ${doc.data().itemprice}</p>
                            </div>
                        </div>
                    </div>
                    </div>`
                    resItem.innerHTML = html;
                    loader.style.display = "none";
                });
            }
        })
            .catch((error) => { console.log("Error getting documents: ", error); alert(error) });
    })
}

const navbar = () => {
    const shopNameNav = document.getElementById('shopNameNav');
    auth.onAuthStateChanged((res) => {
        let docRef = db.collection("caffee").doc(res.uid);
        docRef.get().then((doc) => {
            if (doc.exists) {
                const shopname = doc.data().name; namehalf = shopname.substring(0, 14)
                shopNameNav.innerHTML = `${namehalf}`;
            } else { console.log("No such document!"); }
        }).catch((error) => { console.log("Error getting document:", error); alert(error) });
    })
}

const deleteItem = (id, imagename) => {
    loader.style.display = "block";
    db.collection("items").doc(`${id}`).delete().then(() => {
        console.log("Document successfully deleted!");
        loader.style.display = "none";
    }).catch((error) => {
        console.error("Error removing document: ", error);
        alert(error);
    });

    const desertRef = storage.ref('caffeeItems').child(imagename);
    desertRef.delete().then(() => {
        console.log("succes delete");
    }).catch((error) => { console.log(error); });
    showItem();
}

const editItem = (id) => {
    console.log(id);
}
