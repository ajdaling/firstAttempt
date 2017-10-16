catType = 0; // 0: gramts; 1: patents; 2: ieee
filterTopic = "none";
filterTopicNum = 0;
filterSubTopic = "none";
var authorMatch = "ALL";
var instMatch = "ALL";
var instTable;

function instMasterProcessFile(authorList, instList) {
  
  if (authorList != "ALL") {
    authorMatch = authorList.replace(/%20/g, ' ');
  }


  if (instList != "ALL") {
    instMatch = instList.replace(/%20/g, ' ');
  }

  yadcf_data_0 = ["Publication", "Patent", "Grant"];

  instTable = $('#auth-master-table').DataTable({
    dom: 'BT<"top"if>rt<"bottom"lp><"clear">',
    buttons: [
      'colvis',
      'csv',
      'pdf',
      'print'
    ],
    //instTable = $('#auth-master-table').dataTable({
    //   dom: 'T<"clear">lfrtip',
    //   tableTools: {
    //     "sSwfPath": "lib/DataTables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
    //   },
    //   "bSort": true,
    "bProcessing": true,
    "bStateSave": true,
    "fnStateSave": function(oSettings, oData) {
      localStorage.setItem('DataTables_' + window.location.pathname, JSON.stringify(oData));
    },
    "fnStateLoad": function(oSettings) {
      var data = localStorage.getItem('DataTables_' + window.location.pathname);
      return JSON.parse(data);
    },

    "autoWidth": false,
    //   "paging":   false,
    //   "ordering": false,
    //   "info":     false,
    //   "bFilter":     false,
    "pagingType": "simple_numbers",
    "iDisplayLength": 25,
    "aLengthMenu": [
      [25, 50, 100, 1000],
      [25, 50, 100, 1000]
    ],
    "aaSorting": [
      [1, 'desc'],
      [0, 'desc'],
      [3, 'asc']
    ],
    "orderClasses": false,
    "deferRender": true,
    "serverSide": true,
    "ajax": "./server_processing_inst.php",
    "columnDefs": [{
        // The `data` parameter refers to the data for the cell (defined by the
        // `data` option, which defaults to the column being worked with, in
        // this case `data: 0`.
        "render": function(data, type, row) {
          return data + ' (' + row[11] + ')';

        },
        "targets": 10
      },
      {
        // The `data` parameter refers to the data for the cell (defined by the
        // `data` option, which defaults to the column being worked with, in
        // this case `data: 0`.
        "render": function(data, type, row) {
          if (data) {
            return "$" + data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          } else {
            return '';
          }
        },
        "targets": 8
      },
      {
        // The `data` parameter refers to the data for the cell (defined by the
        // `data` option, which defaults to the column being worked with, in
        // this case `data: 0`.
        "render": function(data, type, row) {
          if (data.indexOf("&uuml;") == -1) {
            dataEscaped = data.replace(/&/g, ';AND;');
            dataEscaped = dataEscaped.replace(/;amp;/g, ';');
          } else {
            dataEscaped = data;
          }
          //                    dataEscaped = data.replace(/'/g,"\\'");
          //		    dataEscaped = data;
          console.log("dataEscaped");
          console.log(data);
          return '<a href="instData.php?instName=' + dataEscaped + '">' + data + '</a>';
        },
        "targets": 0
      },
      {
        // The `data` parameter refers to the data for the cell (defined by the
        // `data` option, which defaults to the column being worked with, in
        // this case `data: 0`.
        "render": function(data, type, row) {
          if (data) {
            return "$" + data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          } else {
            return '';
          }
        },
        "targets": 9
      },
      {
        "targets": [11],
        "visible": false,
        "searchable": true
      }
    ]
  });

  console.log(authorMatch);
  if (authorMatch != "ALL") {
    console.log("filtering table");
    console.log(authorMatch);
    instTable.fnFilter(authorMatch, 4, true);
  }

  if (instMatch != "ALL") {
    console.log("filtering table");
    console.log(instMatch);
    instTable.fnFilter(instMatch, 5, true);
  }

}
