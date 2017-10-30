//  google.charts.load('current', {'packages':['barchart']});
//google.charts.load('current', {'packages':['corechart']});
// Load the Visualization API and the controls package.
google.charts.load('current', { 'packages': ['corechart', 'controls'] });
google.charts.setOnLoadCallback(drawChart);

///
//https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
///
function loadJSON2(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    // xobj.open('GET', 'habitica-user-data.json', false); // Replace 'my_data' with the path to your file
    xobj.open('GET', 'test.json', false); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}///
//
///
function getjsonGraph() {
    var graph = {
        "_id": "4d2f45a9-dc5e-4e77-9c8c-de1469282522",
        "_ABTests": {
            "onboardingPushNotification": "Onboarding-Step5-Phasea-VersionD"
        },
        "migration": "20170928_redesign_launch.js"
    }
    return graph;
}


///
//
///
function loadData() {
    var actual_JSON = "*";

    loadJSON2(function (response) {
        actual_JSON = JSON.parse(response);
        console.log(actual_JSON);
    });

    // fetchJSON();
    // var graph = getjsonGraph();
    var graph = actual_JSON;
    //console.log(graph); // this will fail without synchronous load



    var dt = new google.visualization.DataTable(graph);
    dt.addColumn('date', 'date');

    var numberofcolumns = graph.habits.length;


    numberofcolumns = 2;

    // create columns
    for (var z = 0; z < numberofcolumns; z++) {
        dt.addColumn('number', graph.habits[z].text);
    }




    //for ( var i = 0; i < graph.history.length; i++)
    {
        for (var j = 0; j < graph.habits.length; j++) {
            //dt.addColumn('number', graph.habits[j].text);
            var history = graph.habits[j].history;
            for (var k = 0; k < history.length; k++) {
                var obj = history[k];
                //console.log(obj);

                var row_arr = new Array(numberofcolumns + 1);
                //console.log(numberofcolumns);
                for (y = 0; y < row_arr.length; y++) {
                    // null new row
                    row_arr[y] = 0;
                }
                row_arr[0] = new Date(obj["date"]);

                //write column if a valid column based on filters
                if (j < numberofcolumns)
                    row_arr[j + 1] = obj["value"];
                console.log(row_arr);
                dt.addRows([row_arr]);
            }


        }
    }
    //TO DO
    // need to iterate on test.json


    //dt.addColumn('number', 'Rating2');

    return dt;
}




function drawChart() {

    var data = loadData();

    // Need to figure out how to parse the json file to grab the row data




   

    var view = new google.visualization.DataView(data);
    /* view.setColumns([0, 1,
                         { calc: "stringify",
                           sourceColumn: 1,
                           type: "string",
                           role: "annotation" },
                         2]);
      */
    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    // chart.draw(view,(options));

    var button = document.getElementById('change');



    console.log("here1");

    // Create a dashboard.
    var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard_div'));
    console.log("here");
    var datePicker = new google.visualization.ControlWrapper({

        'controlType': 'DateRangeFilter',
        'containerId': 'filter_div',
        'options': {
            'filterColumnLabel': 'date',
            'ui': { 'label': 'Date Range' }
            //  'ui': {
            //    format:format: {pattern: "EEE, MMM d, ''yy"},
            //  }
        }
    });
   


    var chartwrapper = new google.visualization.ChartWrapper({
        'chartType': 'ColumnChart',
        'containerId': 'chart_div',
        
        'options':{
            'height':'500',
            'width':'1400',
            'hAxis':{
                'title':'boo',
                'gridlines':'10',
                'width':'800',
            },
            'bar':{
                'groupWidth': '90%'
            }
        },
    }
    );

    // binding
    dashboard.bind(datePicker, chartwrapper);
    console.log("here");
    //		chart.draw(data, options);
    dashboard.draw(data);

    ////
    button.onclick = function () {

        // If the format option matches, change it to the new option,
        // if not, reset it to the original format.
        options.hAxis.format === 'M/d/yy' ?
            options.hAxis.format = 'MMM dd, yyyy' :
            options.hAxis.format = 'M/d/yy';



    };
}

