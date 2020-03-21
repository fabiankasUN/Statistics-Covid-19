import Chartist from '../../node_modules/chartist/dist/chartist.min.js';
import chartjs from '../../node_modules/chart.js/dist/Chart.bundle.js';

const BACKGROUD_COLORS = ['rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)'];

const BORDER_COLORS = ['rgba(255, 99, 132, 1)',
'rgba(54, 162, 235, 1)',
'rgba(255, 206, 86, 1)',
'rgba(75, 192, 192, 1)',
'rgba(153, 102, 255, 1)',
'rgba(255, 159, 64, 1)']


var ctx;
var myChart;

var myChart2;
var bar_ctx2;

var myChart3;
var bar_ctx3;

export function linear_chart( x_axis, y_axis, w, h){
    // var options = {
    //     width: w,
    //     height: h
    //   };
    
    var data = {
    // A labels array that can contain any sort of values
        labels: x_axis,
        // Our series array that contains series objects or in this case series data arrays
        series: y_axis
        
    };
    
    // Create a new line chart object where as first parameter we pass in a selector
    // that is resolving to our chart container element. The Second parameter
    // is the actual data object.
    new Chartist.Line('#chart1', data);
}

export function bar_chart( x_axis, y_axis ){
    var data = {
        labels: x_axis,
        series: y_axis
      };
      
      // In the global name space Chartist we call the Bar function to initialize a bar chart. As a first parameter we pass in a selector where we would like to get our chart created and as a second parameter we pass our data object.
      new Chartist.Bar('#chart2', data);
}


export function bar_chartjs( x_axis, y_axis, labels ){

    var datasets = []
    
    for( var i = 0; i < y_axis.length; i++ ){
        var cur = {
            label: labels[i],
            data: y_axis[i],
            backgroundColor: BACKGROUD_COLORS[i%6],
            borderColor: BORDER_COLORS[i%6],
            borderWidth: 1
        }
        datasets.push(cur);
    }


    if( myChart != undefined ){
        myChart.destroy();
        ctx = document.getElementById("myChart").getContext("2d");
    }else{
        ctx = document.getElementById('myChart');
    }

    

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: x_axis,
            datasets: datasets
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

}

export function linear_chartjs( x_axis, y_axis, labels){

    var datasets = []
    
    for( var i = 0; i < y_axis.length; i++ ){
        var cur = {
            label: labels[i],
            data: y_axis[i],
            backgroundColor: BACKGROUD_COLORS[i%6],
            borderColor: BORDER_COLORS[i%6],
            borderWidth: 1
        }
        datasets.push(cur);
    }



    if( myChart2 != undefined ){
        myChart2.destroy();
        bar_ctx2 = document.getElementById("myChart2").getContext("2d");
    }else{
        bar_ctx2 = document.getElementById('myChart2');
    }

    myChart2 = new Chart(bar_ctx2, {
        type: 'line',
        data: {
            labels: x_axis,
            datasets: datasets
        }
    });
}



export function bar_chartjs2( x_axis, y_axis, labels){

    var datasets = []
    
    for( var i = 0; i < y_axis.length; i++ ){
        var cur = {
            label: labels[i],
            data: y_axis[i],
            backgroundColor: BACKGROUD_COLORS[i%6],
            borderColor: BORDER_COLORS[i%6],
            borderWidth: 1
        }
        datasets.push(cur);
    }
    if( myChart3 != undefined ){
        myChart3.destroy();
        bar_ctx3 = document.getElementById("myChart3").getContext("2d");
    }else{
        bar_ctx3 = document.getElementById('myChart3');
    }

    myChart3 = new Chart(bar_ctx3, {
        type: 'bar',
        data: {
            labels: x_axis,
            datasets: datasets
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    
}