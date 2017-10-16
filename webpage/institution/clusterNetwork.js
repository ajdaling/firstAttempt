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
var momNamesOne;
var momValuesOne;
var oTable;
var net_topic;
var selectedCountry = "";

var keyword;

/*var sessionData = JSON.parse(localStorage.getItem("sessionData"));
if(!sessionData.vizData){
sessionData.vizData = {};
sessionData.vizData.start_year = sessionData.start_year;
sessionData.vizData.end_year = sessionData.end_year;
updateSessionData(sessionData);
}*/

var selectedNode = null;

var allNodes = null;
var allEles = null;
var lastHighlighted = null;
var lastUnhighlighted = null;

var layout;
var sublayout;

var animTime = 500;
var easing = 'linear';

var isZoomed = false;

var topic_layout;
var inst_layout;


/*var this_qry = sessionData.mainQuery;
var main_qry = sessionData.mainQuery;
var instName = sessionData.intitution;
var resName = sessionData.researcher;
var thisCompName = sessionData.instData.compName.toLowerCase();
var docType = sessionData.docType;
var yearMin = sessionData.start_year;
var yearMax = sessionData.end_year;
var selectedCountry = sessionData.selectedCountry;
var topics = {};
for(var i = 0; i < 99; i++){
var topStr = "topic"+String(i);
var labStr = "label"+String(i);
var tmpObj = {};
if(sessionData.topStr){
tmpObj.topic = sessionData[topStr];
if(sessionData.labStr){
tmpObj.label = sessionData[labStr];
}
topics[topStr] = tmpObj;
}
}*/

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalize(tstring) {
  return tstring.replace(/(?:^|\s)\S/g, function(a) {
    return a.toUpperCase();
  });
};

var infoTemplate = Handlebars.compile([
  '<p class="ac-name">{{id}}</p>',
  '<p class="ac-node-type"><i class="fa fa-info-circle"></i> {{type}}</p>'
].join(''));


//
// Query to get data for a specific institution
/*
var edges_inst = $.ajax({
url:'inst_out.json',
type: 'GET',
//	xhrFields: { withCredentials: true },
//	data: JSON.stringify(sessionData),
//    crossDomain: true,
dataType: 'json'
});
var edges_word = $.ajax({
url:'wordweight.json',
type: 'GET',
//	xhrFields: { withCredentials: true },
//	data: JSON.stringify(sessionData),
//    crossDomain: true,
dataType: 'json'
});
var edges_year = $.ajax({
url:'year_out.json',
type: 'GET',
//	xhrFields: { withCredentials: true },
//	data: JSON.stringify(sessionData),
//    crossDomain: true,
dataType: 'json'
});*/

var edges_inst = instList;
var edges_word = wordList;
var edges_year = yearList;
console.log(edges_inst);
console.log(edges_word);
console.log(edges_year);
console.log("here");
//
// Query to get layout info
var myStyle = fetch('cy-style.json', {
  mode: 'no-cors'
})
.then(function(res) {
  return res.json()
});

$("#institution").click(function(evt) {
  //   cy.destroy();
  $('#topicSelect').val("default").prop('selected', true);
  Promise.all([myStyle, edges_inst, 'Institution'])
  .then(makeNet)
  .then(function() {
    FastClick.attach(document.body);
  });
});

$("#word").click(function(evt) {
  //   cy.destroy();
  $('#topicSelect').val("default").prop('selected', true);
  Promise.all([myStyle, edges_word, 'word'])
  .then(makeNet)
  .then(function() {
    FastClick.attach(document.body);
  });
});

$("#year").click(function(evt) {
  //   cy.destroy();
  $('#topicSelect').val("default").prop('selected', true);
  Promise.all([myStyle, edges_year, 'Year'])
  .then(makeNet)
  .then(function() {
    FastClick.attach(document.body);
  });
});

Promise.all([myStyle, edges_word, 'word'])
.then(makeNet)
.then(function() {
  FastClick.attach(document.body);
});

$("#word").qtip({
  content: {
    //				name: weight,
    text: "Connections between topics and words",
    //				url: 'xxx'
  },
  position: {
    my: 'top center',
    at: 'bottom center'
  },
  show: {
    event: 'mouseenter',
    delay: 500
    //        			solo: (isZoomed)? false: true
  },
  hide: {
    //       			target: false,
    event: 'mouseleave',
  },
  style: {
    classes: 'qtip-bootstrap',
    tip: {
      width: 16,
      height: 8
    }
  }
})
$("#institution").qtip({
  content: {
    //				name: weight,
    text: "Connections between topics and institutions",
    //				url: 'xxx'
  },
  position: {
    my: 'top center',
    at: 'bottom center'
  },
  show: {
    event: 'mouseenter',
    delay: 500
    //        			solo: (isZoomed)? false: true
  },
  hide: {
    //       			target: false,
    event: 'mouseleave',
  },
  style: {
    classes: 'qtip-bootstrap',
    tip: {
      width: 16,
      height: 8
    }
  }
});
$("#year").qtip({
  content: {
    //				name: weight,
    text: "Connections between topics and years",
    //				url: 'xxx'
  },
  position: {
    my: 'top center',
    at: 'bottom center'
  },
  show: {
    event: 'mouseenter',
    delay: 500
    //        			solo: (isZoomed)? false: true
  },
  hide: {
    //       			target: false,
    event: 'mouseleave',
  },
  style: {
    classes: 'qtip-bootstrap',
    tip: {
      width: 16,
      height: 8
    }
  }
})

/*----------------------------------------------------------------------------------------*/


function makeNet(dataArray) {
  //var dataArray = [myStyle,institutions,edges];
  var cy = window.cy = cytoscape({
    container: document.getElementById('cy'),
    style: dataArray[0],
    ready: function() {}
  });
  cy.panzoom({
    // options here...
  });

  //
  // Iterate over data returned
  //	networkData = dataArray[1];
  //	resNodes = networkData['researcherNodes'];
  edges = dataArray[1];
  keyword = dataArray[2];

  //	Draw all topic nodes
  /*   for(var i=0; i<10; i++){
  cy.add({
  data: { id: i+1 , type: "topic",  name: i+1},
  position: {x: i,y: i},
  type: "topic"
});
}*/



var topicWeight = [];
var instNodeWeight = [];
for (var i = 0; i < edges.length; i++) {
  thisEdge = edges[i];
  instName = thisEdge[keyword].toString();
  topic = (parseInt(thisEdge['Topic']) + 1).toString()
  if (keyword == 'word') {
    weight = thisEdge['weight'];
  } else {
    weight = thisEdge['Number'];
  }
  topicWeight[topic] = (topicWeight[topic] || 0) + weight;
  instNodeWeight[instName] = (instNodeWeight[instName] || 0) + weight;
}

minVal = 10000.0;
maxVal = 0.0;
for (key in instNodeWeight) {
  var val = parseFloat(instNodeWeight[key]);
  if (val < minVal) minVal = val;
  if (val > maxVal) maxVal = val;
}
var myMinInst = 5;
var myMaxInst = 60;
for (key in instNodeWeight) {
  var val = parseFloat(instNodeWeight[key]);
  val = ((myMaxInst - myMinInst) * (val - minVal) / (maxVal - minVal)) + myMinInst;
  cy.add({
    data: {
      id: key,
      weight: val,
      type: "inst"
    },
    position: {
      x: 1,
      y: 1
    },
    type: "inst"
  });
}

var minVal = 10000.0;
var maxVal = 0.0;
for (key in topicWeight) {
  var val = parseFloat(topicWeight[key]);
  if (val < minVal) minVal = val;
  if (val > maxVal) maxVal = val;
}

var myMin = 40.0;
var myMax = 120.0;
for (key in topicWeight) {
  var val = parseFloat(topicWeight[key]);
  val = ((myMax - myMin) * (val - minVal) / (maxVal - minVal)) + myMin;
  cy.add({
    data: {
      id: key,
      weight: val,
      type: "topic",
      name: key
    },
    position: {
      x: i,
      y: i
    },
    type: "topic"
  });
}


// Add remaining
for (var i = 0; i < edges.length; i++) {
  thisEdge = edges[i];
  instName = thisEdge[keyword].toString();
  topic = (parseInt(thisEdge['Topic']) + 1).toString()
  edgeid = topic + instName;
  if (keyword == 'word') {
    weight = thisEdge['weight'];
  } else {
    weight = thisEdge['Number'];
  }
  if (cy.$id(edgeid).size() == 0) {
    cy.add({
      data: {
        id: edgeid,
        source: topic,
        target: instName,
        weight: weight
      }
    });
  }
}
topicNodes = cy.nodes("[type='topic']");
instNodes = cy.nodes("[type='inst']");
allNodes = cy.nodes();




// Causes qtips to only show up after the mouse hovers over a node for half a second
var hoverTimeout;
var hoverDelay = 500;
var hoverElt = cy.collection(); // empty set so no null checks needed

cy.on('mouseover', 'node', function(evt) {
  hoverElt = this;
  clearTimeout(hoverTimeout);
  hoverTimeout = setTimeout(function() {
    hoverElt.trigger('hover');
  },
  hoverDelay);
})
.on('mouseout', 'node', function() {
  clearTimeout(hoverTimeout);
  hoverElt.trigger('hovercancel');
});

cy.nodes().forEach(function(n) {
  var g = n.data('id');
  n.qtip({
    content: {
      //				name: weight,
      text: ((n.data('type') == 'inst') ? keyword + ': ' : 'Topic: ') + capitalize(g),
      //				url: 'xxx'
    },
    position: {
      my: 'left center',
      at: 'right center'
    },
    show: {
      event: 'hover',
      //        			solo: (isZoomed)? false: true
    },
    hide: {
      //       			target: false,
      event: 'hovercancel',
    },
    style: {
      classes: 'qtip-bootstrap',
      tip: {
        width: 16,
        height: 8
      }
    }
  });
});

// Making default layout
if (keyword == 'Institution') {
  topic_layout = topicNodes.makeLayout({
    name: 'circle',
    fit: true,
    animate: true,
    animationDuration: animTime,
    animationEasing: easing,
  });
  inst_layout = instNodes.layout({
    name: 'random',
    fit: false,
    animate: true,
    animationDuration: animTime,
    animationEasing: easing,
  });
} else {
  topic_layout = topicNodes.makeLayout({
    name: 'circle',
    animate: true,
    animationDuration: animTime,
    animationEasing: easing,
  });
  inst_layout = instNodes.layout({
    name: 'circle',
    animate: true,
    animationDuration: animTime,
    animationEasing: easing,
  });
}
inst_layout.run();
topic_layout.run();

cy.on('click', function(e) {
  var sel = e.target;
  if (sel != cy && sel.isNode()) {
    if (sel.data('id') == selectedNode) {
      showInfo(sel);
    } else {
      if (sel.data('type') == 'topic') {
        val = sel.data('id') - 1;
        console.log(val);
        $('#topicSelect').val(val).prop('selected', true);
      }
      selection(sel);
      selectedNode = sel.data('id');
    }
  } else {
    $('#topicSelect').val("default").prop('selected', true);
    reset();
    selectedNode = null;
  }
});

// and finally, clear the loading animation
var loading = document.getElementById('loading');
loading.classList.add('loaded');
// cytoscape panzooom
// the default values of each option are outlined below:

};
/*----------------------------------------------------------------------------------------*/
//To save image
$("#save-as-png").click(function(evt) {
  var pngContent = cy.png();

  // see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {
      type: contentType
    });
    return blob;
  }

  // this is to remove the beginning of the pngContent: data:img/png;base64,
  var b64data = pngContent.substr(pngContent.indexOf(",") + 1);

  saveAs(b64toBlob(b64data, "image/png"), "network.png");
  return false;

});
/*----------------------------------------------------------------------------------------*/
//For searchbox
$('#search').typeahead({
  minLength: 1,
  highlight: true,
}, {
  name: 'search-dataset',
  display: 'id',
  source: function(query, cb) {
    function matches(str, q) {
      str = (str || '').toLowerCase();
      q = (q || '').toLowerCase();

      return str.match(q);
    }
    var fields = ['id', 'type'];

    function anyFieldMatches(n) {
      for (var i = 0; i < fields.length; i++) {
        var f = fields[i];
        if (matches(n.data(f), query)) {
          return true;
        }
      }
      return false;
    }

    function getData(n) {
      var data = n.data();

      return data;
    }

    function sortByName(n1, n2) {
      if (n1.data('id') < n2.data('id')) {
        return -1;
      } else if (n1.data('id') > n2.data('id')) {
        return 1;
      }

      return 0;
    }
    var res = allNodes.stdFilter(anyFieldMatches).sort(sortByName).map(getData);
    cb(res);
  },
  templates: {
    suggestion: infoTemplate
  }
}).on('typeahead:selected', function(e, entry, dataset) {
  var n = cy.getElementById(entry.id);

  cy.batch(function() {
    allNodes.unselect();
    n.select();
    selection(n);
  })
});

/*----------------------------------------------------------------------------------------*/
//For highlighting selected nodes and their connections
function selection(sel) {

  if (isZoomed) {
    sublayout.stop();
    isZoomed = false;
  }
  var nbhd = sel.closedNeighborhood();
  var others = cy.elements().not(nbhd);
  // Fits the network window to the current selection
  var fit = function() {
    console.log('fit');
    console.log(nbhd.size());
    cy.animation({
      fit: {
        eles: nbhd,
        padding: 10
      },
      easing: easing,
      duration: animTime
    }).play().promise();
  }
  // Gets the neighborhood of a selected node
  var pullNbhd = function() {
    showInfo(sel);
    others.addClass('semitransp');
    nbhd.addClass('highlight');
    console.log("pull");
    topic_layout.stop();
    inst_layout.stop();
    var pos = sel.position();
    sublayout = nbhd.makeLayout({
      name: 'concentric',
      fit: false,
      //      equidistant: true,
      boundingBox: {
        x1: pos.x - 1,
        x2: pos.x + 1,
        y1: pos.y - 1,
        y2: pos.y + 1
      },
      animate: true,
      animationDuration: animTime,
      animationEasing: easing,
      avoidOverlap: true,
      spacingFactor: (keyword == 'Institution' ? 0.5 : 1),
      concentric: function(ele) {
        if (ele.same(sel)) {
          var max = nbhd.max(function(e) {
            if (e.isEdge()) {
              return e.data('weight');
            }
          })
          console.log("max= " + max);
          return max.value + 1;
        } else {
          return ele.edgesWith(sel).data('weight');
        }
      },
      levelWidth: function() {
        return 1;
      },
    });
    var promise = cy.promiseOn('layoutstop');
    sublayout.run();
    isZoomed = true;
    return promise;
  };
  return Promise.resolve()
  .then(reset)
  .then(pullNbhd)
  .then(fit)
}
/*----------------------------------------------------------------------------------------*/
// Resets the network
function reset() {
  if (isZoomed) {
    sublayout.stop();
    isZoomed = false;
  }
  cy.batch(function() {
    //		console.log("reset");
    cy.elements().removeClass('semitransp');
    cy.elements().removeClass('highlight');
  });
  inst_layout.run();
  topic_layout.run();
  var promise = cy.promiseOn('layoutstop');
  return promise;
  //	fit(cy.elements());
  //	Promise.resolve();
  /*cy.animation({
  fit: {
  eles: cy.nodes("[type='inst']"),
  padding: 20
},
easing: easing,
duration: animTime
}).play();*/
}
/*----------------------------------------------------------------------------------------*/
// Show info of selected node
function showInfo(sel) {
  var target = $('.qtip.jgrowl:visible:last');

  var g = sel.data('id');

  console.log("hi");

  $('#info').qtip({
    content: {
      text: function() {
        var txt = "";
        sel.openNeighborhood().nodes().sort(function(a, b) {
          return b.edgesWith(sel).data('weight') - a.edgesWith(sel).data('weight');
        }).forEach(function(node) {
          txt = txt + ((sel.data('type') == 'topic') ? capitalize(node.data('id')) : "Topic " + node.data('id')) + '<br>'
        });
        return txt;
      },
      title: {
        text: ((sel.data('type') == 'inst') ? capitalize(keyword) + ": " : "Topic ") + capitalize(g),
        button: false
      }
    },
    position: {
      target: $('#myNavbar'),
      container: $('#info'),
      at: 'bottom right',
      my: 'top right'
    },
    show: {
      event: false,
      ready: true,
      effect: function() {
        $(this).stop(0, 1).animate({
          height: 'toggle'
        }, 400, 'swing');
      },
      delay: 0,
    },
    hide: 'unfocus',
    style: {
      width: 'auto',
      classes: 'qtip-tipped',
      tip: false
    }
  });
}

function topicSelectChange() {
  //   reset();
  var sel = document.getElementById("topicSelect").value;
  selection(cy.getElementById((parseInt(sel) + 1).toString()));
}

$("#guide").qtip({
  content: {
    text: "The blue squares represent words, institutions or years, depending on the view chosen. The red circles represent the topics. <br><br>The size of an object corresponds to the total number of documents that that object is connected to. <br><br> On clicking on a topic, the objects connected to that topic are highlighted. The distance from the selection represents how closely an object is related to the selection. The closer an object is to the selection, the more documents that object shares with that selection.",
    title: {
      text: "Guide",
      button: true
    }
  },
  position: {
    container: $('#info'),
    at: 'bottom center',
    my: 'top center'
  },
  show: {
    event: 'click'
  },
  hide: {
    fixed: true,
    event: 'unfocus'
  },
  style: {
    width: 'auto',
    classes: 'qtip-tipped',
    tip: false
  }
});
