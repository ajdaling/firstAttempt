var yearChart = dc.barChart("#dc-line-year","topics");
var subtopChart = dc.rowChart("#subtop-chart","topics");
var orgChart = dc.rowChart("#org-chart","topics");
var topChart = dc.rowChart("#top-chart","topics");
var topAuthorChart = dc.rowChart("#top-author-chart","topics");


var reportData = JSON.parse(localStorage.getItem("reportData"));
reportData["title"] = "cancer";
reportData["start_year"] = 2010;
reportData["end_year"] = 2010;


var topicTitles=[];
var topicNames=[];
var allCountsGrants=[];
var allCountsPubs=[];
var allCountsPatents=[];
var subTopicNames=[];

var myColorVals8 = [
"#1f77b4",
"#ff7f0e",
"#2ca02c",
"#d62728",
"#9467bd",
"#8c564b",
"#e377c2",
"#bcbd22",
"#777777"]
var myColorVals8x5 = [
"#1f77b4",
"#1f77b4",
"#1f77b4",
"#1f77b4",
"#1f77b4",
"#ff7f0e",
"#ff7f0e",
"#ff7f0e",
"#ff7f0e",
"#ff7f0e",
"#2ca02c",
"#2ca02c",
"#2ca02c",
"#2ca02c",
"#2ca02c",
"#d62728",
"#d62728",
"#d62728",
"#d62728",
"#d62728",
"#9467bd",
"#9467bd",
"#9467bd",
"#9467bd",
"#9467bd",
"#8c564b",
"#8c564b",
"#8c564b",
"#8c564b",
"#8c564b",
"#e377c2",
"#e377c2",
"#e377c2",
"#e377c2",
"#e377c2",
"#bcbd22",
"#bcbd22",
"#bcbd22",
"#bcbd22",
"#bcbd22",
"#777777",
"#777777",
"#777777",
"#777777",
"#777777"
];

var allPubsMax = 0;
// Use this function to make sure that ALL bins are displayed in a row chart
function ordinal_groups(keys, group) {
    return {
        all: function () {
            var values = {};
            group.all().forEach(function(d, i) {
                values[d.key] = d.value;
            });
            var g = [];
            keys.forEach(function(key) {
                g.push({key: key,
                        value: values[key] || 0});
            });
            return g;
        }
    };
}
catType = 0;   // 0: gramts; 1: patents; 2: ieee
filterTopic = "none";
filterTopicNum = 0;
filterSubTopic = "none";
instHtml = "instData.php";
authHtml = "authorData.php";

function setDataAndFileName(datapoints, fnameTopics, fnameSubTopics, fnameCounts, title, thisCatType, thisFilterTopicNum, thisFilterSubTopic) {
//function setDataAndFileName(datazip, fnameTopics, fnameSubTopics, fnameCounts, title, thisCatType, thisFilterTopicNum, thisFilterSubTopic) {
//function setDataAndFileName(fname1, fnameTopics, fnameSubTopics, fnameCounts, title, thisCatType, thisFilterTopicNum, thisFilterSubTopic) {
console.log(reportData);
var searchTerm = reportData.title;
//searchTerm = searchTerm.split(' ').join('+');

var startYear = reportData.start_year;
var endYear = reportData.end_year;
// var topicDefs = reportData.topics;
// var len = topicDefs.length;
// for (i=0; i<len; ++i) {
// 	if (i in topicDefs) {
// 	   topicDefs[i].topic = (topicDefs[i].topic).split(' ').join('+');
// 	}
// }

var topicDefs = {};

for(var i=1; i < 8; i++){
  topicDefs[i] = {};
  topicDefs[i].topic = reportData["topic"+String(i)];
}

console.log(topicDefs);
console.log("fnameTopics: "+fnameTopics);

catType = thisCatType;

filterTopicNum = thisFilterTopicNum;
if (typeof thisFilterTopic != 'undefined') {
   if ((thisFilterTopic >=0) && (thisFilterTopic <=8)) {
      filterTopic = topicNames[thisFilterTopic];
//      console.log("filter topic string:");
//      console.log(filterTopic);

      if (typeof thisFilterSubTopic != 'undefined') {
         if ((thisFilterSubTopic >=0) && (thisFilterSubTopic <=4)) {
            indexSubTopic = 5*parseInt(thisFilterTopic) + parseInt(thisFilterSubTopic);
            filterSubTopic = subTopicNames[indexSubTopic];
            console.log("filter subtopic string:");
            console.log(filterSubTopic);
            console.log(thisFilterTopic);
            console.log(thisFilterSubTopic);
            console.log(indexSubTopic);
        }
      }

   }
}



thisTitle = title;
d3.selectAll('.headerTitle').text(thisTitle);
d3.selectAll('.headerURL').text("URL");
d3.selectAll('.subHeaderTitle').text("");
d3.selectAll('.reportDate').text("12-October-2015");
d3.selectAll('.reportAuthor').text("superH");

//target_base = fname1.replace(/^.*\//, "");
function load_json_data_zipfile(target, callback) {
    var target_base, target_id;

    if (target === undefined) {
        return callback("target undefined", undefined);
    }
    console.log("target ");
    console.log(target);

    target_base = target.replace(/^.*\//, "");
    console.log(target_base);
    console.log(target_base.replace(/\.zip$/, ".json"));
    if (target.search(/\.gz$/) > 0) {
        return d3.xhr(target)
            .responseType("arraybuffer")
            .get(function (error, response) {
                var zip, text;
                if (response && response.status === 200) {
//                    zip = new JSZip(response.response);
//                    text = JSON.parse(zip.file(target_base.replace(/\.zip$/, ".json")).asText());
    // Turn number array into byte-array
console.log("about to Uint8Array");
    var binData     = new Uint8Array(response.response);

    // Pako magic
    var data        = pako.inflate(binData);

    // Convert gunzipped byteArray back to ascii string:
//    var text    = JSON.parse(String.fromCharCode.apply(null, new Uint16Array(data)));
    var textTemp    = String.fromCharCode.apply(null, new Uint16Array(data));
console.log("about to JSON.parse");

    var text    = JSON.parse(textTemp);

//	console.log(text);

                }
                return callback(error, text);
            });
    }

    // Otherwise, no unzipping
    return d3.json(target, function (error, s) {
        return callback(error, s);
    });
};


function load_json_data(target, callback) {
    var target_base, target_id;

    if (target === undefined) {
        return callback("target undefined", undefined);
    }
    console.log("target ");
    console.log(target);

    target_base = target.replace(/^.*\//, "");
    console.log(target_base);
    console.log(target_base.replace(/\.zip$/, ".json"));
    if (target.search(/\.zip$/) > 0) {
        return d3.xhr(target)
            .responseType("arraybuffer")
            .get(function (error, response) {
                var zip, text;
                if (response && response.status === 200) {
                    zip = new JSZip(response.response);
//                    text = JSON.parse(zip.file("master.json").asText());
                    text = JSON.parse(zip.file(target_base.replace(/\.zip$/, ".json")).asText());
//                    text = JSON.parse(zip.file(target).asText());
                }
                return callback(error, text);
            });
    }

    // Otherwise, no unzipping
    return d3.json(target, function (error, s) {
        return callback(error, s);
    });
};

function unzip_json_data(target, callback) {

    return d3.xhr(target)
            .responseType("arraybuffer")
            .get(function (error, response) {
                var zip, text;

    // Turn number array into byte-array
    var binData     = new Uint8Array(target);

    // Pako magic
    var data        = pako.inflate(binData);

    // Convert gunzipped byteArray back to ascii string:
    var strData     = String.fromCharCode.apply(null, new Uint16Array(data));

    return callback(error, text);
            });

};
var req;
var datapoints
reportData["tempTopic"] = "";
$.ajax({
  url: "http://10.1.10.58:8501/visualize_main.sjs",
  data: reportData,
  success:function(data){
    //alert("success1" + String(data));
    datapoints = data;
	 process();
    $('#results').text(data.estimate);
  },
  error: function(){
    alert("error1");
  }
});


console.log("reportData");
console.log(reportData);
//var req = d3.json("http://0.0.0.0:8081/query?phrase=stem+cells+regenerative&year=2005&numDocs=2");
//var req = d3.json("http://0.0.0.0:8081/query?phrase=cancer&year=20055000");
//var req = d3.json("http://0.0.0.0:8081/query?phrase=cancer&numDocs=5000");
var req = d3.json("http://localhost:8931/visualize_main.sjs?title=cancer&institution=&researcher=&start_year=2010&end_year=2017&topic1=cancer&topic2=neuro&topic3=cardiac&topic4=alzheimers&topic5=brain&topic6=heart&topic7=cell&tempTopic=")
 queue()
.defer(d3.csv,"topics.csv")
.defer(d3.csv,"subTopicsNames.csv")
// .defer(d3.csv, fnameCounts)
.await(processOld);
//var datapoints = req;
var topicInfo;
var subTopicInfo;
function processOld(error, itopicInfo,isubTopicInfo) {
topicInfo = itopicInfo;
subTopicInfo = isubTopicInfo;
console.log("sub");
console.log(subTopicInfo);
}

//function process(error, topicInfo,subTopicInfo,datapoints) {
function process() {
console.log("datapoints");
console.log(datapoints);
console.log("sub");
console.log(subTopicInfo);
console.log("top");
console.log(topicInfo);

var coordinate_x = 0.0;
var coordinate_y = 0.0;
var pathData = "/mapfiles/us.json";
var dateStartTimeline = new Date(2000, 10,06);
var countryName = "U.S.";
var customZoom = 1;

//
ind = 0
topicInfo.forEach(function(p) {
  topicTitles[ind] = p.topicN;
  topicTitles[ind]  = topicTitles[ind].replace(/'/g,"");
  topicNames[ind] = p.topicN + ":" + p.topicDesc;
  topicNames[ind] = topicNames[ind].replace(/'/g,"");
  ind = ind + 1;
});
//topicDefs.forEach(function(p) {
//   topicTitles[ind] = "Topic"+ind.toString();
//   topicNames[ind] = "Topic"+ind.toString() + ":" + topicDefs[ind].label;
//   ind = ind + 1;
//});
topicTitles[ind] = "Topic"+ind.toString();
topicNames[ind] = "Topic"+ind.toString() + ":Other";
console.log("topicdefs:");
console.log(topicTitles);
console.log(topicNames);

ind = 0
console.log("dataPoints: "+datapoints);
console.log("subtopicss");
subTopicInfo.forEach(function(p) {
   subTopicNames[ind] = p.topicDesc;
   console.log(p.topicDesc);
   ind = ind + 1;
});
console.log(subTopicNames);
if (typeof thisFilterSubTopic != 'undefined') {
   if ((thisFilterSubTopic >=0) && (thisFilterSubTopic <=4)) {
      filterSubTopic = subTopicNames[thisFilterSubTopic];
            console.log("filter subtopic string:");
            console.log(filterSubTopic);
    }
}


//
ind = 0
// countInfo.forEach(function(p) {
//    allCountsGrants[ind] = +p.numG;
//    allCountsPubs[ind] = +p.numPb;
//    allCountsPatents[ind] = +p.numPt;
//    ind = ind + 1;
// });
//console.log(allCounts);
/********************************************************
*                                                       *
*   Step1: Create the dc.js chart objects & ling to div *
*                                                       *
********************************************************/


/********************************************************
*                                                       *
*   Step2:  Run data through crossfilter                *
*                                                       *
********************************************************/
var		tags = [];
var ymdFormat = d3.time.format("%Y-%m-%d");
var yearFormat = d3.time.format("%Y");


var allGrants = [1,2,3,4,5,6,7,8,9,0];


var overallMax = 1.0;
var maxt = [];
maxt.push(1.0);
maxt.push(1.0);
maxt.push(1.0);
maxt.push(1.0);
maxt.push(1.0);
maxt.push(1.0);
maxt.push(1.0);
maxt.push(1.0);
maxt.push(1.0);
maxt.push(1.0);

var maxVal;

var dateformat = d3.time.format("%Y-%m-%d");

var weightsTopicByYear = [];
console.log("datapoints");
console.log(datapoints);


datapoints.forEach(function(p) {
   p.tagNum = +p.tagNum;
//   p.event_date = d3.time.year(ymdFormat.parse(moment.utc(p.event_date).format("YYYY-MM-DD")));
//   p.event_year = +(p.event_date).getFullYear();
   p.event_year = +p.event_year;
   //console.log(p.event_year);
//   p.created = dateformat(p.event_date);
   p.created = p.event_date;
   //p.program_phase = p.Program + "/" + p.Phase;
   p.Weight = +p.Weight;
	//p.Topic = "Topic1: test";
   p.Score = +p.Score;
   p.subTopicPhrase = p.subTopicPhrase;
	console.log(p.subTopicPhrase);
   p.sWeight = +p.Weight;
   p.radius = +2.0;
   if (p.sWeight < 0.1) p.sWeight = 0.0;
   if (p.Weight > maxt[p.TopicNum]) maxt[p.TopicNum] = p.Weight;
   if (p.Weight > overallMax) overallMax = p.Weight;
   if ((p.authors === 'undefined') || (p.authors === null)) {
		console.log("authors");
	   console.log(p.authors);
	}
   if ((p.state === 'undefined') || (p.state === null)) {
		console.log("state");
	   console.log(p.state);
	}
	//console.log(p);
   //normalize tags
   if (typeof(p.tags)!='undefined'  && p.tags!==null){
   p.tags.forEach(function(tag){
	   tags.push({title: tag.title,total: 1});
   });
   }
	//console.log(p.uri);
	//p.TopicNum = 0;
	// vind = uris1.indexOf(p.uri);
  //  if (vind >= 0) {
	//    console.log("FOUND TOPIC 1!!: ",vind,p.uri);
	// 	p.Topic = topicNames[0];
	// 	p.stage = topicTitles[0];
	// 	p.TopicNum = 0;
	// }
	// vind = uris2.indexOf(p.uri);
  //  if (vind >= 0) {
	//    console.log("FOUND TOPIC 2!!: ",vind,p.uri);
	// 	p.Topic = topicNames[1];
	// 	p.stage = topicTitles[1];
	// 	p.TopicNum = 1;
	// }
	// vind = uris3.indexOf(p.uri);
  //  if (vind >= 0) {
	//    console.log("FOUND TOPIC 3!!: ",vind,p.uri);
	// 	p.Topic = topicNames[2];
	// 	p.stage = topicTitles[2];
	// 	p.TopicNum = 2;
	// }
//{"State":"Pennsylvania","Score":1,"id":0,"CountryCode":"USA","subTopicPhrase":"Publication","TopicNum":"2","event_date":"2016-11-00","Institution":"Stanford
//Univ","superID":0,"Address":"Division of Plastic and Reconstructive Surgery, Stanford University, Palo Alto, CA, University
//o","event_year":"2016","authors":"Momeni, Arash;Chang, Benjamin;Levin, L
//Scott;","stage":"Topic2","AwardAmount":"0","Weight":1,"AuthorRankMax":"2.01","AuthorRankSum":"6.03","InstitutionRankMax":"34.75",
//"InstitutionRankSum":"34.75","url":"http:\/\/www.ncbi.nlm.nih.gov\/pubmed\/27638100","subTopicCategory":2,"ArticleCitationCount":"0",
//"Topic":"Topic2:
//Magnet","Program":"PubMed","CombinedYearScore":1}


//<a onclick="window.open('http://www.google.com/', '_blank', 'location=yes,height=600,width=800,scrollbars=yes,status=yes');">Link</a>

});


var crossdatapoints = crossfilter(datapoints);
var all = crossdatapoints.groupAll();

dc.dataCount(".dc-data-count", "topics")
        .dimension(crossdatapoints)
        .group(all);


/********************************************************
*                                                       *
*   Step3:  Create Dimension that we'll need            *
*                                                       *
********************************************************/

var byCountryCode = crossdatapoints.dimension(function(p) { return p.CountryCode; });
var countCountries = byCountryCode.group().reduceCount();
var byStateCode = crossdatapoints.dimension(function(p) { return p.State; });
var countStates = byStateCode.group().reduceCount();



var byId = crossdatapoints.dimension(function(p) { return p.id; });
var byIdGroup = byId.group();

var weightById = byId.group().reduceSum(function (d) { return d.sWeight; });
var creatorById = byId.group().reduceSum(function (d) { return d.authors; });
var linkById = byId.group().reduceSum(function (d) { return d.linkText; });
var dateById = byId.group().reduceSum(function (d) { return d.event_date; });
var topicNumById = byId.group().reduceSum(function (d) { return d.TopicNum; });
var InstitutionById = byId.group().reduceSum(function (d) { return d.Institution; });
var AddressById = byId.group().reduceSum(function (d) { return d.Address; });
var AwardAmountById = byId.group().reduceSum(function (d) { return d.AwardAmount; });
var geoById = byId.group().reduceSum(function (d) { return d.geo; });

var byInst = crossdatapoints.dimension(function(p) { return p.Institution; });
var byStage = crossdatapoints.dimension(function(p) { return p.stage; });
var byTopicNum = crossdatapoints.dimension(function(p) { return p.TopicNum; });

var byCreator = crossdatapoints.dimension(function(p) { return p.authors; });


var crosstags = crossfilter(tags);

var tag_dim = crossdatapoints.dimension(function (d) {
    return d.Topic;
});
var tag_grp = tag_dim.group();
var tag_inst = crossdatapoints.dimension(function (d) {return d.Institution;});
var tag_inst_grp = tag_inst.group();

var tag_inst_weight = tag_inst.group().reduce(
   function(p,v) {
      val =  v.sWeight;
      if ((v.Institution == "none")
		|| (v.Institution == "None")
		|| (v.Institution == "")
		) val = 0.0;
      return p+ val;
   },
   function(p,v) {
      val =  v.sWeight;
      if ((v.Institution == "none")
		|| (v.Institution == "None")
		|| (v.Institution == "")
		) val = 0.0;
      return p - val;
   },
   function() {
      return 0;
   }
);

var subtop_dim = crossdatapoints.dimension(function (d) {
    return d.subTopicPhrase;
});
var subtop_grp = subtop_dim.group();



var tag_auth = crossdatapoints.dimension(function (d) {return d.authors; });
var tag_auth_grp = tag_auth.group();

var tag_auth_weight = tag_auth.group().reduce(
   function(p,v) {
      val =  v.sWeight;
      if ((v.authors == "none")
		|| (v.authors == "None")
		|| (v.authors == "")
		) val = 0.0;
      return p+ val;
   },
   function(p,v) {
      val =  v.sWeight;
      if ((v.authors == "none")
		|| (v.authors == "None")
		|| (v.authors == "")
		) val = 0.0;
      return p - val;
   },
   function() {
      return 0;
   }
);

var tagsFiltered = false;

// for Magnitude
var yearValue = crossdatapoints.dimension(function (d) {
// return d.event_year;       // add the magnitude dimension
 return d.event_year;       // add the magnitude dimension
});


var yearValueByType = yearValue.group().reduce(
   function(p,v) {
      ++p.count;
      p.Institution = v.Institution;
      p.Weight = v.Weight;
      p.sWeight = v.sWeight;
      p.event_year = v.event_year;
      p.TopicNum = v.TopicNum;
      p.Topic = v.Topic;
      p.authors = v.authors;
      p.Address = v.Address;
      p.AwardAmount = v.AwardAmount;
      if (v.stage == topicTitles[0]) p.totalTopic0++;
      if (v.stage == topicTitles[1]) p.totalTopic1++;
      if (v.stage == topicTitles[2]) p.totalTopic2++;
      if (v.stage == topicTitles[3]) p.totalTopic3++;
      if (v.stage == topicTitles[4]) p.totalTopic4++;
      if (v.stage == topicTitles[5]) p.totalTopic5++;
      if (v.stage == topicTitles[6]) p.totalTopic6++;
      if (v.stage == topicTitles[7]) p.totalTopic7++;
      if (v.stage == topicTitles[8]) p.totalTopic8++;
      p.totalTopic++;
      return p;
 },
   function(p,v) {
      --p.count;
      p.Institution = "";
      p.Weight = 0.0;
      p.sWeight = 0.0;
      p.event_year = 2000;
      p.Topic = -1;
      p.TopicNum = -1;
      p.authors = "";
      p.Address = ""
      p.AwardAmount = ""
      if (v.stage == topicTitles[0]) p.totalTopic0--;
      if (v.stage == topicTitles[1]) p.totalTopic1--;
      if (v.stage == topicTitles[2]) p.totalTopic2--;
      if (v.stage == topicTitles[3]) p.totalTopic3--;
      if (v.stage == topicTitles[4]) p.totalTopic4--;
      if (v.stage == topicTitles[5]) p.totalTopic5--;
      if (v.stage == topicTitles[6]) p.totalTopic6--;
      if (v.stage == topicTitles[7]) p.totalTopic7--;
      if (v.stage == topicTitles[8]) p.totalTopic8--;
      p.totalTopic--;
      return p;
   },
   function() {
      return {
         count: 0,
         Institution : "none",
         Weight: 10,
         sWeight: 0,
         event_year: 2000,
         Topic: "none",
         TopicNum: 5,
         authors: "none",
         Address: "none",
         AwardAmount: "none",
         totalTopic0: 0,
         totalTopic1: 0,
         totalTopic2: 0,
         totalTopic3: 0,
         totalTopic4: 0,
         totalTopic5: 0,
         totalTopic6: 0,
         totalTopic7: 0,
         totalTopic8: 0,
         totalTopic: 0
      };
   }
);

var yearValueByTypeAll = yearValueByType.all();
var len = yearValueByTypeAll.length;


var keepAllYearsGroup = keepAll(yearValueByType);
function keepAll(source_group) {
    return {
        all:function () {
            return source_group.all().filter(function(d) {
                return true;
            });
        }
    };
}

var idValue = crossdatapoints.dimension(function (d) {
 return d.id;       // add the magnitude dimension
// return d.Weight;       // add the magnitude dimension
});

maxVal = +idValue.top(1)[0].Weight;

//var idValue = crossdatapoints.dimension(function (d) {
// return d.id;       // add the magnitude dimension
//});


var idValueByType = idValue.group().reduce(
   function(p,v) {
      ++p.count;
      p.Institution = v.Institution;
      p.Weight = v.Weight;
      p.sWeight = v.sWeight;
      p.event_year = v.event_year;
      p.Topic = v.Topic;
      p.TopicNum = v.TopicNum;
      p.authors = v.authors;
      p.Address = v.Address;
      p.id = v.id;
      return p;
   },
   function(p,v) {
      --p.count;
      p.Institution = "";
      p.Weight = 0.0;
      p.sWeight = 0.0;
      p.event_year = 2000;
      p.Topic = "";
      p.TopicNum = -1;
      p.authors = "";
      p.Address = ""
      return p;
   },
   function() {
      return {
         count: 0,
         Institution : "none",
         Weight: 0,
         sWeight: 0,
         event_year: 2000,
         Topic: "none",
         TopicNum: 5,
         authors: "none",
         Address: "none",
      };
   }
);
var idValueByTypeFiltered = idFilter(idValueByType);

function idFilter(source_group) {
    function non_zero_pred(d) {
        return d.value != 0;
    }
    return {
        all: function () {
            return source_group.all().filter(non_zero_pred);
        },
        top: function(n) {
            return source_group.top(5)
                .filter(non_zero_pred)
                .slice(0, n);
        }
    };
}

//
// Handle the info popovers
		var hide = false;
		var clicktoshow = false;
//
// Explanantion of top companies
		$('#popover_topics').popover({ trigger: 'manual' }).hover(function(e){
			if (!$("#popover_topics").next('div.popover:visible').length && hide ===false){
				$(this).popover('show');
				e.preventDefault();
			} else if (hide){
				hide = false;
			}
		}).click(function(e){
			if ($("#popover_topics").next('div.popover:visible').length){
				hide = true;
			} else {
				clicktoshow=true;
				$('#popover_topics').popover('show');
			}
		});
//
// Explanantion of top companies
		$('#popover_subtopics').popover({ trigger: 'manual' }).hover(function(e){
			if (!$("#popover_subtopics").next('div.popover:visible').length && hide ===false){
				$(this).popover('show');
				e.preventDefault();
			} else if (hide){
				hide = false;
			}
		}).click(function(e){
			if ($("#popover_subtopics").next('div.popover:visible').length){
				hide = true;
			} else {
				clicktoshow=true;
				$('#popover_subtopics').popover('show');
			}
		});
//
// Explanantion of top companies
		$('#popover_topcomp').popover({ trigger: 'manual' }).hover(function(e){
			if (!$("#popover_topcomp").next('div.popover:visible').length && hide ===false){
				$(this).popover('show');
				e.preventDefault();
			} else if (hide){
				hide = false;
			}
		}).click(function(e){
			if ($("#popover_topcomp").next('div.popover:visible').length){
				hide = true;
			} else {
				clicktoshow=true;
				$('#popover_topcomp').popover('show');
			}
		});
//
// Explanantion of top companies
		$('#popover_topindiv').popover({ trigger: 'manual' }).hover(function(e){
			if (!$("#popover_topindiv").next('div.popover:visible').length && hide ===false){
				$(this).popover('show');
				e.preventDefault();
			} else if (hide){
				hide = false;
			}
		}).click(function(e){
			if ($("#popover_topindiv").next('div.popover:visible').length){
				hide = true;
			} else {
				clicktoshow=true;
				$('#popover_topindiv').popover('show');
			}
		});
//
// Explanantion of top companies
		$('#popover_power').popover({ trigger: 'manual' }).hover(function(e){
			if (!$("#popover_power").next('div.popover:visible').length && hide ===false){
				$(this).popover('show');
				e.preventDefault();
			} else if (hide){
				hide = false;
			}
		}).click(function(e){
			if ($("#popover_power").next('div.popover:visible').length){
				hide = true;
			} else {
				clicktoshow=true;
				$('#popover_power').popover('show');
			}
		});

		$('#popovertitle').popover({ trigger: 'manual' }).hover(function(e){
			if (!$("#popovertitle").next('div.popover:visible').length && hide ===false){
				$(this).popover('show');
				e.preventDefault();
			} else if (hide){
				hide = false;
			}
		}).click(function(e){
			if ($("#popovertitle").next('div.popover:visible').length){
				hide = true;
			} else {
				clicktoshow=true;
				$('#popovertitle').popover('show');
			}
		});

		$('#popover_map').popover({ trigger: 'manual' }).hover(function(e){
			if (!$("#popover_map").next('div.popover:visible').length && hide ===false){
				$(this).popover('show');
				e.preventDefault();
			} else if (hide){
				hide = false;
			}
		}).click(function(e){
			if ($("#popover_map").next('div.popover:visible').length){
				hide = true;
			} else {
				clicktoshow=true;
				$('#popover_map').popover('show');
			}
		});


		$('#popover_top200VsTime').popover({ trigger: 'manual' }).hover(function(e){
			if (!$("#popover_top200VsTime").next('div.popover:visible').length && hide ===false){
				$(this).popover('show');
				e.preventDefault();
			} else if (hide){
				hide = false;
			}
		}).click(function(e){
			if ($("#popover_top200VsTime").next('div.popover:visible').length){
				hide = true;
			} else {
				clicktoshow=true;
				$('#popover_top200VsTime').popover('show');
			}
		});

		$('#popover_AllVsTime').popover({ trigger: 'manual' }).hover(function(e){
			if (!$("#popover_AllVsTime").next('div.popover:visible').length && hide ===false){
				$(this).popover('show');
				e.preventDefault();
			} else if (hide){
				hide = false;
			}
		}).click(function(e){
			if ($("#popover_AllVsTime").next('div.popover:visible').length){
				hide = true;
			} else {
				clicktoshow=true;
				$('#popover_AllVsTime').popover('show');
			}
		});

		//hide on click somewhere on the screen
		$(document).click(function(e) {
			if (($("#popover").next('div.popover:visible').length
               || $("#popovertitle").next('div.popover:visible').length
               || $("#popover_top200VsTime").next('div.popover:visible').length
               || $("#popover_AllVsTime").next('div.popover:visible').length
               || $("#popover_power").next('div.popover:visible').length
               || $("#popover_topics").next('div.popover:visible').length
               || $("#popover_subtopics").next('div.popover:visible').length
               || $("#popover_topcomp").next('div.popover:visible').length
               || $("#popover_map").next('div.popover:visible').length
               || $("#popover_topindiv").next('div.popover:visible').length
               || $("#popovergeneral").next('div.popover:visible').length
               ) && clicktoshow===false){
				$('#popover').popover('hide');
				$('#popover_topcomp').popover('hide');
				$('#popover_topindiv').popover('hide');
				$('#popover_topics').popover('hide');
				$('#popover_subtopics').popover('hide');
				$('#popover_power').popover('hide');
				$('#popover_map').popover('hide');
				$('#popover_topindiv').popover('hide');
				$('#popovergeneral').popover('hide');
				$('#popovertitle').popover('hide');
				$('#popover_top200VsTime').popover('hide');
				$('#popover_AllVsTime').popover('hide');
			} else if (clicktoshow){
				clicktoshow=false;
			}
		});




var myColors8 = d3.scale.ordinal()
  .domain(topicNames)
  .range(myColorVals8);

var myColors8x5 = d3.scale.ordinal()
  .domain(subTopicNames)
  .range(myColorVals8x5);

subtopChart.width(235) // (optional) define chart width, :default = 200
   .on("filtered", RefreshTable)
			    .height(400) // (optional) define chart height, :default = 200
			    .dimension(subtop_dim) // set dimension
			    .group(ordinal_groups(subTopicNames,subtop_grp)) // set group
			    //.group(subtop_grp) // set group
			    //.group(tag_inst_grp) // set group
			    //.ordering(function(p){return p.subTopicPhrase;})
             //.cap(30)
             .margins({top: 20, left: 50, right: 10, bottom: 20})
             .ordinalColors(["#BFE2BF","#FFD886","#BBD6E8","#78CC00","#7B71C5"])
//			    .colors(myColors8x5)
//			    .colors(d3.scale.category20b())
//			    .colors(colorbrewer.Purples[9])
			    .gap(1)
             .elasticX(true)
			    .renderLabel(true)
			    .renderTitle(true)
             .othersGrouper(true)
             .ignoreZeroValue(true)
             .xAxis().ticks(4);

orgChart.width(235) // (optional) define chart width, :default = 200
   .on("filtered", RefreshTable)
			    .height(400) // (optional) define chart height, :default = 200
			    .dimension(tag_dim) // set dimension
			    .group(ordinal_groups(topicNames,tag_grp)) // set group
			    .margins({top: 20, left: 50, right: 10, bottom: 20})
			    .colors(myColors8)
//			    .colors(d3.scale.category10())
			    .gap(1)
			    .renderLabel(true)
			    .renderTitle(true)
             .elasticX(true)
             .othersGrouper(true)
             .ignoreZeroValue(true)
			    .xAxis().ticks(4);

yearChart
   .on("filtered", RefreshTable)
    .width(520)
    .height(280)
    .margins({top: 20, right: 0, bottom: 30, left: 30})
    .dimension(yearValue)
    .group(yearValueByType,topicTitles[0])
    .valueAccessor(function(d) {
      return d.value.totalTopic0;
    })
    .stack(yearValueByType, topicTitles[1], function(d) {
      return d.value.totalTopic1;
    })
    .stack(yearValueByType, topicTitles[2], function(d) {
      return d.value.totalTopic2;
    })
    .stack(yearValueByType, topicTitles[3], function(d) {
      return d.value.totalTopic3;
    })
    .stack(yearValueByType, topicTitles[4], function(d) {
      return d.value.totalTopic4;
    })
    .stack(yearValueByType, topicTitles[5], function(d) {
      return d.value.totalTopic5;
    })
    .stack(yearValueByType, topicTitles[6], function(d) {
      return d.value.totalTopic6;
    })
    .stack(yearValueByType, topicTitles[7], function(d) {
      return d.value.totalTopic7;
    })
    .stack(yearValueByType, topicTitles[8], function(d) {
      return d.value.totalTopic8;
    })
	.transitionDuration(500)
    .centerBar(true)
	.gap(15)  // 65 = norm
   .x(d3.scale.linear().domain([2000,2016.5]))
   .xAxisLabel("Year")
   .yAxisLabel("Number",20)
	.elasticY(true)
   .colors(myColors8)
   .renderHorizontalGridLines(true)
   .renderVerticalGridLines(true)
//   .legend(dc.legend().x(200).y(0).itemHeight(13).gap(5))
   .legend(dc.legend().x(60).y(0).itemHeight(10).gap(1).horizontal(true).autoItemWidth(true))
   ;
yearChart.xAxis().tickFormat(d3.format(".0f"));
//var pubsMax = 1.2*yearChart.yAxisMax();
//console.log("yaxis Max");
//console.log(pubsMax);
//yearChart.y(d3.scale.linear().domain([0,pubsMax]))

//yearLineChart
//    .width(470)
//    .height(280)
//    .margins({top: 10, right: 0, bottom: 30, left: 30})
//    .dimension(yearValue)
//    .group(yearValueByType)
//    .useRightYAxis(true)
//    .valueAccessor(function(d) {
//      return d.delta;
//    })
//	.transitionDuration(500)
//   .yAxisLabel("Number",1000)
//	.elasticY(true)
//yearLineChart.legendables = function() { return [];}; //don't return legend data

//multipleChart
//   .on("filtered", RefreshTable)
//   .width(500).height(280)
//   .dimension(yearValue)
//   .x(d3.scale.linear().domain([2000,2015.5]))
//   .renderHorizontalGridLines(true)
//  .renderVerticalGridLines(true)
//   .renderLabel(true)
//   .renderTitle(true)
//   .yAxisLabel("Number")
//   .legend(dc.legend().x(50).y(0).itemHeight(10).gap(1).horizontal(true).autoItemWidth(true))
//   .compose([yearLineChart, yearChart]);
//multipleChart.xAxis().tickFormat(d3.format(".0f")); //display integers with NO comma-grouping for thousands
//multipleChart.y(d3.scale.linear().domain([0,pubsMax]))

topChart.width(400) // (optional) define chart width, :default = 200
   .on("filtered", RefreshTable)
			    .height(500) // (optional) define chart height, :default = 200
			    .dimension(tag_inst) // set dimension
			    .group(tag_inst_weight) // set group
			    //.group(tag_inst_grp) // set group
			    .ordering(function(p){return p.Institution;})
             .cap(30)
             .margins({top: 40, left: 50, right: 10, bottom: 20})
			    .colors(d3.scale.category20b())
//			    .colors(colorbrewer.Purples[9])
			    .gap(1)
             .elasticX(true)
			    .renderLabel(true)
			    .renderTitle(false)
			    .othersGrouper(false)
             .ignoreZeroValue(true)
//             .title(function(p){return "&lt;a href=&quot;www.cnn.html&quot;&gt; " + p.key + " &lt;/a&gt;";})
//             .title(function(p){return "<a data-html=\"true\" rel=\"tooltip\" href=\"http://www.cnn.html\">" + p.key + "</a>";})
//             .title(function(p){return "<b>test</b>";})
             .xAxis().ticks(4);

// Define 'div' for tooltips
var div = d3.select("body")
	.append("div")  // declare the tooltip div
//	.attr("class", "tooltip")              // apply the 'tooltip' class
	.attr("class", "tooltip3")              // apply the 'tooltip' class
	.style("opacity", 0);                  // set the opacity to nil

// Define 'div' for tooltips
var div = d3.select("body")
	.append("div")  // declare the tooltip div
	.attr("class", "tooltip")              // apply the 'tooltip' class
//	.attr("class", "hoverinfo")              // apply the 'tooltip' class
	.style("opacity", 0);                  // set the opacity to nil

if (catType != 0) {
 topChart.renderlet(function(chart){
   chart.selectAll("g.row")
   .on("mouseout.something2", function(d) {
        div.transition()
            .duration(10000)
            .style("opacity", 0);
   })
   .on("mouseover.something2", function(d) {
//      console.log("mouse new");
//      console.log(d);
        div.transition()
            .duration(500)
            .style("opacity", 0);
        div.transition()
            .duration(200)
            .style("opacity", 1.0);
        div. html(
            '<a href= "' + instHtml + '?instName=' + (d.key).replace(/&/g,';AND;').replace(/;amp;/g,';') + '" target="_blank">' + // The first <a> tag
//            '<a href= "' + instHtml + '?instName=' + (d.key).replace(/&/g,';AND;') + '" target="_blank">' + // The first <a> tag
//            '<a href= "instMaster.html?inst=' + d.key + '">' + // The first <a> tag
            d.key +
            "</a>")
            .style("left", (d3.event.pageX + 20) + "px")
            .style("top", (d3.event.pageY -15) + "px");
//            .style("left", (d3.event.pageX + 20) + "px")
//            .style("top", (d3.event.pageY -15) + "px");
//            .style("top", (d3.event.pageY - 28) + "px");
        })
   });
}




topAuthorChart.width(400) // (optional) define chart width, :default = 200
   .on("filtered", RefreshTable)
        			    .height(500) // (optional) define chart height, :default = 200
			    .dimension(tag_auth) // set dimension
			    .group(tag_auth_weight) // set group
//			    .group(tag_auth_grp) // set group
//			    .group(tag_auth_grp_sum) // set group
//			    .ordering(tag_auth_grp)
//			    .ordering(function(p){return metaData[p.id].author;})
//			    .ordering(function(p){return p.Institution;})
			    .ordering(function(p){return p.authors;})
             .cap(30)
             .margins({top: 40, left: 50, right: 10, bottom: 20})
			    .colors(d3.scale.category20b())
//			    .colors(colorbrewer.Purples[9])
			    .gap(1)
             .elasticX(true)
			    .renderLabel(true)
			    .renderTitle(false)
			    .othersGrouper(false)
             .ignoreZeroValue(true)
//             .title(function(p){
//                  plink = "<a href=\"http://www.cnn.html\">" + p.key + "</a>";
//                  return plink;
//               })
             .xAxis().ticks(4);

topAuthorChart.renderlet(function(chart){
   chart.selectAll("g.row")
   .on("mouseout.something", function(d) {
        div.transition()
            .duration(10000)
            .style("opacity", 0);
   })
   .on("mouseover.something", function(d) {
      console.log("mouse");
      authorMatch = d.key;
      var auths = authorMatch.split(";");
      var i;
      var fullLink = "";
      for (i=0; i<auths.length; i++) {
         if (auths[i].length>1) {
           linkAuth = '<a href= "' + authHtml + '?authorName=' + auths[i] + '">' + auths[i] + "</a>; ";
           fullLink = fullLink.concat(linkAuth);
         }
      }
        div.transition()
            .duration(500)
            .style("opacity", 0);
        div.transition()
            .duration(200)
            .style("opacity", 1.0);
        div. html(fullLink)
//            '<a href= "' + authHtml + '?authors=' + d.key + '">' + // The first <a> tag
//            '<a href= "authorMaster.html?authors=' + d.key + '">' + // The first <a> tag
//            d.key +
//            "</a>")
            .style("left", (d3.event.pageX + 20) + "px")
            .style("top", (d3.event.pageY -15) + "px");
        })
   });



function formatNumber(n) {
   newString = "";
   if (typeof(n)!='undefined')
      newString = "$" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   //newString = "test";
   return newString;
//    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



//tag_inst.filter('Univ. of Padova');
//topChart.filter('Univ. of Padova');
if (filterTopic != "none") {
   orgChart.filter(filterTopic);
   dc.renderAll('topics');
   if (filterSubTopic != "none") {
      subtopChart.filter(filterSubTopic);
      dc.renderAll('topics');
   }
//   RefreshTable();
}
//   if (filterSubTopic != "none") {
//	console.log("herehere");
//	comsole.log(filterSubTopic);
//      subtopChart.filter(filterSubTopic);
//      dc.renderAll('topics');
//   RefreshTable();
//   }


var header =
	[
   "\u00A0 \u00A0 \u00A0 \u00A0 \u00A0 2010",
   "\u00A0 \u00A0 \u00A0 \u00A0 \u00A0 2011",
   "\u00A0 \u00A0 \u00A0 \u00A0 \u00A0 2012",
   "\u00A0 \u00A0 \u00A0 \u00A0 \u00A0 2013",
   "\u00A0 \u00A0 \u00A0 \u00A0 \u00A0 2014" ]


var white = ["#FFFFFF"];
var myText = ["Most Important Institutions by Topic."];

//appendOrdinalHorizontalLegend(svg, header, {
//  caption : "",
//  palette : colorbrewer.YlOrRd[5],
//  xoffset         : 60,
//  yoffset : 10,
//    captionXOffset  : 10,
//    captionYOffset  : 0
//});

//appendOrdinalHorizontalLegend(svg, myText, {
//  caption : "",
//  palette : white,
//  xoffset         : 115,
//  yoffset : 0,
//    captionXOffset  : 10,
//    captionYOffset  : 0
//});

//
// This fills in the numbers in the upper left hand corner
   d3.select("#active").text((all.value()));
   d3.selectAll("#total").text(crossdatapoints.groupAll().reduceCount().value());

   var tempLocalData = [];
   tempLocalData = byId.top(Infinity);
   var localData = JSON.stringify(tempLocalData);




//   var localData = JSON.stringify(byId.top(Infinity));
//   window.localStorage.setItem('filtData', localData);
//   var localStorage["filteredData"] = JSON.stringify(byId.top(Infinity));
   function RefreshTable() {
      maxVal = 0.0;
       dc.events.trigger(function () {
           alldata = yearValue.top(Infinity);
//           datatable.fnClearTable();
//           datatable.fnAddData(alldata);
//           datatable.fnDraw();
       });
//       console.log("in refreshtable");
       //console.log(byId.top(Infinity));
       tempLocalData = byId.top(Infinity);
//       localData = JSON.stringify(tempLocalData);
//       localStorage["filteredData"] = JSON.stringify(byId.top(Infinity));
//       window.localStorage.setItem('filtData', localData);
      //console.log(JSON.stringify(byId.top(Infinity)));
//      zoom.bubbles(tempLocalData);
       redoMap();
   }


var bubbleData = [
 {name: 'Bubble 1', latitude: 21.32, longitude: -7.32, radius: 45, fillKey: 'gt500'},
 {name: 'Bubble 2', latitude: 12.32, longitude: 27.32, radius: 25, fillKey: 'eq0'},
 {name: 'Bubble 3', latitude: 0.32, longitude: 23.32, radius: 35, fillKey: 'lt25'},
 {name: 'Bubble 4', latitude: -31.32, longitude: 23.32, radius: 55, fillKey: 'eq50'},
];
var countryData = [];

//countCountries.top(Infinity);


//countCountries.top(Infinity).forEach(function(key) {
 //               countryData.push({key: key,
//                        value: values[key] || 0});
//            });




//{'ZAF': { fillKey: 'gt50' },
//    'ZWE': { fillKey: 'lt25' },
//    'NGA': { fillKey: 'lt50' },
//    'MOZ': { fillKey: 'eq50' },
//    'MDG': { fillKey: 'eq50' },
//    'EGY': { fillKey: 'gt75' },
//    'TZA': { fillKey: 'gt75' },
//    'LBY': { fillKey: 'eq0' },
//    'DZA': { fillKey: 'gt500' },
//    'SSD': { fillKey: 'pink' },
//    'SOM': { fillKey: 'gt50' },
//    'GIB': { fillKey: 'eq50' },
//    'AGO': { fillKey: 'lt50' }};
var mapColors = [
"#fff7f3",
"#fde0dd",
"#fcc5c0",
"#fa9fb5",
"#f768a1",
"#dd3497",
"#ae017e",
"#7a0177",
"#49006a"];
//var mapColors = ["#dcdcdc", "#d0d6cd", "#bdc9be", "#aabdaf", "#97b0a0",
//                 "#84a491", "#719782", "#5e8b73", "#4b7e64", "#387255", "#256546", "#125937", "#004d28"];
var color_domain =      [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500]
 var ext_color_domain = [0,    500, 1000, 1500, 2000, 2500, 3000, 3500, 4000]
 var legend_labels = ["0", "500+", "1000+", "1500+", "2000+", "2500+", "3000+", "3500+", "4000+"]
 var color = d3.scale.threshold()
 .domain(color_domain)
 .range(mapColors);
var legend_lab1 = legend_labels[0];
var svg = d3.select(document.getElementsByClassName("legend")[0]).append("svg")

var mapType = 'world';
var mapScaleX = 0.5;
var mapScaleY = 0.5;
var scaleVal = 200;
if (catType == 0) {
   mapType = 'usa';
   scaleVal = 1000;
   mapScaleX = 2.0;
   mapScaleY = 1.5;
}
var mapLegLabel = "testy";
var colors = d3.scale.category10();
var zoom = new Datamap({
  element: document.getElementsByClassName("newmap1")[0],
//  element: document.getElementById("newmap"),
  scope: mapType,
  //function() {

  //       thisScope = 'world';
  //       if (catType == 0) thisScope = 'usa';
  //       return thisScope},
  // Zoom in on Africa
  setProjection: function(element) {
    var projection = d3.geo.equirectangular()
      .center([10, 15])
//      .rotate([4.4, 0])
      .scale(scaleVal)
      .translate([mapScaleX*element.offsetWidth, mapScaleY*element.offsetHeight]);
//      .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
    var path = d3.geo.path()
      .projection(projection);

    return {path: path, projection: projection};
  },
  fills: {
//    defaultFill: "#ABDDA4",
//    defaultFill: "#dcdcdc",
    defaultFill:mapColors[0],
   legend_lab1 : "#fde0dd",
   "#fde0dd" : "#fde0dd",
   "#fcc5c0" : "#fcc5c0",
   "#fa9fb5" : "#fa9fb5",
   "#f768a1" : "#f768a1",
   "#dd3497" : "#dd3497",
   "#ae017e" : "#ae017e",
   "#7a0177" : "#7a0177",
   "#49006a" : "#49006a",
    gt50: colors(Math.random() * 20),
    eq50: colors(Math.random() * 20),
    lt25: colors(Math.random() * 10),
    gt75: colors(Math.random() * 200),
    lt50: colors(Math.random() * 20),
    eq0: colors(Math.random() * 1),
    pink: '#0fa0fa',
    gt500: colors(Math.random() * 1)
  },
  data: countryData,
  done: function(datamap) {
           datamap.svg.call(d3.behavior.zoom().on("zoom", redraw));

           function redraw() {
                datamap.svg.selectAll("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
           }
  },
  geographyConfig:{
      borderWidth: 1,
//    borderColor: '#FFFFFF'}
      borderColor: '#000000',
      popupTemplate: function(geography, data) {
      console.log("in popup!");
      if (data != null) {
         if (catType == 0) {
            return '<div class="hoverinfo"><strong>'+ geography.properties.name +
            '<br>Number of Grants: ' +  data["numDoc"] + ' ' + '</strong></div>';
         } else if (catType == 2) {
            return '<div class="hoverinfo"><strong>'+ geography.properties.name +
            '<br>Number of Patents: ' +  data["numDoc"] + ' ' + '</strong></div>';
         } else if (catType == 1) {
            return '<div class="hoverinfo"><strong>'+ geography.properties.name +
            '<br>Number of Publications: ' +  data["numDoc"] + ' ' + '</strong></div>';
         } else {
            return '<div class="hoverinfo"><strong>'+ geography.properties.name +
            '<br>Number of Documents: ' +  data["numDoc"] + ' ' + '</strong></div>';
         }
      } else {
       return '<div class="hoverinfo"><strong>'+ geography.properties.name +  '<br> ' + '</strong></div>';
      }
    }
    }

});
//zoom.legend();
redoMap();
//zoom.bubbles(bubbleData, {
//  zoom.bubbles(
//   tempLocalData,
//   {
//   popupTemplate: function(geo, data) {
//      console.log("in popup");
//      return "<div class='hoverinfo'>Bubble for " + data.authors + " lat:" + data.Latitude + ", long: " + data.Longitude
//                  + "; radius: " + data.radius + "";
//      },
//   borderWidth: 1,
//   borderColor: '#000000'
//
//   });

function redoMap() {
maxVal = 1.0;
if (catType == 0) {
   maxVal = countStates.top(Infinity)[0].value;
} else {
   maxVal = countCountries.top(Infinity)[0].value;
}
if (maxVal < 1.0) maxVal = 1.0;
z=Math.pow(maxVal,0.125);
C = maxVal/Math.pow(z,9);
lC = Math.log(C);
lz = Math.log(z);
delta = maxVal/12.0;
sum = 0.0;
//console.log("legend labels:");

for (i=1; i<10; i++) {
//   sum = sum + delta;
   sum = C*Math.pow(z,i);
   color_domain[i-1] = sum;
   legend_labels[i-1] = "<" + Math.ceil(sum);
   //console.log(legend_labels[i-1]);
}
//      thing = {};

//console.log(maxVal);
if (catType == 0) {
   countStates.top(Infinity).forEach(function(obj) {
      if (obj["value"] > 0.0) {
         ind = Math.floor( (Math.log(obj["value"]) - lC)/lz)
      } else {
         ind = 0;
      }
      if (isNaN(ind)) ind = 0;
      //console.log(ind);
      if (ind >= 9) ind = 8;
      thing = {};
      thing["fillKey"] = mapColors[ind];
      thing["numDoc"] = obj["value"];
       countryData[obj["key"]] = thing;
   });
   console.log("countryData");
   //console.log(countryData);
} else {
   countCountries.top(Infinity).forEach(function(obj) {
      if (obj["value"] >= 0.0) {
         ind = Math.floor( (Math.log(obj["value"]) - lC)/lz)
      } else {
         ind = 0;
      }
      if (isNaN(ind)) ind = 0;
//      console.log(ind);
      if (ind < 0) ind = 0;
      if (ind >= 9) ind = 8;
      thing = {};
      thing["fillKey"] = mapColors[ind];
      thing["numDoc"] = obj["value"];
      countryData[obj["key"]] = thing;
     // console.log(countryData[obj["key"]]);
   });
//   console.log("trying to remove legned");
svg.selectAll("datamaps-legend").remove();
$(".datamaps-legend").empty();
}
   console.log("countryData");
   console.log(countryData);

//countryData = { USA: '#0fa0fa', CAN: '#0fa0fa'};
zoom.updateChoropleth(countryData);


function addLegend2(layer, data, options) {
//    document.getElementsByClassName("datamaps-legend").remove()

    data = data || {};
    if ( !this.options.fills ) {
      return;
    }

//    var legend = svg.selectAll("g.legend").remove();
//    var html = '<ul class="list-inline">';
    var html = '<ul class="list-inline">';
    var label = '';
    if ( data.legendTitle ) {
      html = '<h3>' + data.legendTitle + '</h3>' + html;
    }
    var mapInd=0;
//    for ( var fillKey in this.options.fills ) {
    for (mapInd=0; mapInd<9; mapInd++) {

//      html += '<li class="key" style="border-top-color:' + this.options.fills[fillKey] + '">' + label + '</li>'
      html += '<li class="key" style="border-top-color:' + mapColors[mapInd] + '">' + legend_labels[mapInd] + '</li>'
//      mapInd += 1;
    }
    html += '</ul>';

    var hoverover = d3.select( this.options.element ).append('div')
      .attr('class', 'datamaps-legend')
      .html(html);
  }

var legend = svg.selectAll("g.legend").remove();
    zoom.addPlugin("mylegend", addLegend2);

    zoom.mylegend({legendTitle: "Documents"})




legend = svg.selectAll("g.legend")
 .data(color_domain)
 .enter().append("g")
 .attr("class", "legend");

var ls_w = 20, ls_h = 20;
 var width = 960,
 height = 500;
legend.append("rect")
 .attr("x", 20)
 .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
 .attr("width", ls_w)
 .attr("height", ls_h)
 .style("fill", function(d, i) {
				//console.log("legendrect");  console.log(i);
				return color(d); })
 .style("opacity", 0.8);

legend.append("text")
 .attr("x", 50)
 .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
 .text(function(d, i){ return legend_labels[i]; });


//legend.append("text")
// .attr("x", 50)
// .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
// .text(function(d, i){ return legend_labels[i]; });



}


   //function myRenderAll() {
      for (var i = 0; i < dc.chartRegistry.list().length; i++) {
         console.log("in chartregistry");
          var chartI = dc.chartRegistry.list()[i];
//          chartI.on("filtered", RefreshTable);
      }
      dc.renderAll("topics");
   //}

    dc.renderAll("topics");

   $("#table-search").on('input', function () {
   // $("#table-search").on('keydown', function (evt) {
        //text_filter(byInst, this.value);
       //if( evt.keyCode == 13 )
       text_filter(byCreator, this.value);
   });



function text_filter(dim, q) {
//     yearlyBubbleChart.filterAll();
   var re = new RegExp(q, "i")
   if (q != '') {
      dim.filter(function(d) {
         if (d.search(re) == 0)
         return d;
      });
   }
    dc.redrawAll();
//     graphCustomizations();
 }

function appendOrdinalHorizontalLegend(node, labels, params)
{
  // Default parameters.
  var p =
  {
    xoffset         : 20,
    yoffset         : 20,
    cellWidth       : 80,
    cellHeight      : 20,
    tickLength      : 0,
    caption         : "Legend",
    palette         : d3.scale.category20c(),
    captionFontSize : 14,
    captionXOffset  : 10,
    captionYOffset  : -6
  };

  // If we have parameters, override the defaults.
  if (params !== 'undefined')
  {
    for (var prop in params)
    {
      p[prop] = params[prop];
    }
  }

  // Create our x scale
  var x = d3.scale.ordinal()
    .domain(labels)
    .range(d3.range(labels.length).map(function(i) { return i * p.cellWidth; }));

  // Create the x axis.
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(p.tickLength)
    .tickPadding(5)
    .tickValues(labels)
    .tickFormat(function(d) { return d; });

  // Append a graphics node to the supplied svg node.
  var g = node.append("g")
    .attr("class", "key")
    .attr("transform", "translate(" + p.xoffset + "," + p.yoffset + ")");

  // Draw a colored rectangle for each ordinal range.
  g.selectAll("rect")
    .data(labels)
    .enter().append("rect")
    .attr("height", p.cellHeight)
    .attr("x", function(d, i) { return x(i); })
    .attr("width", function(d) { return p.cellWidth; })
    .style("fill", function(d, i)
    {
      return p.palette[i];
    });

  // Add the caption.
  g.call(xAxis).append("text")
    .attr("class", "caption")
    .attr("y", p.captionYOffset)
    .attr("x", p.captionXOffset)
    .text(p.caption)
    .style("font-weight", "bold")
    .style("font-size", p.captionFontSize);
}

   if (filterSubTopic != "none") {
//        console.log("herehere");
//        console.log(filterSubTopic);
      subtopChart.filter(filterSubTopic);
      dc.renderAll('topics');
//      RefreshTable();
   }



// end of process

}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

   if (filterSubTopic != "none") {
        console.log("herehere1");
        comsole.log(filterSubTopic);
      subtopChart.filter(filterSubTopic);
      dc.renderAll('topics');
//   RefreshTable();
   }



//topChart.filter('Univ. of Padova');
//dc.renderAll('topics');
//console.log("about to redraw");
//topChart.filter('Univ. of Padova');
//tag_inst.filter('Univ. of Padova');
//topChart.filters();
//dc.redrawAll('topics');

}

function filter1() {
    topChart.filter('Electron Energy Corporation');
    topChart.filters();
    console.log("filter1 called");
    dc.redrawAll('topics');
};
