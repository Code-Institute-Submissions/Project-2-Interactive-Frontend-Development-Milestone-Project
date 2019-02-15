      var map, places, infoWindow;
      var markers = [];
      var autocomplete;
      var countryRestrict = { 'country': 'uk' };
      var MARKER_PATH = 'http://maps.google.com/mapfiles/kml/paddle/';
      var hostnameRegexp = new RegExp('^https?://.+?/');

      var countries = {
        'ar': {
          center: { lat: -35.3, lng: -64.9 },
          zoom: 3.4
        },
        'au': {
          center: { lat: -25.3, lng: 133.8 },
          zoom: 3.6
        },
        'ba': {
          center: { lat: 24.6, lng: -78.1 },
          zoom: 7.6
        },

        'br': {
          center: { lat: -15.2, lng: -56.9 },
          zoom: 3.5
        },
        'ca': {
          center: { lat: 62.0, lng: -110.0 },
          zoom: 2.4
        },
        'ch': {
          center: { lat: -26.8, lng: -70.3 },
          zoom: 3.8
        },
        'cu': {
          center: { lat: 21.6, lng: -79.0 },
          zoom: 5.8
        },
        'cz': {
          center: { lat: 50.0, lng: 14.4 },
          zoom: 6
        },
        'fi': {
          center: { lat: -17.77, lng: 178.16 },
          zoom: 8
        },
        'fr': {
          center: { lat: 46.2, lng: 2.2 },
          zoom: 5
        },
        'de': {
          center: { lat: 51.2, lng: 10.4 },
          zoom: 5
        },
        'ke': {
          center: { lat: 0.37, lng: 38.0 },
          zoom: 5.5
        },
        'mx': {
          center: { lat: 23.6, lng: -102.5 },
          zoom: 4
        },
        'mo': {
          center: { lat: 32.0, lng: -6.6 },
          zoom: 5.8
        },
        'nz': {
          center: { lat: -40.9, lng: 174.9 },
          zoom: 5
        },
        'it': {
          center: { lat: 41.9, lng: 12.6 },
          zoom: 5
        },
        'pe': {
          center: { lat: -10.3, lng: -75.4 },
          zoom: 4.8
        },
        'pt': {
          center: { lat: 39.4, lng: -8.2 },
          zoom: 6
        },
        'sa': {
          center: { lat: -13.62, lng: -172.47 },
          zoom: 8
        },
        'za': {
          center: { lat: -30.6, lng: 22.9 },
          zoom: 4.5
        },
        'es': {
          center: { lat: 40.5, lng: -3.7 },
          zoom: 5
        },
        'to': {
          center: { lat: -21.2, lng: -175.1 },
          zoom: 10
        },
        'tu': {
          center: { lat: 34.0, lng: 9.3 },
          zoom: 5.5
        },
        'uk': {
          center: { lat: 54.3, lng: -3.3 },
          zoom: 5
        },
        'ur': {
          center: { lat: -32.8, lng: -56.3 },
          zoom: 5.5
        },
        'us': {
          center: { lat: 38.3, lng: -97.4 },
          zoom: 3.2
        },
        'zi': {
          center: { lat: -19.0, lng: 29.4 },
          zoom: 5.5
        }
      };

      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: countries['uk'].zoom,
          center: countries['uk'].center,
          mapTypeControl: false,
          panControl: false,
          zoomControl: false,
          streetViewControl: true,
          fullscreenControl: false
        });

        infoWindow = new google.maps.InfoWindow({
          content: document.getElementById('info-content')
        });


        // Create the autocomplete object and associate it with the UI input control.
        // Restrict the search to the default country, and to place type "cities".
        autocomplete = new google.maps.places.Autocomplete(
          /** @type {!HTMLInputElement} */
          (
            document.getElementById('autocomplete')), {
            componentRestrictions: countryRestrict
          });
        places = new google.maps.places.PlacesService(map);

        autocomplete.addListener('place_changed', onPlaceChanged);

        // Add a DOM event listener to react when the user selects a country.
        document.getElementById('country').addEventListener(
          'change', setAutocompleteCountry);

      }

      // When the user selects a city, get the place details for the city and
      // zoom the map in on the city.
      function onPlaceChanged() {
        var place = autocomplete.getPlace();
        if (place.geometry) {
          map.panTo(place.geometry.location);
          map.setZoom(15);
          search();
        }
        else {
          document.getElementById('autocomplete').placeholder = 'Start typing here';
        }
      }


      // Search for accomodation, art galleries, Museums, Bars and Restaurants  
      //  Google maps only allows you to search for one plaace type at a time

      function search() {

        if (document.getElementById("lodging").checked) poi = 'lodging';
        clearMarkers();
        markers = [];
        if (document.getElementById("art_gallery").checked) poi = 'art_gallery';
        clearMarkers();
        markers = [];
        if (document.getElementById("museum").checked) poi = 'museum';
        clearMarkers();
        markers = [];
        if (document.getElementById("bar").checked) poi = 'bar';
        clearMarkers();
        markers = [];
        if (document.getElementById("restaurant").checked) poi = 'restaurant';
        clearMarkers();
        markers = [];
        if (document.getElementById("cafe").checked) poi = 'cafe';
        clearMarkers();
        markers = [];
        if (document.getElementById("movie_theater").checked) poi = 'movie_theater';
        clearMarkers();
        markers = [];

        var search = {

          bounds: map.getBounds(),
          types: [poi],

        };

        places.nearbySearch(search, function(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            clearResults();
            clearMarkers();

            // Create a marker for each place found, and
            // assign a letter of the alphabetic to each marker icon.

            for (var i = 0; i < results.length; i++) {
              var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
              var markerIcon = MARKER_PATH + markerLetter + '.png';
              // Use marker animation to drop the icons incrementally on the map.
              markers[i] = new google.maps.Marker({
                position: results[i].geometry.location,
                animation: google.maps.Animation.DROP,
                icon: markerIcon
              });

              // If the user clicks a place marker, show the details of that place
              // in an info window.

              markers[i].placeResult = results[i];
              google.maps.event.addListener(markers[i], 'click', showInfoWindow);
              setTimeout(dropMarker(i), i * 100);
              addResult(results[i], i);
            }
          }
        });
      }

      // Clear marker from map

      function clearMarkers() {
        for (var i = 0; i < markers.length; i++) {
          if (markers[i]) {
            markers[i].setMap(null);
          }
        }
        markers = [];
      }

      // Set the country restriction based on user input.
      // Also center and zoom the map on the given country.
      function setAutocompleteCountry() {
        var country = document.getElementById('country').value;
        if (country == 'all') {
          autocomplete.setComponentRestrictions({ 'country': [] });
          map.setCenter({ lat: 20, lng: 0 });
          map.setZoom(2);
        }
        else {
          autocomplete.setComponentRestrictions({ 'country': country });
          map.setCenter(countries[country].center);
          map.setZoom(countries[country].zoom);
        }
      }
      // Drop marker on the map 
      function dropMarker(i) {
        return function() {
          markers[i].setMap(map);
        };
      }

      // list markers what correspond by letter to the map
      function addResult(result, i) {
        var results = document.getElementById('results');
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
        var markerIcon = MARKER_PATH + markerLetter + '.png';

        var tr = document.createElement('tr');
        tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
        tr.onclick = function() {
          google.maps.event.trigger(markers[i], 'click');
        };
        
       
        var iconTd = document.createElement('td');
        var nameTd = document.createElement('td');
        var addressTd = document.createElement('td');
        
        var icon = document.createElement('img');
        icon.src = markerIcon;
        icon.setAttribute('class', 'placeIcon');
        icon.setAttribute('className', 'placeIcon');
        iconTd.setAttribute('class', 'placeiconwidth');
        nameTd.setAttribute('class', 'nameiconwidth');
        addressTd.setAttribute('class', 'addressiconwidth');
        var name = document.createTextNode(result.name);
        var address = document.createTextNode(result.vicinity);
        iconTd.appendChild(icon);
        nameTd.appendChild(name);
        addressTd.appendChild(address);
        tr.appendChild(iconTd);
        tr.appendChild(nameTd);
        tr.appendChild(addressTd);
        results.appendChild(tr);
      }


      // Results cleared from map
      function clearResults() {
        var results = document.getElementById('results');
        while (results.childNodes[0]) {
          results.removeChild(results.childNodes[0]);
        }
      }


      // Get the place details for a place. Show the information in an info window,
      // anchored on the marker for the place that the user selected.

      function showInfoWindow() {
        var marker = this;
        places.getDetails({ placeId: marker.placeResult.place_id },
          function(place, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
              return;
            }
            infoWindow.open(map, marker);
            buildIWContent(place);
          });
      }

      // Load the place information into the HTML elements used by the info window.

      function buildIWContent(place) {
        document.getElementById('iw-icon').innerHTML = '<img class="imageicon" ' +
          'src="' + place.icon + '"/>';
        document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
          '">' + place.name + '</a></b>';
        document.getElementById('iw-address').textContent = place.vicinity;

        if (place.formatted_phone_number) {
          document.getElementById('iw-phone-row').style.display = '';
          document.getElementById('iw-phone').textContent =
            place.formatted_phone_number;
        }
        else {
          document.getElementById('iw-phone-row').style.display = 'none';
        }

        // Assign a five-star rating to the place, using a black star ('&#10029;')
        // to indicate the rating the place has earned, and a white star ('&#10025;')
        // for the rating points not achieved.

        if (place.rating) {
          var ratingHtml = '';
          for (var i = 0; i < 5; i++) {
            if (place.rating > (i + 0.5)) {
              ratingHtml += '&#10029;';
            }
            else {
              ratingHtml += '&#10025;';
            }
            document.getElementById('iw-rating-row').style.display = '';
            document.getElementById('iw-rating').innerHTML = ratingHtml;
          }
        }
        else {
          document.getElementById('iw-rating-row').style.display = 'none';
        }

        // The regexp isolates the first part of the URL (domain plus subdomain)
        // to give a short URL for displaying in the info window.

        if (place.website) {
          var fullUrl = place.website;
          var website = hostnameRegexp.exec(place.website);
          if (website === null) {
            website = 'http://' + place.website + '/';
            fullUrl = website;
          }
          document.getElementById('iw-website-row').style.display = '';
          document.getElementById('iw-website').textContent = website;
        }
        else {
          document.getElementById('iw-website-row').style.display = 'none';
        }
      }

      document.getElementById("autocomplete").addEventListener("text", resultsList);

      function resultsList() {
        document.getElementById("autocomplete");
        document.getElementById("listexpand").style.display = "block";
        
      }

      

      
      