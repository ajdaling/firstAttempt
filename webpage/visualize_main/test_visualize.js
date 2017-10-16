// var reportData = JSON.parse(localStorage.getItem("reportData"));
// reportData["title"] = "cancer";
// reportData["start_year"] = 2010;
// reportData["end_year"] = 2010;

var reportData = {
  "title":"stem",
  "institution":"",
  "researcher":"",
  "start_year":"2000",
  "end_year":"2010",
  "topic1":"cancer",
  "topic2":"neuro",
  "topic3":"cardiac",
  "topic4":"alzheimers",
  "topic5":"brain",
  "topic6":"heart",
  "topic7":"cell",
  "tempTopic":"heart"

}

var d;
$.ajax({
  url: "http://10.1.10.58:8501/visualize_main.sjs",
  data: reportData,
  success:function(data){
    alert("success" + String(data));
    d = data;
    console.log("data is" + data);
    $('#results').text(data.estimate);
  },
  error: function(){
    alert("error");
  }
});
