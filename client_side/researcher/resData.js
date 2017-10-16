var dataReturned = "";
var countryData = ""
var InstitutionNames = "";
var InstitutionValues = "";
var ResearcherNames = "";
var ResearcherValues = "";
var docNames = "";
var docValues = "";
var yearNames;
var yearValues;
var yearNamesOne;
var yearValuesOne;
var momNames;
var momValues;
var momNamesOne ;
var momValuesOne;
var oTable;
var drewTable = false;

var selectedCountry = "";

var sessionData = JSON.parse(localStorage.getItem("sessionData"));

$("#res-title").text("Selected Expert: " + sessionData.resData.resName.toUpperCase());

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function capitalize(tstring) {
  return tstring.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

createTable();
buildRates();
function createTable(callback){
  console.log("creating dt");
  if(!drewTable){
    drewTable = true;
    var ajaxParams = JSON.parse(JSON.stringify(sessionData));
    if(ajaxParams.repData) delete ajaxParams.repData;
    oTable = $('#doc-subset-table').DataTable({
      serverSide: true,
      ajax: {
        type: "GET",
        crossDomain: true,
        xhrFields: {
          withCredentials: true,
        },
        url: config.dataURL+"/researcher/datatablesRes.sjs",
        data: {params: JSON.stringify(ajaxParams)},

      },

      "scrollCollapse": true,
      "order": [[ 0, "desc" ]],
      "columnDefs": [

        {
          "bVisible": false, "aTargets": [2,3]
        },
        {
          "render": function ( data, type, row ) {
            data = data.replace(";","");
            data = data.replace(",","");
            var odata = data;
            data = data.toLowerCase();
            var str = "";
            for(var i in data){
              var ret_str = "";
              for(var i in data){
                ret_str += '<a onclick="clickRes(this,event)" id="'+ data[i] +'" href="#">'+data[i]+'</a>'
              }
              return(ret_str);
            }
            return '<a onclick="clickInst(this,event)" id="'+odata+'" href="#">'+data+'</a>';
          },
          "targets": 2
        },
        {
          targets: 4,
          render: function(data,type,row){
            console.log(row[5]);
            return '<a onclick = "clickDoc(this,event)" class = "'+row[6]+'" id = "'+row[5]+'" href="#" target="_blank">' + data + '</a>';
          }
        },

      ],
      dom: 'l<"toolbar">Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ]
    });
  }
}

var ajaxParams = JSON.parse(JSON.stringify(sessionData));
if(ajaxParams.repData) delete ajaxParams.repData;
var dataReturned = "";
$.ajax({
  url: config.dataURL+"/researcher/res_info2.sjs",
  type: "GET",
  xhrFields: { withCredentials: true },
  data: JSON.stringify(ajaxParams),
  dataType: 'json',
  success: function(retdata){
    //console.log(retdata["resName"]);
    numTotal = retdata["total"];
    numPubmed = retdata["numPubmed"];
    numPatent = retdata["numPatent"];
    numNsf = retdata["numNsf"];
    var numNih = retdata["numNih"];
    console.log("numNih " +numNih);
    numCTrials = retdata["numCTrials"];
    numFDA = retdata["numFDA"];
    numTotal = retdata["total"];
    numVC = retdata.numVC;
    if (numPubmed === undefined) numPubmed = 0;
    if (numPatent === undefined) numPatent = 0;
    if (numNsf === undefined) numNsf = 0;
    if (numCTrials === undefined) numCTrials = 0;
    if (numNih === undefined) numNih = 0;
    if(numVC==undefined) numVC = 0;
    if(numFDA==undefined) numFDA = 0;


    //console.log(Object.getOwnPropertyNames(resData));
    var x = document.getElementById("res_summary_data").rows[2].cells;
    x[1].innerHTML = numTotal
    x = document.getElementById("res_summary_data").rows[3].cells;
    x[1].innerHTML = numPubmed;
    x = document.getElementById("res_summary_data").rows[4].cells;
    x[1].innerHTML = numPatent;
    x = document.getElementById("res_summary_data").rows[5].cells;
    x[1].innerHTML = numNih;
    x = document.getElementById("res_summary_data").rows[6].cells;
    x[1].innerHTML = numNsf;
    x = document.getElementById("res_summary_data").rows[7].cells;
    x[1].innerHTML = numCTrials;
    x = document.getElementById("res_summary_data").rows[8].cells;
    x[1].innerHTML = numVC;
    x = document.getElementById("res_summary_data").rows[9].cells;
    x[1].innerHTML = numFDA;
  }
  //error: function() {
  // alert("error");
  //}
});
//document.getElementById("title").innerHTML = "Detailed Data for Institution: "+capitalize(decodeURI(pars.thisCompName));


function buildRates(){
  //
  // Code for plotting charts
  var ajaxParams = JSON.parse(JSON.stringify(sessionData));
  if(ajaxParams.repData) delete ajaxParams.repData;
  $.ajax({
    url: config.dataURL+"/researcher/resVsAll_rates.sjs",
    type: "GET",
    xhrFields: { withCredentials: true },
    data: JSON.stringify(ajaxParams),
    dataType: 'json',
    success: function(retdata){
      console.log("complete");
      console.log(retdata);
      yearNames = retdata.main.yearNames;
      yearValues = retdata.main.yearValues;
      yearNamesOne = retdata.oneInst.yearNames;
      yearValuesOne = retdata.oneInst.yearValues;
      momNames = retdata.main.momentumKeys;
      momValues = retdata.main.momentumVals;
      momNamesOne = retdata.oneInst.momentumKeys;
      momValuesOne = retdata.oneInst.momentumVals;
      //			console.log(Institution_Name,retdata.InstitutionNames,retdata,InstitutionValues);
      my_chart();
      //			my_chart(parsed_response);

    }
    //		error: function() {
    //			alert("error");
    //		}
  });
}



function my_chart() {
  //
  // Second chart


  $('#cluster').highcharts({
    chart: {
      zoomType: 'xy',
      height: 300
    },
    title: {
      text: 'Clusters by Year'
    },
    subtitle: {
      text: ''
    },
    xAxis: [{
      categories: yearNames,
      crosshair: true
    }],
    yAxis: [{ // Primary yAxis
      labels: {
        style: {
          color: Highcharts.getOptions().colors[1]
        }
      },
      title: {
        text: 'All Documents',
        style: {
          color: Highcharts.getOptions().colors[1]
        }
      }
    }, { // Secondary yAxis
      title: {
        text: "This Expert",
        style: {
          color: Highcharts.getOptions().colors[0]
        }
      },
      labels: {
        style: {
          color: Highcharts.getOptions().colors[0]
        }
      },
      opposite: true
    }],
    tooltip: {
      shared: true
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      x: 50,
      verticalAlign: 'top',
      y: 30,
      floating: true,
      backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
    },
    series: [
      {

        name: 'This Expert',
        data: yearValuesOne,
        type: 'column',
        yAxis: 1,
        tooltip: {
          valueSuffix: ' docs'
        }
      },
      {
        name: 'All',
        data: yearValues,
        type: 'spline',
        tooltip: {
          valueSuffix: ' docs'
        }
      }
    ]
  });



  $('#compRate').highcharts({
    chart: {
      zoomType: 'xy'
    },
    title: {
      text: 'Expert Activity vs Industry'
    },
    subtitle: {
      text: ''
    },
    xAxis: [{
      categories: yearNames,
      crosshair: true
    }],
    yAxis: [{ // Primary yAxis
      labels: {
        style: {
          color: Highcharts.getOptions().colors[1]
        }
      },
      title: {
        text: 'All Documents',
        style: {
          color: Highcharts.getOptions().colors[1]
        }
      }
    }, { // Secondary yAxis
      title: {
        text: 'This Expert',
        style: {
          color: Highcharts.getOptions().colors[0]
        }
      },
      labels: {
        style: {
          color: Highcharts.getOptions().colors[0]
        }
      },
      opposite: true
    }],
    tooltip: {
      shared: true
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      x: 50,
      verticalAlign: 'top',
      y: 50,
      //maxHeight: 500,
      floating: true,
      backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
    },
    series: [
      {
        name: 'This Expert',
        data: yearValuesOne,
        type: 'column',
        yAxis: 1,
        tooltip: {
          valueSuffix: ' docs'
        }
      },
      {
        name: 'All',
        data: yearValues,
        type: 'spline',
        tooltip: {
          valueSuffix: ' docs'
        }
      }
    ]
  });



  //
  // Second chart

  $('#compMom').highcharts({
    chart: {
      zoomType: 'xy'
    },
    title: {
      text: 'Expert Acceleration vs Industry'
    },
    subtitle: {
      text: ''
    },
    xAxis: [{
      categories: momNames,
      crosshair: true
    }],
    yAxis: [{ // Primary yAxis
      labels: {
        style: {
          color: Highcharts.getOptions().colors[1]
        }
      },
      title: {
        text: 'All Documents',
        style: {
          color: Highcharts.getOptions().colors[1]
        }
      }
    }, { // Secondary yAxis
      title: {
        text: "This Experts",
        style: {
          color: Highcharts.getOptions().colors[0]
        }
      },
      labels: {
        style: {
          color: Highcharts.getOptions().colors[0]
        }
      },
      opposite: true
    }],
    tooltip: {
      shared: true
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      x: 50,
      verticalAlign: 'top',
      y: 50,
      floating: true,
      backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
    },
    series: [
      {
        name: 'This Expert',
        data: momValuesOne,
        type: 'spline',
        //				type: 'column',
        yAxis: 1,
        tooltip: {
          valueSuffix: ' docs'
        }
      },
      {
        name: 'All',
        data: momValues,
        type: 'spline',
        tooltip: {
          valueSuffix: ' docs'
        }
      }
    ]
  });







};
