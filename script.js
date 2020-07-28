//fetchAnimals.preventDefault();

const petForm = document.querySelector("#pet-form");

//$("#pet-form").click(fetchAnimals());


//global token value that we can update with "refreshTokens"
let token = localStorage.getItem("petfinderToken") || "";


let retryCount = 0;

//fetch animals from API
//before we call fetchAnimals, build a "paramsObject" based on some user input and pass it to the function
function fetchAnimals(){
    document.getElementById("dogListItem").innerHTML = "";
    var chkbox = $("#checkboxMale");
    console.log(chkbox);
    var male = $("#checkboxMale")[0].checked;
    console.log(male);
    var female = $("#checkboxFemale")[0].checked;
    if (male && female) {
        gender= ""
    } else if (male && !female) {
        gender = "&gender=male"
    } else {
        gender= "&gender=female"
    }

    //console.log(female);
    let zip = $("#zip").val();
    console.log(zip);
    // use values from our paramsObject to construct our query URL
    //&gender=${gender}
    let queryURL = `https://api.petfinder.com/v2/animals?type=dog&location=${zip}${gender}`;
    const headers = {"Authorization" : `Bearer ${token}` }
    $.ajax({
        dataType: "json",
        url: queryURL,
        method: "GET",    
        headers: headers
    })
    
    .then(function(data) {
        console.log(data);
        for (var i = 0; i<data.animals.length; i++){
        if(data.animals[i].photos.length == 0){
            var img = "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/48594282/1/?bust=1595698821&width=100"
        } else {
            var img = data.animals[i].photos[0].small;
        }
        var description = data.animals[i].description;
        var name = data.animals[i].name;
        var dogID = data.animals[i].id;

        // var createDiv = `<div class="row" id=${dogID}>
        // <div>
        //   <p><img src="${img}" id= "dogImage" alt="image for dog #1" alt="article preview image"></p>
        // </div>
        // <div>
        //   <h5>${name}</h5>
        //   <p>${description}</p>
        //   <hr>
            
        // </div>
        // </div>`

        
        var createDiv = `<div class="small-2 medium-2 large-12 cell">
        <h5><a class= "pet-detail" data-id =${dogID}>${name}</a></h5>
            <p><img src="${img}" id= "dogImage" alt="image for dog #1" alt="article preview image"></p>
          </div>
          <div class="medium-10 cell">
            
        
            <p>${description}</p>
          </div>
        </div>`






        console.log(createDiv);
        document.getElementById("dogListItem").innerHTML += createDiv;
        }
    })
    .catch(function(err) {
        // console.log(err.status);
        // console.log("hello");
        // console.log(err.statusCode());
        //if the error object has 401 or indicates somehow that our token is expired, refresh the token
        //if our intended call fails due to an expired token, run the below function
        if (err.status != 400 && err.status === 0 && retryCount < 1) {
            refreshTokens()
            .then(function(tokenResponse) {
                retryCount++;
                console.log(tokenResponse);
                if (tokenResponse.access_token) {
                    token = tokenResponse.access_token;
                    localStorage.setItem("petfinderToken", token);
                    //make the indended call again INSIDE of our .then
                    fetchAnimals();
                }
            })
            .catch(function(errorResponse) {
                retryCount++;
                console.log(errorResponse);
            })
        }
        else {
            console.log
        }
    })
}



function refreshTokens() {
    //get user input
    const key = "CIbntt4JECoiWAAsvrXjBl6d0U2btsVpxB2RvYeDvgbvMOfqC9";
    const secret = "f6UaLPI7VZCvetLSQocjTKt0HcMUktilmMOmmcE1"
    let queryURL = `https://api.petfinder.com/v2/oauth2/token`;
    
    return $.ajax({
        dataType: "json",
        url: queryURL,
        method: "POST",    
        data: `grant_type=client_credentials&client_id=${key}&client_secret=${secret}`
    })
    
}


$("#searchBtn").on("click", function(e) {
    e.preventDefault();
    fetchAnimals();
})
//fetchAnimals();


$(".pet-detail").on("click", function() {
    //the button I just clicked has a data-attribute called "data-id"
    var id = $(this).attr("data-id");

    //change to the detail page (details.html)
    window.location.href = `/details.html?id=${id}`;
})