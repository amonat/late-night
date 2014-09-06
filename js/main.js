// Globals
var activeControlProperty = 'starts1413';
var controlProperties = [
  {value:0.8, color:'255,0,0'},
  {value:0.9, color:'255,100,0'},
  {value:1, color:'255,190,0'},
  {value:1.1, color:'0,175,0'},
  {value:1.2, color:'0,128,255'},
  {value:100, color:'0,0,255'}
]

var activeComparisonProperty = 'start_tot';
var comparisonProperties = [
  {value:50, opacity:'0.2'},
  {value:100, opacity:'0.25'},
  {value:250, opacity:'0.3'},
  {value:500, opacity:'0.35'},
  {value:1000, opacity:'0.4'},
  {value:2500, opacity:'0.45'},
  {value:5000, opacity:'0.5'},
  {value:10000, opacity:'0.55'},
  {value:15000, opacity:'0.6'},
  {value:20000, opacity:'0.65'},
  {value:25000, opacity:'0.7'},
  {value:30000, opacity:'0.9'},
  {value:50000, opacity:'0.95'},
  {value:1000000, opacity:'1'}
  ]
$('.map-control-total').on('click', function() {
  activeControlProperty = $(this).attr('id');
  d3.selectAll('.segment').attr('style', setZipColor)
})
$('.map-control-comparison').on('click', function() {
  activeComparisonProperty = $(this).attr('id');
  d3.selectAll('.segment').attr('style', setZipColor)
})

var zipFeatures;

// Renderers
function renderRoads(zips) {
  mapElement = $("#map-canvas");

  var width = mapElement.width(),
    height = mapElement.height();

  svg = d3.select("#map-canvas").append("svg")
    .attr("width", width)
    .attr("height", height);

  var projection = d3.geo.mercator()
    .rotate([0, 0])
    .center([-70.95, 42.22])
    .scale(20000)
    .translate([width / 2, height / 2]);


  var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

  var zipFeature = svg.append("g");


  zipFeatures = zipFeature.selectAll("path")
    .data(zips.features)
    .enter().append("path")
    .attr("d", d3.geo.path().projection(projection))
    .attr('class','segment')
    .attr('style', setZipColor)
    .on('click',function(d, i) {

    })
    .on('mouseover', function(d, i) {
      $('#segment-detail').show();
      zipCode = d.properties.ZCTA5CE10;
      startsPercentChange = Math.round((d.properties.starts1413-1)*100,0);
      endsPercentChange = Math.round((d.properties.ends1413-1)*100,0);
      $('#detail-zip').html(zipCode);
      $('#detail-start-tot').html(d.properties.start_tot);
      $('#detail-start-percent').html(startsPercentChange);
      $('#detail-end-tot').html(d.properties.Ends_tot);
      $('#detail-end-percent').html(endsPercentChange);
      $.getJSON('http://ziptasticapi.com/'+zipCode+'?callback=').then( function (geocodedInformation) {
        $('#detail-city').html(geocodedInformation.city);
      });
    })
  svg.call(zoom);

  function zoomed() {
    zipFeature.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    var strokeWidth = zipFeature.style("stroke-width");
    zipFeature.style("stroke-width", strokeWidth / zoom.scale());
  }

};

// Helpers
function setZipColor(d, i) {
  var value;

  // Set opacity
  var control = d.properties[activeControlProperty]
  for (var i=0; i<controlProperties.length; i++) {
    var controlProperty = controlProperties[i];
    if (controlProperty.value > control) {
      var color = controlProperty.color
      break;
    }
  }

  // Set color
  var comparison = d.properties[activeComparisonProperty]
  for (var i=0; i<comparisonProperties.length; i++) {
    var comparisonProperty = comparisonProperties[i]
    if (comparisonProperty.value > comparison) {
      var opacity = comparisonProperty.opacity;
      break;
    }
  }

  return('fill: rgba('+color+','+opacity+')')

}

// Data
$.getJSON("data/clip8.json").then( function (zipsResults) {
  renderRoads(zipsResults);
});
