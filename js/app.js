



  var form = document.getElementById("searchtrainsform");
  var trainarray = [];
  var departure;
  var arrival;

  var opts = {
     lines: 11, // The number of lines to draw
     length: 15, // The length of each line
     width: 10, // The line thickness
     radius: 30, // The radius of the inner circle
     corners: 1, // Corner roundness (0..1)
     rotate: 0, // The rotation offset
     direction: 1, // 1: clockwise, -1: counterclockwise
     color: '#000', // #rgb or #rrggbb
     speed: 0.6, // Rounds per second
     trail: 60, // Afterglow percentage
     shadow: false, // Whether to render a shadow
     hwaccel: false, // Whether to use hardware acceleration
     className: 'spinner', // The CSS class to assign to the spinner
     zIndex: 2e9, // The z-index (defaults to 2000000000)
     top: 'auto', // Top position relative to parent in px
     left: 'auto' // Left position relative to parent in px
   };
   var spinner = null;
   var spinner_div = 0;

  window.addEventListener("DOMContentLoaded", init, false);


  function init() {
      indexedDBHelper.open().then(function(){
          alert ("init success");

          //addgtfsstations();
      }, function(err){
          alert(err);
      });
      spinner_div = $('#spinner').get(0);
  }
  //initialize indexedDB


 function addgtfsstations () {
         var selectdeparture = document.getElementById('departurelist');
         var selecteddeparture = selectdeparture.options[selectdeparture.selectedIndex];
         departure = selecteddeparture.value;

         var selectarrival = document.getElementById('arrivallist');
         var selectedarrival = selectarrival.options[selectarrival.selectedIndex];
         arrival = selectedarrival.value;

        //  indexedDBHelper.deleteTodo(1);
        //  indexedDBHelper.deleteTodo(2);
          indexedDBHelper.addgtfsstations(departure,arrival).then(function(){
            alert ("addtodo success");
        }, function(err){
            alert(err);
        });

        indexedDBHelper.retreivegtfsstations(departure,arrival).then(function(){
          alert ("retreive success");
      }, function(err){
          alert(err);
      });
        //departure = '';
        return false;
    };


  form.addEventListener("submit", function(evt) {
    //saveSelectedStations();
          console.log ("Inside Submit");
          var selectdeparture = document.getElementById('departurelist');
          var selecteddeparture = selectdeparture.options[selectdeparture.selectedIndex];
          departure = selecteddeparture.value;

          console.log (selecteddeparture);
          console.log ("Departure: " + selecteddeparture.value);

          var selectarrival = document.getElementById('arrivallist');
          var selectedarrival = selectarrival.options[selectarrival.selectedIndex];
          arrival = selectedarrival.value;
          console.log (selectedarrival);
          console.log ("Arrival: " + selectedarrival.value);

          if (departure == arrival){
              // Both departure and arrivals cannot be the same
              var html =  "<div id='errorMsg' class='alert alert-danger'>" +  " <strong>Departure and arrival cannot be the same station. Please fix it and try again </strong>" + "</div>";
              $(form).after(html);
              evt.preventDefault();
          }
          else {
          $('#errorMsg').hide();
          addgtfsstations();
          showTrains(departure, arrival);
          evt.preventDefault();
          }


  });



// Update the list of todo items.
function refreshGTFSStations() {
    bartgtfsDB.fetchTodos(function(gtfsstations) {

    for(var i = 0; i < gtfsstations.length; i++) {
      // Read the todo items backwards (most recent first).
      var gtfsstation = gtfsstations[(gtfsstations.length - 1 - i)];

    //  console.log ("Timestamp: " +gtfsstation.timestamp);
    //  console.log ("Departure: " + gtfsstation.departure);
    //  console.log ("Arrival: " + gtfsstation.arrival);

    }

  });
}



function showTrains(departure, arrival)    {

  if(spinner == null) {
          spinner = new Spinner(opts).spin(spinner_div);
        } else {
          spinner.spin(spinner_div);
        }

  // Parse the stop_time data
  var bartStopTimesArray;
  Papa.parse('../data/stop_times.txt', {
          delimiter: ",",
          download:true,
          header:true,
          complete: function(results) {
             bartStopTimesArray = results.data;
            //console.log (bartStopTimesArray)
            //console.log (bartStopTimesArray.length)
            var matchingStops = bartStopTimesArray.filter(getStopsbyTimeofDay);
            console.log (matchingStops)
            console.log (matchingStops.length)
            var arrivalArray = matchingStops.filter(matchArrival);
            var departureArray = matchingStops.filter(matchDeparture);
            // console.log ("Arrival Array :" );
            // console.log (arrivalArray);
            // console.log (arrivalArray.length);
            // console.log ("Departure Array :" );
            // console.log (departureArray);
            // console.log (departureArray.length);

            getListofTrains (departureArray, arrivalArray);
            spinner.stop(spinner_div);

         }
    });

}

function parseMillisecondsIntoReadableTime(milliseconds){
  //Get hours from milliseconds
  var hours = milliseconds / (1000*60*60);
  var absoluteHours = Math.floor(hours);
  var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

  //Get remainder from hours and convert to minutes
  var minutes = (hours - absoluteHours) * 60;
  var absoluteMinutes = Math.floor(minutes);
  var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

  //Get remainder from minutes and convert to seconds
  var seconds = (minutes - absoluteMinutes) * 60;
  var absoluteSeconds = Math.floor(seconds);
  var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;


  return h + ':' + m + ':' + s;
}






function getListofTrains (departureArray, arrivalArray){

  var trainsList =[];
  var finaltrainsList =[];
  var uniqueStopheadsign = [];
  var arrival_time = new Date();
  var departure_time = new Date();
  for (i=0; i< departureArray.length;i++) {
     console.log(departureArray[i].stop_id);

     // Get all the unique destinations from the departure array
       if(uniqueStopheadsign.indexOf(departureArray[i].stop_headsign) === -1){
          uniqueStopheadsign.push(departureArray[i].stop_headsign);
       }
   }
    console.log(uniqueStopheadsign);
// Match the unique destination from the departure array to arrival array stop_headsign, so that it will point to the same trip id
   for (i=0; i< uniqueStopheadsign.length; i++){
      var result = arrivalArray.filter (
        function (value) {
           if ((value.stop_headsign == uniqueStopheadsign[i]) ){
             trainsList.push(value);
           return true;
           }
           else {
           return false;
           }
        }
      );

   }

   //Now that we matched destinations,  Check if the departure array and arrival array has the same tripID
   // and stop id of departure is smaller than arrival

    for (i=0; i< departureArray.length; i++){

      var result = trainsList.filter (
        function (value) {

          //  console.log ("Number of stops: "  + "Arrival" + " "+  value.stop_sequence +  " Departure" +" "+ departureArray[i].stop_sequence   );
          //   console.log ("Trip Id: "  + "Arrival" + " "+  value.trip_id +  " Departure" +" "+ departureArray[i].trip_id   );

           if ( value.trip_id == departureArray[i].trip_id){



            // ( departureArray[i].stop_sequence > value.stop_sequence) && (value.trip_id == departureArray[i].trip_id)
               // get the number of stops
              //  console.log ("Number of stops: "  + "Arrival" + " "+  value.stop_sequence +  " Departure" +" "+ departureArray[i].stop_sequence   );
               //
              //  // arrival Time
              //  var strarrivaltime = String (value.arrival_time);
              //  var arrayOfTime = strarrivaltime.split(':');
              //  arrival_time.setHours(arrayOfTime[0], arrayOfTime[1], arrayOfTime[2]);
               //
              //  var strdeparturetime = String (departureArray[i].departure_time );
              //  var arrayOfTime = strdeparturetime.split(':');
              //  departure_time.setHours(arrayOfTime[0], arrayOfTime[1], arrayOfTime[2]);
              //  var diff = Math.abs(departure_time-arrival_time);
               //
              //  var time = parseMillisecondsIntoReadableTime(diff);
               //
               //
              //   console.log ("Duration: "+ time );

               finaltrainsList.push(value);
           return true;

           }
           else {
           return false;
           }
        }
      );



    }

   //console.log (trainsList);
   //console.log (trainsList.length);
  //  console.log (finaltrainsList);
  //  console.log (finaltrainsList.length);
  //  console.log (departureArray);
  //  console.log (departureArray.length);

    var template = $("#stoptimes_List").html();
    $("#listoftrains").html(_.template(template,{stoptimestabledata:finaltrainsList}));
    loadstoptimesDataTable();

    var template = $("#departuretimes_List").html();
    $("#departuretimetablelist").html(_.template(template,{deptimestabledata:departureArray}));
    loaddeparturetimesDataTable();



}





function matchDeparture(value,index,arr){
  // var departure = $('#inputdeparture').val();
  //  var selectdeparture = document.getElementById('departurelist');
  //  var selecteddeparture = selectdeparture.options[selectdeparture.selectedIndex];
  //  var departure = selecteddeparture.value;
   if (departure){
         if (value.stop_id == departure ){
           return true;
         }
         else {
           return false;
         }
    }
}

function matchArrival(value,index,arr){
  // var arrival = $('#inputarrival').val();

  //  var selectarrival = document.getElementById('arrivallist');
  //  var selectedarrival = selectarrival.options[selectarrival.selectedIndex];
  //  var arrival = selectedarrival.value;
   console.log("Arrival :" + arrival);
   if (arrival){
         if (value.stop_id == arrival ){

           return true;
         }
         else {

           return false;
         }
    }
}





function getStopsbyTimeofDay(value,index,arr){




   var currTime = new Date();
   var arrival_time = new Date();
   var departure_time = new Date();
   var sunday = false;
   var saturday = false;
   // Extract hour, min,sec from today's date
   var hour= currTime.getHours();
   var min = currTime.getMinutes();
   var sec = currTime.getSeconds();
   currTime.setHours(hour, min, sec);

   // arrival Time
   var strarrivaltime = String (value.arrival_time);
   var arrayOfTime = strarrivaltime.split(':');
   arrival_time.setHours(arrayOfTime[0], arrayOfTime[1], arrayOfTime[2]);

   // Get day of the week
    var day= currTime.getDay();

    // Get sunday
    if (day == 0 ){

      sunday = true;
     }
     else if ( day == 6){
       // Saturday
       saturday = true;
      }

  // Show only matching arrival and departure starting from currTime
  if (sunday){

    //console.log ("Weekend : sunday");
        if (  (value.trip_id.indexOf('SUN')!=-1) && ( arrival_time >= currTime) && (value.stop_id == departure|| value.stop_id == arrival) ) {
            return true;
            console.log ('Value is ' + value.stop_id);
         }
        else {
            return false;
        }
  }  // weekend

  else if (saturday){

  //console.log ("Weekend : saturday");
    if (   (value.trip_id.indexOf('SAT')!=-1) && ( arrival_time >= currTime) && (value.stop_id == departure|| value.stop_id == arrival) ) {
        return true;
        console.log ('Value is ' + value.stop_id);
     }
    else {
        return false;
    }

  }

  else {
  //  console.log ("Weekday");

    if (  (value.trip_id.indexOf ('SUN') == -1) && (value.trip_id.indexOf ('SAT')==-1) && ( arrival_time >= currTime) && (value.stop_id == departure|| value.stop_id == arrival) ) {
        return true;
        console.log ('Value is ' + value.stop_id);
     }
    else {
        return false;
    }


  }

}

function loadstoptimesDataTable() {
  // Load Datatables after Tabletop is loaded
  $('#stoptimes-table').dataTable({
      "bAutoWidth": false,
      "oLanguage": {
          "sLengthMenu": "_MENU_ records per page"
      },
      "iDisplayLength": 25,
      "bPaginate": true,
      "bFilter": true,
      "bInfo": true,
      "aaSorting": [[ 0, "asc" ]],
      "aoColumns": [
         {
              "sWidth": "10%"
              // "sType": "formatted-num"
          },{
              "sWidth": "30%"
              // "sType": "formatted-num"
          },{
              "sWidth": "30%"
              // "sType": "formatted-num"
          },{
              "sWidth": "10%"
              // "sType": "formatted-num"
          },{
              "sWidth": "10%"
              // "sType": "formatted-num"
          },{
              "sWidth": "50%"
              // "sType": "formatted-num"
          }
      ],
      // Fix thead to top of page when scrolling past it
      "initComplete": function(settings, json) {
          $('#stoptimes-table').show();
      }
  });
// Close loadDataTable
};

function loaddeparturetimesDataTable() {
  // Load Datatables after Tabletop is loaded
  $('#departure-table').dataTable({
      "bAutoWidth": false,
      "oLanguage": {
          "sLengthMenu": "_MENU_ records per page"
      },
      "iDisplayLength": 25,
      "bPaginate": true,
      "bFilter": true,
      "bInfo": true,
      "aaSorting": [[ 0, "asc" ]],
      "aoColumns": [
         {
              "sWidth": "10%"
              // "sType": "formatted-num"
          },{
              "sWidth": "30%"
              // "sType": "formatted-num"
          },{
              "sWidth": "30%"
              // "sType": "formatted-num"
          },{
              "sWidth": "10%"
              // "sType": "formatted-num"
          },{
              "sWidth": "10%"
              // "sType": "formatted-num"
          },{
              "sWidth": "50%"
              // "sType": "formatted-num"
          }
      ],
      // Fix thead to top of page when scrolling past it
      "initComplete": function(settings, json) {
          $('#departure-table').show();
      }
  });
// Close loadDataTable
};




// if ('serviceWorker' in navigator) {
//    navigator.serviceWorker
//    .register('./sw.js')
//    .then (function() { console.log('Servie Worker Registered'); });
//
// }
