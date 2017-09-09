var map, featureList, kommuneSearch = [], regionSearch = [], postnummerSearch = [], integreretSearch = [], vuggestueSearch = [], boernehaveSearch = [], dagplejeSearch = [];

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

$(document).on("mouseover", ".feature-row", function(e) {
  highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
});

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(regioner.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#place-btn").click(function() {
  $("#placeModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#address-home").autocomplete({
disabled: true
});

$("#address-from").autocomplete({
disabled: true
});

$("#address-to").autocomplete({
disabled: true
});

$("#address-home").dawaautocomplete({
select: function(event, data) {
  //$("#address-home-choice").text(data.tekst);
  console.log(data.data.id);
}
});

$("#address-from").dawaautocomplete({
select: function(event, data) {
  $("#address-from-choice").text(data.tekst);
}
});

$("#address-to").dawaautocomplete({
select: function(event, data) {
  $("#address-to-choice").text(data.tekst);
}
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  $('#sidebar').toggle();
  map.invalidateSize();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  $("#sidebar").toggle();
  map.invalidateSize();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  $('#sidebar').hide();
  map.invalidateSize();
});

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through integreret layer and add only features which are in the map bounds */
  integreret.eachLayer(function (layer) {
    if (map.hasLayer(integreretLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/' + cleanupName(layer.feature.properties.ETABLERINGSFORM) + '-' + cleanupName(layer.feature.properties.TYPE) + '.png"></td><td class="feature-name">' + layer.feature.properties.NAVN + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through vuggestue layer and add only features which are in the map bounds */
  vuggestue.eachLayer(function (layer) {
    if (map.hasLayer(vuggestueLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/' + cleanupName(layer.feature.properties.ETABLERINGSFORM) + '-' + cleanupName(layer.feature.properties.TYPE) + '.png"></td><td class="feature-name">' + layer.feature.properties.NAVN + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through boernehave layer and add only features which are in the map bounds */
  boernehave.eachLayer(function (layer) {
    if (map.hasLayer(boernehaveLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/' + cleanupName(layer.feature.properties.ETABLERINGSFORM) + '-' + cleanupName(layer.feature.properties.TYPE) + '.png"></td><td class="feature-name">' + layer.feature.properties.NAVN + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
   });
  /* Loop through dagpleje layer and add only features which are in the map bounds */
  dagpleje.eachLayer(function (layer) {
    if (map.hasLayer(dagplejeLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/' + cleanupName(layer.feature.properties.ETABLERINGSFORM) + '-' + cleanupName(layer.feature.properties.TYPE) + '.png"></td><td class="feature-name">' + layer.feature.properties.NAVN + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/* Basemap Layers */
var baseOSM = L.tileLayer("http://a.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["1234"],
  attribution: 'Kortdata &copy; <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> bidragydere, ' + '<code>CC-BY-SA.</code>' + '<br/>' 
  			+ 'Kortikoner fra <a href="https://mapicons.mapsmarker.com/" target="_blank"><img src="https://mapicons.mapsmarker.com/wp-content/uploads/2011/03/miclogo-88x31.gif"  height="32" title="Map Icons Collection"/></a>' + '<br/>'
			+ 'Baseret på <a href="http://bmcbride.github.io/bootleaf/" target="_blank">Bootleaf</a> af <a href="http://bryanmcbride.com" target="_blank">bryanmcbride.com</a>'
});	
var mapquestOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["otile1", "otile2", "otile3", "otile4"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data &copy; <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, ' + '<code>CC-BY-SA.</code>' + '<br/>'
  			+ 'Kortikoner fra <a href="https://mapicons.mapsmarker.com/" target="_blank"><img src="https://mapicons.mapsmarker.com/wp-content/uploads/2011/03/miclogo-88x31.gif"  height="32" title="Map Icons Collection"/></a>' + '<br/>'
			+ 'Baseret på <a href="http://bmcbride.github.io/bootleaf/" target="_blank">Bootleaf</a> af <a href="http://bryanmcbride.com" target="_blank">bryanmcbride.com</a>'
});
var mapquestOAM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency' + '<br/>'
  			+ 'Kortikoner fra <a href="https://mapicons.mapsmarker.com/" target="_blank"><img src="https://mapicons.mapsmarker.com/wp-content/uploads/2011/03/miclogo-88x31.gif"  height="32" title="Map Icons Collection"/></a>' + '<br/>'
			+ 'Baseret på <a href="http://bmcbride.github.io/bootleaf/" target="_blank">Bootleaf</a> af <a href="http://bryanmcbride.com" target="_blank">bryanmcbride.com</a>'
});
var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
}), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
  maxZoom: 19,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
  attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data &copy; <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, ' + '<code>CC-BY-SA.</code>' + ' Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency' + '<br/>'
  			+ 'Kortikoner fra <a href="https://mapicons.mapsmarker.com/" target="_blank"><img src="https://mapicons.mapsmarker.com/wp-content/uploads/2011/03/miclogo-88x31.gif"  height="32" title="Map Icons Collection"/></a>' + '<br/>'
			+ 'Baseret på <a href="http://bmcbride.github.io/bootleaf/" target="_blank">Bootleaf</a> af <a href="http://bryanmcbride.com" target="_blank">bryanmcbride.com</a>'
})]);

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

var kommuner = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "red",
      weight: 1,
      dashArray: [5,10],
      fill: false,
      opacity: 0.75,
      clickable: false
    };
  },
  onEachFeature: function (feature, layer) {
    kommuneSearch.push({
      name: layer.feature.properties.KOMNAVN,
      source: "Kommuner",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/kommuner-hovedstaden.geojson", function (data) {
  kommuner.addData(data);
});

var regioner = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "#aa0000",
      weight: 2,
      dashArray: [5,10],
      fill: false,
      opacity: 0.75,
      clickable: false
    };
  },
  onEachFeature: function (feature, layer) {
    regionSearch.push({
      name: layer.feature.properties.REGIONNAVN,
      source: "Regioner",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/region-hovedstaden.geojson", function (data) {
  regioner.addData(data);
});

var postnumre = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "#333333",
      weight: 1,
      dashArray: [5,5],
      fill: false,
      opacity: 0.75,
      clickable: false
    };
  },
  onEachFeature: function (feature, layer) {
    postnummerSearch.push({
      name: layer.feature.properties.POSTBYNAVN,
      zip: layer.feature.properties.POSTNR,
      source: "Postnumre",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/postnumre.geojson", function (data) {
  postnumre.addData(data);
});

/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});

/* Empty layer placeholder to add to layer control for listening when to add/remove integreret to markerClusters layer */
var integreretLayer = L.geoJson(null);
var integreret = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/" + cleanupName(feature.properties.ETABLERINGSFORM) + "-" + cleanupName(feature.properties.TYPE) + ".png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAVN,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" 
      			+ "<tr><th>Institutionstype</th><td>" + feature.properties.ETABLERINGSFORM + "&nbsp;" + feature.properties.TYPE + "</td></tr>" 
      			+ "<tr><th>Telefon</th><td><a href='tel:" + feature.properties.TELEFON + "'>" + feature.properties.TELEFON + "</a></td></tr>" 
      			+ "<tr><th>Adresse</th><td>" + feature.properties.ADRESSE + "<br/>" + feature.properties.POSTNR + "&nbsp;" + feature.properties.POSTDISTRIKT + "</td></tr>" 
      			+ "<tr><th>Website</th><td><a class='url-break' href='http://" + feature.properties.WEB + "' target='_blank'>" + feature.properties.WEB + "</a></td></tr>"
      			+ "<tr><th>&Aring;bningstider</th><td>"
      				+ "<table class='table table-condensed'>"
      				+ "<tr><th>Mandag </th><td>" + feature.properties.MA + "</td></tr>" 
      				+ "<tr><th>Tirsdag </th><td>" + feature.properties.TI + "</td></tr>" 
      				+ "<tr><th>Onsdag </th><td>" + feature.properties.ON + "</td></tr>" 
      				+ "<tr><th>Torsdag </th><td>" + feature.properties.TO + "</td></tr>"
      				+ "<tr><th>Fredag </th><td>" + feature.properties.FR + "</td></tr>" 
      				+ "<tr><th>L&oslash;rdag </th><td>" + feature.properties.LO + "</td></tr>" 
      				+ "<tr class='active'><th>S&oslash;ndag </th><td>" + feature.properties.SO + "</td></tr>"
      				+"</table>"  
      			+ "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAVN);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) 
      																+ '" lat="' + layer.getLatLng().lat 
      																+ '" lng="' + layer.getLatLng().lng 
      																+ '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/' + cleanupName(layer.feature.properties.ETABLERINGSFORM) + '-' + cleanupName(layer.feature.properties.TYPE) + '.png"></td><td class="feature-name">' + layer.feature.properties.NAVN + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      integreretSearch.push({
        name: layer.feature.properties.NAVN,
        address: layer.feature.properties.ADRESSE,
        source: "Integrerede",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/HOVEDSTADEN-INTEGREREDE.geojson", function (data) {
  integreret.addData(data);
  map.addLayer(integreretLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove vuggestue to markerClusters layer */
var vuggestueLayer = L.geoJson(null);
var vuggestue = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/" + cleanupName(feature.properties.ETABLERINGSFORM) + "-" + cleanupName(feature.properties.TYPE) + ".png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAVN,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" 
      			+ "<tr><th>Institutionstype</th><td>" + feature.properties.ETABLERINGSFORM + "&nbsp;" + feature.properties.TYPE + "</td></tr>" 
      			+ "<tr><th>Telefon</th><td><a href='tel:" + feature.properties.TELEFON + "'>" + feature.properties.TELEFON + "</a></td></tr>" 
      			+ "<tr><th>Adresse</th><td>" + feature.properties.ADRESSE + "<br/>" + feature.properties.POSTNR + "&nbsp;" + feature.properties.POSTDISTRIKT + "</td></tr>" 
      			+ "<tr><th>Website</th><td><a class='url-break' href='http://" + feature.properties.WEB + "' target='_blank'>" + feature.properties.WEB + "</a></td></tr>"
      			+ "<tr><th>&Aring;bningstider</th><td>"
      				+ "<table class='table table-condensed'>"
      				+ "<tr><th>Mandag </th><td>" + feature.properties.MA + "</td></tr>" 
      				+ "<tr><th>Tirsdag </th><td>" + feature.properties.TI + "</td></tr>" 
      				+ "<tr><th>Onsdag </th><td>" + feature.properties.ON + "</td></tr>" 
      				+ "<tr><th>Torsdag </th><td>" + feature.properties.TO + "</td></tr>"
      				+ "<tr><th>Fredag </th><td>" + feature.properties.FR + "</td></tr>" 
      				+ "<tr><th>L&oslash;rdag </th><td>" + feature.properties.LO + "</td></tr>" 
      				+ "<tr class='active'><th>S&oslash;ndag </th><td>" + feature.properties.SO + "</td></tr>"
      				+"</table>"  
      			+ "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAVN);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) 
      																+ '" lat="' + layer.getLatLng().lat 
      																+ '" lng="' + layer.getLatLng().lng 
      																+ '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/' + cleanupName(layer.feature.properties.ETABLERINGSFORM) + '-' + cleanupName(layer.feature.properties.TYPE) + '.png"></td><td class="feature-name">' + layer.feature.properties.NAVN + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      vuggestueSearch.push({
        name: layer.feature.properties.NAVN,
        address: layer.feature.properties.ADRESSE,
        source: "Vuggestuer",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/HOVEDSTADEN-VUGGESTUER.geojson", function (data) {
  vuggestue.addData(data);
  map.addLayer(vuggestueLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove boernehave to markerClusters layer */
var boernehaveLayer = L.geoJson(null);
var boernehave = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/" + cleanupName(feature.properties.ETABLERINGSFORM) + "-" + cleanupName(feature.properties.TYPE) + ".png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAVN,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" 
      			+ "<tr><th>Institutionstype</th><td>" + feature.properties.ETABLERINGSFORM + "&nbsp;" + feature.properties.TYPE + "</td></tr>" 
      			+ "<tr><th>Telefon</th><td><a href='tel:" + feature.properties.TELEFON + "'>" + feature.properties.TELEFON + "</a></td></tr>" 
      			+ "<tr><th>Adresse</th><td>" + feature.properties.ADRESSE + "<br/>" + feature.properties.POSTNR + "&nbsp;" + feature.properties.POSTDISTRIKT + "</td></tr>" 
      			+ "<tr><th>Website</th><td><a class='url-break' href='http://" + feature.properties.WEB + "' target='_blank'>" + feature.properties.WEB + "</a></td></tr>"
      			+ "<tr><th>&Aring;bningstider</th><td>"
      				+ "<table class='table table-condensed'>"
      				+ "<tr><th>Mandag </th><td>" + feature.properties.MA + "</td></tr>" 
      				+ "<tr><th>Tirsdag </th><td>" + feature.properties.TI + "</td></tr>" 
      				+ "<tr><th>Onsdag </th><td>" + feature.properties.ON + "</td></tr>" 
      				+ "<tr><th>Torsdag </th><td>" + feature.properties.TO + "</td></tr>"
      				+ "<tr><th>Fredag </th><td>" + feature.properties.FR + "</td></tr>" 
      				+ "<tr><th>L&oslash;rdag </th><td>" + feature.properties.LO + "</td></tr>" 
      				+ "<tr class='active'><th>S&oslash;ndag </th><td>" + feature.properties.SO + "</td></tr>"
      				+"</table>"  
      			+ "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAVN);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) 
      																+ '" lat="' + layer.getLatLng().lat 
      																+ '" lng="' + layer.getLatLng().lng 
      																+ '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/' + cleanupName(layer.feature.properties.ETABLERINGSFORM) + '-' + cleanupName(layer.feature.properties.TYPE) + '.png"></td><td class="feature-name">' + layer.feature.properties.NAVN + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      integreretSearch.push({
        name: layer.feature.properties.NAVN,
        address: layer.feature.properties.ADRESSE,
        source: "Boernehaver",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/HOVEDSTADEN-BOERNEHAVER.geojson", function (data) {
  boernehave.addData(data);
  map.addLayer(boernehaveLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove dagpleje to markerClusters layer */
var dagplejeLayer = L.geoJson(null);
var dagpleje = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/" + cleanupName(feature.properties.ETABLERINGSFORM) + "-" + cleanupName(feature.properties.TYPE) + ".png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAVN,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" 
      			+ "<tr><th>Institutionstype</th><td>" + feature.properties.ETABLERINGSFORM + "&nbsp;" + feature.properties.TYPE + "</td></tr>" 
      			+ "<tr><th>Telefon</th><td><a href='tel:" + feature.properties.TELEFON + "'>" + feature.properties.TELEFON + "</a></td></tr>" 
      			+ "<tr><th>Adresse</th><td>" + feature.properties.ADRESSE + "<br/>" + feature.properties.POSTNR + "&nbsp;" + feature.properties.POSTDISTRIKT + "</td></tr>" 
      			+ "<tr><th>Website</th><td><a class='url-break' href='http://" + feature.properties.WEB + "' target='_blank'>" + feature.properties.WEB + "</a></td></tr>"
      			+ "<tr><th>&Aring;bningstider</th><td>"
      				+ "<table class='table table-condensed'>"
      				+ "<tr><th>Mandag </th><td>" + feature.properties.MA + "</td></tr>" 
      				+ "<tr><th>Tirsdag </th><td>" + feature.properties.TI + "</td></tr>" 
      				+ "<tr><th>Onsdag </th><td>" + feature.properties.ON + "</td></tr>" 
      				+ "<tr><th>Torsdag </th><td>" + feature.properties.TI + "</td></tr>"
      				+ "<tr><th>Fredag </th><td>" + feature.properties.FR + "</td></tr>" 
      				+ "<tr><th>L&oslash;rdag </th><td>" + feature.properties.LO + "</td></tr>" 
      				+ "<tr class='active'><th>S&oslash;ndag </th><td>" + feature.properties.SO + "</td></tr>"
      				+"</table>"  
      			+ "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAVN);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) 
      																+ '" lat="' + layer.getLatLng().lat 
      																+ '" lng="' + layer.getLatLng().lng 
      																+ '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/' + cleanupName(layer.feature.properties.ETABLERINGSFORM) + '-' + cleanupName(layer.feature.properties.TYPE) + '.png"></td><td class="feature-name">' + layer.feature.properties.NAVN + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      dagplejeSearch.push({
        name: layer.feature.properties.NAVN,
        address: layer.feature.properties.ADRESSE,
        source: "Integrerede",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/HOVEDSTADEN-DAGPLEJER.geojson", function (data) {
  dagpleje.addData(data);
  map.addLayer(dagplejeLayer);
});

map = L.map("map", {
  zoom: 10,
  center: [ 55.6715, 12.5220 ],
  layers: [baseOSM, regioner, markerClusters, highlight],
  zoomControl: false,
  attributionControl: false
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === integreretLayer) {
    markerClusters.addLayer(integreret);
    syncSidebar();
  }
  if (e.layer === vuggestueLayer) {
    markerClusters.addLayer(vuggestue);
    syncSidebar();
  }
  if (e.layer === boernehaveLayer) {
    markerClusters.addLayer(boernehave);
    syncSidebar();
  }
    if (e.layer === dagplejeLayer) {
    markerClusters.addLayer(dagpleje);
    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === integreretLayer) {
    markerClusters.removeLayer(integreret);
    syncSidebar();
  }
  if (e.layer === vuggestueLayer) {
    markerClusters.removeLayer(vuggestue);
    syncSidebar();
  }
  if (e.layer === boernehaveLayer) {
    markerClusters.removeLayer(boernehave);
    syncSidebar();
  }
    if (e.layer === dagplejeLayer) {
    markerClusters.removeLayer(dagpleje);
    syncSidebar();
  }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'>Udviklet af <a href='http://alstrupnext.com'>alstrupnext</a> | </span><a href='#' onclick='jQuery(\"#attributionModal\").modal(\"show\"); return false;'>Tilegnelser</a>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: false,
  strings: {
    title: "Min placering",
    popup: "Du er {distance} {unit} fra dette sted",
    outsideMapBoundsMsg: "Du befinder dig vist uden for kortet"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Kort": baseOSM,
  "Luftfoto": mapquestOAM,
  "Luftfoto med veje": mapquestHYB
};

var groupedOverlays = {
  "Institutionstyper": {
    "<img src='assets/img/integreret.png' width='24' height='28' style='vertical-align:middle;'>&nbsp;Integrerede": integreretLayer,
    "<img src='assets/img/vuggestue.png' width='24' height='28' style='vertical-align:middle;'>&nbsp;Vuggestuer": vuggestueLayer,
    "<img src='assets/img/boernehave.png' width='24' height='28' style='vertical-align:middle;'>&nbsp;B&oslash;rnehaver": boernehaveLayer,
    "<img src='assets/img/dagpleje.png' width='24' height='28' style='vertical-align:middle;'>&nbsp;Dagplejer": dagplejeLayer
  },
  "Omr&aring;der": {
    "<i class='fa fa-shield'></i>&nbsp;Kommuner": kommuner,
    /*"Regioner": regioner,*/
    "<i class='fa fa-envelope'></i>&nbsp;Postdistrikter": postnumre   
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Fit map to kommune bounds */
  map.fitBounds(kommuner.getBounds());
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

  var kommuneBH = new Bloodhound({
    name: "Kommuner",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: kommuneSearch,
    limit: 10
  });

  var regionBH = new Bloodhound({
    name: "Regioner",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: regionSearch,
    limit: 10
  });

  var postnummerBH = new Bloodhound({
    name: "Postdistrikter",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: postnummerSearch,
    limit: 10
  });

  var integreretBH = new Bloodhound({
    name: "Integrerede",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: integreretSearch,
    limit: 10
  });

  var vuggestueBH = new Bloodhound({
    name: "Vuggestuer",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: vuggestueSearch,
    limit: 10
  });

  var boernehaveBH = new Bloodhound({
    name: "Boernehaver",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: boernehaveSearch,
    limit: 10
  });

  var dagplejeBH = new Bloodhound({
    name: "Dagplejer",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: dagplejeSearch,
    limit: 10
  });

  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=DK&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });

  var dawaBH = new Bloodhound({
	name: "DAWA",
	datumTokenizer: function (d) {
		return Bloodhound.tokenizers.whitespace(d.name);
	},
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	remote: {
	  url: "http://dawa.aws.dk/adresser?regionskode=1084&q=%QUERY",
	  filter: function (data) {
        return $.map(data, function (result) {
          return {
            name: result.adressebetegnelse,
            lat: result.adgangspunkt.koordinater[0],
            lng: result.adgangspunkt.koordinater[1],
            source: "DAWA"
          };
        });
	  },
	  ajax: {
        beforeSend: function (jqXhr, settings) {
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
	},
	limit: 10
  });
  kommuneBH.initialize();
  regionBH.initialize();
  postnummerBH.initialize();
  integreretBH.initialize();
  vuggestueBH.initialize();
  boernehaveBH.initialize();
  dagplejeBH.initialize();
  geonamesBH.initialize();
  dawaBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Kommuner",
    displayKey: "name",
    source: kommuneBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><i class='fa fa-shield'></i>&nbsp;Kommuner</h4>"
    }
  }, /*{
    name: "Regioner",
    displayKey: "name",
    source: regionBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Regioner</h4>"
    }
  },*/ {
    name: "Postnumre",
    displayKey: "name",
    source: postnummerBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><i class='fa fa-envelope'></i>&nbsp;Postdistrikter</h4>"
    }  
  }, {    name: "Integrerede",
    displayKey: "name",
    source: integreretBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/integreret.png' width='24' height='28'>&nbsp;Integreret</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "Vuggestuer",
    displayKey: "name",
    source: vuggestueBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/vuggestue.png' width='24' height='28'>&nbsp;Vuggestuer</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "Bornehaver",
    displayKey: "name",
    source: boernehaveBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/boernehave.png' width='24' height='28'>&nbsp;B&oslash;rnehaver</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "Dagplejer",
    displayKey: "name",
    source: dagplejeBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/dagpleje.png' width='24' height='28'>&nbsp;Dagplejer</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
    }
  }, {
    name: "DAWA",
    displayKey: "name",
    source: dawaBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/danmark.png' width='25' height='25'>&nbsp;Adresse</h4>"
    }    
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Kommuner") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "Postnumre") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "Integrerede") {
      if (!map.hasLayer(integreretLayer)) {
        map.addLayer(integreretLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Vuggestuer") {
      if (!map.hasLayer(vuggestueLayer)) {
        map.addLayer(vuggestueLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Boernehaver") {
      if (!map.hasLayer(boernehaveLayer)) {
        map.addLayer(boernehaveLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Dagplejer") {
      if (!map.hasLayer(dagplejeLayer)) {
        map.addLayer(dagplejeLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if (datum.source === "DAWA") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}

function cleanupName( inputstring ) {
	result = inputstring.toLowerCase();
	result = result.replace("æ","ae");
	result = result.replace("ø","oe");	
	result = result.replace("å","aa");
	return result;
}