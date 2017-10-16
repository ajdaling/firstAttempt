$.ajax({
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      type: "GET",
      url: "marklogic.superhindex.com:8503/",
      success: function(data) {
    	  alert("success");
    	  console.log(data);
    	  $("#results").text(data);
      },
      error:function(){
    	  alert("error");
      }
    })