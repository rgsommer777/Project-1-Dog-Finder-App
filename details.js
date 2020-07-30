$(document).ready(function(){
const petForm = document.querySelector("#pet-form");

//$("#pet-form").click(fetchAnimals());

//global token value that we can update with "refreshTokens"
let token = localStorage.getItem("petfinderToken") || "";

let retryCount = 0;

//fetch animals from API
//before we call fetchAnimals, build a "paramsObject" based on some user input and pass it to the function
function fetchAnimals() {
  var urlID = window.location.search;
  var id = urlID.slice(4);
  console.log(id);
  var queryURL = `https://api.petfinder.com/v2/animals/${id}`;
  const headers = { Authorization: `Bearer ${token}` };
  $.ajax({
    dataType: "json",
    url: queryURL,
    method: "GET",
    headers: headers,
  })

    .then(function (data) {
        var address = data.animal.contact.address.address1+ ", " + data.animal.contact.address.city + ", " + data.animal.contact.address.state;
        console.log(address);    
        L.mapquest.key = "crYacDSFqhpuAKHRlHw86gCJdPicJetP";
        
            var map = L.mapquest.map('map', {
              center: [0, 0],
              layers: L.mapquest.tileLayer('map'),
              zoom: 1
            });
        
            L.mapquest.geocoding().geocode(address);
          
      console.log(data);
      document.getElementById("dogContainer").innerHTML = "";
      if (data.animal.photos.length == 0) {
        var img =
          "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/48594282/1/?bust=1595698821&width=100";
      } else {
        var img = data.animal.photos[0].medium;
      }
      console.log(img);
      var description = data.animal.description;
      var email = data.animal.contact.email;
      //console.log(email);
      var phone = data.animal.contact.phone;
      var name = data.animal.name;

      var createDiv = `<div class="grid-x grid-margin-x">
            <div class="small-4 medium-6 large-6 cell">
              <div class="dogContainer">
                <h3><div id ="dogName">${name}</h3>
                <img src="${img}" id= "dogDtlImg" alt="image for dog" >
                  <div class="small-9 medium-6 large-6 cell" id="dogDescription">
                  <p>${description}</p>
              </div>
            </div>
        </div>`;

      console.log(createDiv);
      document.getElementById("dogContainer").innerHTML = createDiv;
      var createEmail = `<h5>Email: ${email}</h5>`
      document.getElementById("contactEM").innerHTML = createEmail;
      var createPhone = `<h5>Phone: ${phone}</h5>`
      document.getElementById("contactPh").innerHTML = createPhone;

      renderMap(data);
    })
    .catch(function (err) {
      // console.log(err.status);
      // console.log("hello");
      // console.log(err.statusCode());
      //if the error object has 401 or indicates somehow that our token is expired, refresh the token
      //if our intended call fails due to an expired token, run the below function
      if (err.status != 400 && err.status === 0 && retryCount < 1) {
        refreshTokens()
        .then(function (tokenResponse) {
            retryCount++;
            console.log(tokenResponse);
            if (tokenResponse.access_token) {
              token = tokenResponse.access_token;
              localStorage.setItem("petfinderToken", token);
              //make the indended call again INSIDE of our .then
              fetchAnimals();
            }
          })
          .catch(function (errorResponse) {
            retryCount++;
            console.log(errorResponse);
          });
      } else {
        console.log;
      }
    });
}

function refreshTokens() {
  //get user input
  const key = "CIbntt4JECoiWAAsvrXjBl6d0U2btsVpxB2RvYeDvgbvMOfqC9";
  const secret = "f6UaLPI7VZCvetLSQocjTKt0HcMUktilmMOmmcE1";
  let queryURL = `https://api.petfinder.com/v2/oauth2/token`;

  return $.ajax({
    dataType: "json",
    url: queryURL,
    method: "POST",
    data: `grant_type=client_credentials&client_id=${key}&client_secret=${secret}`,
  });
}


 // var address = data.animal.contact.address.city + ", " + data.animal.contact.address.state;
  //  console.log(address);


fetchAnimals();
})
// var urlID = window.location.search;
// var id = urlID.slice(4);
// console.log(id);
// var queryURL = `https://api.petfinder.com/v2/animals/${id}`;
