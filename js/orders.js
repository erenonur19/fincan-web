var FM57964 = "yIKglGdcWnPb9wN45zjL"
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


let loader = document.getElementById('loader');

const pendingtab = () => {
    loader.style.display = "block"

    let pending = document.getElementById('pending');

    auth.onAuthStateChanged((res) => {
        db.collection("orders").where("restaurantId", "==", res.uid).where("watch", "==", "Pending")
            .onSnapshot((querySnapshot) => {
                if (querySnapshot.empty) {
                    pending.innerHTML = `<h3 class="text-center pt-4">There are no orders to be listed yet..</h3>`;
                    loader.style.display = "none";
                }
                else {
                    var orders = [];
                    querySnapshot.forEach((doc) => {
                    
                        var orderName=""
                        for(let item of doc.data().items){
                            orderName+=" "+item["quantity"]+" pcs. "+item["itemName"] +","
                        }
                        orderName = orderName.substring(0, orderName.length - 1); 
                        temp_var = doc.id
                        orders.unshift(`<div class="card">
                        <div class="card-header">
                          Order ID: ${temp_var}
                        </div>
                        <div class="card-body">
                          <h5 class="card-title">${orderName}</h5>
                          <b id="itemtext">Total: ${Math.round(doc.data().subtotalPrice*100)/100} TL</b>
                          <div class="pt-2 orderPerDet"><u><b class="orderDetails">Order Person Detail</b></u></div>
                          <div class="row pt-2"><div class="col-md-6"><div><b>Name:</b> ${doc.data().customerName}</div>
                        <div><b>Phone #:</b> ${doc.data().customerPhone}</div>
                        <b>Time: </b>${doc.data().time}</div>
                        <div><b>Payment Method:</b> ${doc.data().paymentMethod}</div
                        ><div><button class="btn btn-success no-radius" onclick="accept('${temp_var}')">Accept</button> 
                        <button class="btn btn-danger no-radius" onclick="reject('${temp_var}')">Reject</button></div></div></div>
                         
                        </div>
                      </div>`
                        
                        
                        );
                    });
                    pending.innerHTML = orders.join(" ")
                    loader.style.display = "none"
                }
            });
    })
}

const acceptedtab = () => {
    let accepted = document.getElementById('accepted');

    auth.onAuthStateChanged((res) => {
        db.collection("orders").where("restaurantId", "==", res.uid).where("watch", "==", "Accepted")
            .onSnapshot((querySnapshot) => {
                var orders = [];
                querySnapshot.forEach((doc) => {
                    
                    var orderName=""
                    for(let item of doc.data().items){
                        orderName+=" "+item["quantity"]+" "+item["itemName"]
                    } 
                    temp_var = doc.id
                    orders.unshift(`<div class="card">
                    <div class="card-header">
                      Order ID: ${temp_var}
                    </div>
                    <div class="card-body">
                      <h5 class="card-title">${orderName}</h5>
                      <b id="itemtext">Total: ${Math.round(doc.data().subtotalPrice*100)/100} TL</b>
                      <div class="pt-2 orderPerDet"><u><b class="orderDetails">Order Person Detail</b></u></div>
                      <div class="row pt-2"><div class="col-md-6"><div><b>Name:</b> ${doc.data().customerName}</div>
                    <div><b>Phone #:</b> ${doc.data().customerPhone}</div>
                    <b>Time: </b>${doc.data().time}</div>
                    <div><b>Payment Method:</b> ${doc.data().paymentMethod}</div
                    ><div><button class="btn btn-success no-radius" onclick="deliver('${temp_var}')">Deliver</button> 
                    </div></div></div>
                     
                    </div>
                  </div>`);
                });
                accepted.innerHTML = orders.join(" ")
            });
    })
}

const deliveredtab = () => {
    let delivered = document.getElementById('delivered');

    auth.onAuthStateChanged((res) => {
        db.collection("orders").where("restaurantId", "==", res.uid).where("watch", "==", "Delivered")
            .onSnapshot((querySnapshot) => {
                var orders = [];
                querySnapshot.forEach((doc) => {                 
                    var orderName=""
                    for(let item of doc.data().items){
                        orderName+=" "+item["quantity"]+" "+item["itemName"]
                    } 
                    temp_var = doc.id
                    orders.unshift(`<div class="card">
                    <div class="card-header">
                      Order ID: ${temp_var}
                    </div>
                    <div class="card-body">
                      <h5 class="card-title">${orderName}</h5>
                      <b id="itemtext">Total: ${Math.round(doc.data().subtotalPrice*100)/100} TL</b>
                      <div class="pt-2 orderPerDet"><u><b class="orderDetails">Order Person Detail</b></u></div>
                      <div class="row pt-2"><div class="col-md-6"><div><b>Name:</b> ${doc.data().customerName}</div>
                    <div><b>Phone #:</b> ${doc.data().customerPhone}</div>
                    <b>Time: </b>${doc.data().time}</div>
                    <div><b>Payment Method:</b> ${doc.data().paymentMethod}</div
                    ><div> 
                    </div></div></div>
                     
                    </div>
                  </div>`);
                });
                delivered.innerHTML = orders.join(" ")
            });
    })
}

const rejectedtab = () => {
    let rejected = document.getElementById('rejected');
    auth.onAuthStateChanged((res) => {
        db.collection("orders").where("restaurantId", "==", res.uid).where("watch", "==", "Rejected")
            .onSnapshot((querySnapshot) => {
                var orders = [];
                querySnapshot.forEach((doc) => {                 
                    var orderName=""
                    for(let item of doc.data().items){
                        orderName+=" "+item["quantity"]+" "+item["itemName"]
                    } 
                    temp_var = doc.id
                    orders.unshift(`<div class="card">
                    <div class="card-header">
                      Order ID: ${temp_var}
                    </div>
                    <div class="card-body">
                      <h5 class="card-title">${orderName}</h5>
                      <b id="itemtext">Total: ${Math.round(doc.data().subtotalPrice*100)/100} TL</b>
                      <div class="pt-2 orderPerDet"><u><b class="orderDetails">Order Person Detail</b></u></div>
                      <div class="row pt-2"><div class="col-md-6"><div><b>Name:</b> ${doc.data().customerName}</div>
                    <div><b>Phone #:</b> ${doc.data().customerPhone}</div>
                    <b>Time: </b>${doc.data().time}</div>
                    <div><b>Payment Method:</b> ${doc.data().paymentMethod}</div
                    ><div> 
                    </div></div></div>
                     
                    </div>
                  </div>`);
                });
                rejected.innerHTML = orders.join(" ")
            });
    })
}


const accept = (orderId) => {
    var orderRef = db.collection("orders").doc(`${orderId}`);
    return orderRef.update({
        watch: "Accepted"
    }).then(() => {
        console.log("Document successfully updated!");
    }).catch((error) => {
        console.error("Error updating document: ", error);
        alert(error);
    });
}

const reject = (orderid) => {
    var orderRef = db.collection("orders").doc(`${orderid}`);
    return orderRef.update({
        watch: "Rejected"
    }).then(() => {
        console.log("Document successfully updated!");
    }).catch((error) => {
        console.error("Error updating document: ", error);
        alert(error);
    });
}

const deliver = (orderid) => {
    var orderRef = db.collection("orders").doc(`${orderid}`);
    return orderRef.update({
        watch: "Delivered"
    }).then(() => {
        console.log("Document successfully updated!");
    }).catch((error) => {
        console.error("Error updating document: ", error);
        alert(error);
    });
}


