const filter = () => {
    let input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("wantedUser");
    filter = input.value.toUpperCase();
    tr = document.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            txtValue = td[j].textContent || td[j].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
                break;
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

const squadsLoad = () => {
    getSquads().then(data => {
        squadTable(data);
    })
}

const byStatus = (key, value) => {
    getSquadsByParam(key, value).then(data => {
        const tbl = document.querySelector("#squadTbl");
        tbl.innerHTML = "";
        console.log(data)
        squadTable(data);
    })
}

const getSquadsByParam = async (key, value) => {
    const response = await fetch(`http://localhost:3000/squad/${key}/${value}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data;
}


const getSquads = async () => {
    const response = await fetch(`http://localhost:3000/squad`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.status !== 200) {
        return {};
    } else {
        const data = await response.json();
        return data;
    }
}

const squadTable = (data) => {
    // console.log("data: "+ data.squad);
    const tbl = document.querySelector("#squadTbl");
    tbl.innerHTML = "";
    let myArray = Object.keys(data.squads).map(function (key) {
        return {[key]: data.squads[key]};
    });
    console.log("myArray: "+ myArray);
    for (const squad of myArray) {
        const status = squad.finished == true ? 'Finished' : 'In-Progress'
        let vol2 = "";
        if (squad.volunteer2) {
            vol2 = `<tr>
            <td><strong>${squad.volunteer2.name}</strong></td>
            <td>${squad.volunteer2.role}</td>
            <td>${squad.volunteer2.tel}</td>
            <td>${squad.volunteer2.email}</td>
        </tr>`
        }
        let test =
            `<div class="card-body">
          <div class="card">
              <h6 class="card-header">Squad Id: ${squad._id}
              <h6 class="card-header ${status}">Status: ${status}</h6>
              <div id="squadsTable" class="table-responsive text-nowrap">
                <table class="table table-hover">
                  <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                  </tr>
                  </thead>
                  <tbody class="table-border-bottom-0">
                  <tr>
                    <td><strong>${squad.driver.name}</strong></td>
                    <td>${squad.driver.role}</td>
                    <td>${squad.driver.tel}</td>
                    <td>${squad.driver.email}</td>
                    </tr>
                     <tr>
                    <td><strong>${squad.volunteer.name}</strong></td>
                    <td>${squad.volunteer.role}</td>
                    <td>${squad.volunteer.tel}</td>
                    <td>${squad.volunteer.email}</td>
                    </tr>
                    ${vol2}
                  </tbody>
                </table>
              </div>
            </div>
</div>`
        tbl.innerHTML += test;
    }
}


let myLatLng = {lat: 32.099308390571736, lng: 34.82521696036913};
let endLatLng = {lat: 32.10083953947424, lng: 34.82644780955043};

let mapOptions = {
    center: myLatLng,
    zoom: 14,
    // mapTypeId: google.maps.MapTypeId.ROADMAP
};

//create map
// let map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
// const googleMap = document.getElementById('googleMap');
// let directionsService = new google.maps.DirectionsService();
// let directionsDisplay = new google.maps.DirectionsRenderer();
//
// directionsDisplay.setMap(map);

const initRoutePage = () => {
    calcRouteMap();
}
const calcRouteMap = async () => {
    const response = await fetch(`http://localhost:3000/route/63c6ec78c2921b45ba6fd18e`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    calcRoute(data.locations, data.locations.length, data.families);
};

const showfamilies = (data) => {
    const form = document.getElementById("familiesRoute");
    for (let j = 0; j < data.length; j++) {
        let address = `${data[j].city}, ${data[j].street} ${data[j].houseNumber}`;
        let name = data[j].name;
        let phone = data[j].phoneNumber;
        addressWaze = address.replaceAll(' ', '%20');
        console.log(`https://www.waze.com/li?q=${addressWaze}&navigate=yes&zoom=17`)
        let test = `
            <label class="list-group-item">
            <input type="checkbox" class="form-check-input me-1 routeCheck" onchange="checkboxFunc()" value=${address}>
            <u>${name}</u>
            <br>
            ${phone}
            <br>
            ${address}
            <a href="https://www.waze.com/ul?q=${addressWaze}&navigate=yes&zoom=17"
            <i class="fab fa-waze" aria-hidden="true"></i>
            </a>
            </label>
            `;

        form.innerHTML += test;
    }

}

const finishRoute = async () => {
    const response = await fetch(`http://localhost:3000/squad/63c6ec78c2921b45ba6fd18e`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            finished: true
        }),
    });
    //handle response
}

const btnFinished = document.getElementById("btnFinished");
// btnFinished.addEventListener('click', finishRoute)


const checkboxFunc = () => {
    let x = 0;
    let allBoxes = document.getElementsByClassName("routeCheck");
    for (let allBox of allBoxes) {
        if (allBox.checked) {
            x++;
        } else {
            x--;
            break;
        }
    }
    if (x === allBoxes.length) {
        btnFinished.disabled = false;
    } else {
        btnFinished.disabled = true;
    }

}

const changeMarkerColor = function (markers) {
    markers.forEach((marker, index) => {
        let checkbox = document.getElementsByClassName("routeCheck")[index];
        checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
                marker.setIcon({
                    url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    scaledSize: new google.maps.Size(41, 37),
                });
                marker.visible = true;
            } else {
                marker.setIcon(null);
                marker.visible = false;
            }
        });
    });
};


let markers = [];

function calcRoute(data, len, families) {
    let waypoints = [];
    for (let i = 0; i < len; i++) {
        waypoints.push({location: data[i]});
    }
    ;
    let request = {
        origin: myLatLng,
        destination: endLatLng,
        travelMode: 'DRIVING',
        waypoints: waypoints,
        optimizeWaypoints: true
    }
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            reorder(families, result.routes[0].waypoint_order, waypoints.length);
            reorder(waypoints, result.routes[0].waypoint_order, waypoints.length);

            showfamilies(families);
            directionsDisplay.setDirections(result);
            for (i = 0; i < waypoints.length; i++) {
                let marker = new google.maps.Marker({
                    position: waypoints[i].location,
                    map: map,
                    visible: false,
                });
                markers.push(marker);
            }
            changeMarkerColor(markers)
        }
    })
    openMapBtn(waypoints);
}

const openMapBtn = (data) => {
    let destinations = data.map(location => location.lat + "," + location.lng).join("|");
    let url = `https://www.google.com/maps?saddr=${myLatLng.lat},${myLatLng.lng}&daddr=${destinations}`;
    document.getElementById("openMapBtn").addEventListener("click", function () {
        window.open(url, '_blank');
    });
}


function reorder(arr, index, n) {
    var temp = [...Array(n)];
    for (let i = 0; i < n; i++) temp[index[i]] = arr[i];
    for (let i = 0; i < n; i++) {
        arr[i] = temp[i];
        index[i] = i;
    }
}

const logout = async () => {
    console.log('logout')
    const response = await fetch(`http://localhost:3000/auth/logout`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    location.reload();
}

const logOutBtn = document.getElementById("logOutBtn");
if (logOutBtn) {
    logOutBtn.addEventListener('click', logout);
}

const login = async () => {
    const data = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };
    const response = await fetch(`http://localhost:3000/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const body = await response.json();
    if (response.status === 200) {
        window.location.href = 'http://localhost:3000/client/index.html';
    }
};



const EventRegistrationButton = () => {
    const signUpEventBth = document.getElementById("signUpEventShow");
    if(getCookie('role') !== 'none') {
        signUpEventBth.style.display = 'inline-block';
        signUpEventBth.innerText = 'You have registered for the upcoming event';
        signUpEventBth.disabled = true;
    }
}

const signUpEventShowForm = () => {
    const signUpEvent = document.getElementById("signUpEventForm");
    const signUpEventBth = document.getElementById("signUpEventShow");

    signUpEvent.style.display = 'block';
    signUpEventBth.style.display = 'none';
}

const signUpEvent = async () => {
    const signUpEvent = document.getElementById("signUpEventForm");
    const signUpEventBth = document.getElementById("signUpEventShow");

    const data = {
        role: document.getElementById('role').value,
    };
    const response = await fetch(`http://localhost:3000/user/event`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const body = await response.json();
    if (response.status === 200) {
        signUpEvent.style.display = 'none';
        signUpEventBth.style.display = 'inline-block';
        signUpEventBth.innerText = 'You have registered for the upcoming event';
        signUpEventBth.disabled = true;
    }else {
        let message = body.message;
        if(!message) message = 'Your registration was not accepted. Please try again later'
        alert(` ${message} `, 'danger', 'signUpEventForm');
    }
};

const alert = (message, type, id) => {
    const alertPlaceholder = document.getElementById(id);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>',
    ].join('');

    alertPlaceholder.append(wrapper);
};

const showSelectArea= () => {
    const select = document.getElementById("area").value;
    const span = createSelect(select);
    if(span)
        document.getElementById("areaSelect").appendChild(span);
}
const showSelectLanguage= () => {
    const select = document.getElementById("language").value;
    const span = createSelect(select);
    if(span)
        document.getElementById("languageSelect").appendChild(span);
}

const createSelect = (name) => {
    const spanList = document.getElementsByClassName("showSelect");
    for (let i = 0; i < spanList.length; i++) {
        if (spanList[i].innerText === name + ' X') {
            return;
        }
    }
    const newSpan = document.createElement("span");
    newSpan.innerHTML = name + ' X';
    newSpan.className = "showSelect"
    newSpan.addEventListener('click',() => {
        newSpan.remove();
    })
    return newSpan;
}

const getUser = async () => {
    const response = await fetch(`http://localhost:3000/user/details`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const body = await response.json();
    if (response.status === 200) {
        document.getElementById('firstName').value = body.user.name;
        document.getElementById('email').value = body.user.email;
        document.getElementById('phoneNumber').value = body.user.tel;
        document.getElementById('role').value = body.user.role;
    }
};

const editProfile = () => {
    const name =  document.getElementById('firstName');
    const email =  document.getElementById('email');
    const tel = document.getElementById('phoneNumber');
    const role = document.getElementById('role');
    const language = document.getElementById('language');
    const area = document.getElementById('area');

    name.removeAttribute('readonly');
    email.removeAttribute('readonly');
    tel.removeAttribute('readonly');
    role.removeAttribute('disabled');
    area.removeAttribute('disabled');
    language.removeAttribute('disabled');

    document.getElementById('saveButton').style.display = 'block';
    document.getElementById('editButton').style.display = 'none';
}

const saveEditProfile = async () => {
    const data = {
        name: document.getElementById('firstName').value,
        email: document.getElementById('email').value,
        tel: document.getElementById('phoneNumber').value,
        role: document.getElementById('role').value,
    };
    const response = await fetch(`http://localhost:3000/user/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const body = await response.json();
    if (response.status === 200) {
        document.getElementById('saveButton').style.display = 'none';
        document.getElementById('editButton').style.display = 'block';
    }else {
        alert(` ${message} `, 'danger', 'profileMassege');
    }
};

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()
            .split(';')
            .shift();
    }
}



