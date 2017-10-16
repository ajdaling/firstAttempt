window.onload = function() {
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function showData(point) {
        var data = point.data;
        var elem = document.getElementById('output');
        var html = '<table class=datatable>'
                   + '<tr><th colspan=2>Data</th></tr>'
                   + '<tr><td class=field>Institution</td><td class=value>' + data[2] + '</td></tr>'
                   + '<tr><td class=field>Topic</td><td class=value>' + slices[data[0]] + '</td></tr>'
                   + '<tr><td class=field>Document Type</td><td class=value>' + data[1] + '</td></tr>'
                   + '<tr><td class=field>Documents</td><td class=value>' + data[3] + '</td></tr>'
                   + '</table>';


        elem.innerHTML = html;
    }

    var slices = ['Cell-based Therapies', 'Tissue-based Engineering', 'Gene-based Therapies', 'Acellular Therapies'];
    var theaters = {
        1: 'Cell-based Therapies',
        2: 'Tissue-based Engineering',
        3: 'Gene-based Therapies',
        4: 'Acellular Therapies'
    };
    var bullseye = Raphael('canvas', 640, 600).bullseye({
        'slices': slices,
        'rings' : ['Phase 1','Phase 2','Phase 3','Patents','Pubs','Grants'],
        'startDegree': 0,
        'allowDrag': false,
        'onMouseOver': showData,
        'onPointClick': showData,
        'onSliceClick': function(sliceIdx) {
            alert("You've clicked on " + slices[sliceIdx]);
        }

    });
    var baseYear = 1940;
    //http://history1900s.about.com/od/worldwarii/a/wwiibattles.htm
    var data = [
        [0, 'Phase 1', 	'Mayo', 20, 'axis'],
        [1, 'Pubs', 	'Mayo', 3,  'axis'],
        [2, 'Patents', 'Mayo', 10, 'axis'],
        [3, 'Phase 2', 	'Mayo', 20, 'axis'],
        [0, 'Phase 1', 	'University of Pennsylvania', 20, 'axis'],
        [1, 'Pubs', 	'University of Pennsylvania', 3,  'axis'],
        [2, 'Patents', 'University of Pennsylvania', 10, 'axis'],
        [3, 'Phase 2', 	'University of Pennsylvania', 20, 'axis'],
        [0, 'Phase 1', 	'MD Anderson', 20, 'axis'],
        [1, 'Pubs', 	'MD Anderson', 3,  'axis'],
        [2, 'Patents', 'MD Anderson', 10, 'axis'],
        [3, 'Phase 2', 	'MD Anderson', 20, 'axis'],
        [0, 'Phase 1', 	'Harvard', 20, 'axis'],
        [1, 'Pubs', 	'Harvard', 3,  'axis'],
        [2, 'Patents', 'Harvard', 10, 'axis'],
        [3, 'Phase 2', 	'Harvard', 20, 'axis']
    ];


    var angle;
    var upper_bound, lower_bound;
	 var ring;
    for (var i = 0; i < data.length; i++) {
        switch(data[i][0]) {
            case 0:
                lower_bound = 5;
                upper_bound = 90;
                break;
            case 1:
                lower_bound = 90;
                upper_bound = 180;
                break;
            case 2:
                lower_bound = 180;
                upper_bound = 270;
                break;
            case 3:
                lower_bound = 270;
                upper_bound = 355;
                break;
        }
        switch(data[i][1]) {
            case 'Phase 1':
                ring = 0;
                break;
            case 'Phase 2':
                ring = 1;
                break;
            case 'Phase 33':
                ring = 2;
                break;
            case 'Patents':
                ring = 3;
                break;
            case 'Pubs':
                ring = 4;
                break;
            case 'Grants':
                ring = 5;
                break;
        }

        angle = rand(lower_bound, upper_bound);

        // show positive angle when you hover over a point
        if (angle < 0) angle += 360;

		  size = data[i][3];

		

        var point = bullseye.addPoint({
            label: data[i][2],
            ring: ring,
            angle: angle * Math.PI / 180,
            pointFill: data[i][4] == 'allies' ? '#00ff00' : '#ff0000',
            pointSize: size,
            distance: .5
        });

        point.data = data[i];
    }
        
}
