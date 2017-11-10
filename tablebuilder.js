//  google.charts.load('current', {'packages':['barchart']});
//google.charts.load('current', {'packages':['corechart']});
// Load the Visualization API and the controls package.
google.charts.load('current', { 'packages': ['corechart', 'controls','bar'] });
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



    //var dt = new google.visualization.DataTable(graph);
  

    var numberofcolumns = graph.habits.length;


    numberofcolumns = 6; //#### just temp for test

    var columntitle = [];
     //### dt.addColumn('date', 'date');
     columntitle.push({label:'date', type:'date'});
    // create columns
    for (var z = 0; z < numberofcolumns; z++) {
     // ####   dt.addColumn('number', graph.habits[z].text);
     columntitle.push({label:graph.habits[z].text, type:'number'});
    }
    var listofrows = [];
    
listofrows.push(columntitle);
   // ## Definitely the DATA I'm adding messing things up
if (1)
{
   // listofrows.push([{label:'date', type:'date'}, {label:'Sales',type:'number'}, {label:'Expenses',type:'number'}, {label:'Profit',type:'number'}]);
    //for ( var i = 0; i < graph.history.length; i++)
    {
        for (var j = 0; j < graph.habits.length; j++) {
            //dt.addColumn('number', graph.habits[j].text);
            var history = graph.habits[j].history;
            for (var k = 0; k < history.length; k++) {
                var obj = history[k];
                //console.log(obj);

                var modified_date = new Date(new Date(obj["date"]).toDateString());
                console.log(modified_date);
                var foundOne = false;
// 11/10/2017 -- Need to find out if a row exists already
// matching on date
                for (var zzz = 0 ; zzz < listofrows.length; zzz++)
                {

                    // skip column row
                    if (zzz > 0)
                    if (listofrows[zzz][0].getTime() === modified_date.getTime()){
                        // add to this row instead
                        // for now I'm just Excluding it
                        // TODO
                        console.log("found one, skiping");
                        foundOne= true;
                        listofrows[zzz][0][j+1] = parseInt(obj["value"]);
                    }
                }
                if (foundOne == false)
                {
                    console.log("row with date is unisque" + modified_date);
                    var row_arr = [];// #new Array(numberofcolumns + 1);
                    //console.log(numberofcolumns);
                    for (y = 0; y < numberofcolumns+1; y++) {
                        // null new row
                        row_arr[y] = 0;
                    }
                    // 11/7/2017 trying to strip time to get the thick bars?
                    row_arr[0] = modified_date;

                    //write column if a valid column based on filters
                    if (j < numberofcolumns)
                        row_arr[j + 1] = parseInt(obj["value"]); //****
                    //console.log(row_arr);
                
                    listofrows.push(row_arr);
                }
            }
           
           
        }
    }
  /*  var dt = google.visualization.arrayToDataTable([
        ['date', 'Sales', 'Expenses', 'Profit'],
        [new Date('10/10/2017'), 1, 4, 2]
    ]);*/
    //listofrows.push([new Date('10/11/2017'), 22, 14, 12]);
    //listofrows.push([new Date('10/12/2017'), 2, 4, 2]);
    console.log(listofrows);
    var dt = google.visualization.arrayToDataTable(listofrows);
   // listofrows.push([new Date('10/11/2017'), 22, 14, 12]);
/* The solution will need to be 11/7/2017:

 ( 1 - I need to have onlyone ROW for each date. Period!)

   // theory - is it because DATE is NOT unique? because when this single data point is outside all is good
  listofrows.push([new Date('10/10/2017'), 1, 4, 2]);
  listofrows.push([new Date('10/11/2017'), 2, 5, 3]); // and if I add a second, we are pooched
    var dt = google.visualization.arrayToDataTable(listofrows);
*/  
   // dt.addRows(listofrows);
}
   // console.log ("BOO==>" + dt.getValue(0,0));
   // console.log ("BOO==>" + dt.getValue(0,1));
   // console.log ("BOO==>" + dt.getValue(0,2));
  //  console.log ("BOO==>" + dt.getValue(0,3));
    //TO DO
    // need to iterate on test.json


    //dt.addColumn('number', 'Rating2');

    return dt;
}




function drawChart() {

    var data = loadData();  

    // Need to figure out how to parse the json file to grab the row data




   

    //var view = new google.visualization.DataView(data);
    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));

    var button = document.getElementById('change');



    

    // Create a dashboard.
    var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard_div'));
    
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
        'chartType': 'BarChart',
        'containerId': 'chart_div',
        
        'options':{
            'height':'800',
            'width':'1400',
            
            'hAxis':{
                'title':'boo',
                
                'width':'800',
            }
            /*,
            'series' : {
                '0': {'axis': 'Jump rope'}, 
                '1': {'axis': 'Kindness/Growl'}
            },
            'axes' :{
                'y':{
                    'Jump Rope' : {'label': 'xxxx'},
                    'Kindness/Growl' :{'label' : 'yyyy'}
                }
            }
            */
            ,           
            'bar':{
                'groupWidth': "90%",
            }
        },
    }
    );

    // this works with thick graphs
     data2 = google.visualization.arrayToDataTable([
        ['date', 'Sales', 'Expenses', 'Profit'],
        [new Date('1/1/2014'), 1000, 400, 200],
        [new Date('1/2/2014'), 1170, 460, 250],
        [new Date('1/3/2014'), 660, 0, 300],
        [new Date('1/4/2014'), 1030, 540, 350]
      ]);
      console.log ("BOO==>" + data2.getValue(0,0));
      console.log ("BOO==>" + data2.getValue(0,1));

     // data = data2; //  # Data2 gives me thick bars

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

