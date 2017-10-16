$(function() {

oTable = $('#example').dataTable({
    "bServerSide": true,
//	 "fnSetFilteringDelay": 2000,
//    "sAjaxSource": "http://localhost:8921/datatables.sjs",
    "sAjaxSource": "http://"+config.host+":"+config.port+"/datatables_inst.sjs",
  });

});
