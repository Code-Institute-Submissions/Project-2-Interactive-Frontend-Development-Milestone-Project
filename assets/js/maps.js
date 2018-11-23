 function initMap(){
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 1.7,
        center: {
            lat: 17.619261,
            lng: 20.134766
        }
    }); 
    

        var input = document.getElementById('pac-input');

    var autocomplete = new google.maps.places.Autocomplete(input);        
                   
    var labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

           
    var locations = [
         
        { lat: 55.863801, lng: -4.251661 }, //  Glasgow central, Scotland
        { lat: 55.876348, lng: -4.297794 }, // Glasgow West, Scotland
        { lat: 55.953080, lng: -3.189861 }, // Edinburgh, Scotland
        { lat: 48.855652, lng:  2.350145 },  // Paris, France
        { lat: 43.710590, lng:  7.259350 },  // Nice, France
        { lat: 40.413774, lng:  -3.707047 },  // Madrid, Spain
        { lat: 41.901770, lng:  12.491347 },  // Rome, Italy
        { lat: 45.439899, lng:  12.318674 },  // Venice, Italy
        { lat: 40.707299, lng: -74.012615 }, // New York, America
        { lat: 36.485994, lng: -119.825945 }, // California, America
        { lat: 27.764441, lng: -81.823893 },  // Florida, America
        { lat: -33.869531, lng: 151.201544 }  // Sydney, Australia
    ];
    
    
                   
    var markers = locations.map(function(location, i) {
        return new google.maps.Marker({
            position: location,
            label: labels[i % labels.length]
        });
    });
                   
    var markerCluster = new MarkerClusterer(map, markers,
    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});




      function search() {
        var search = {

       } };
       
       
       
 }
 
 
 