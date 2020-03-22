import Chartist from 'chartist/dist/chartist.min';
import chartjs from 'chart.js/dist/Chart.bundle';

import React, { Component } from "react";
import ReactDOM from "react-dom";


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

var charts = [];
var chart_react_list = undefined; 
var inf = [];

function Chart_React( props ){
    return (
        <div className={props.options.size}>
            <div className="card text-center">
                 <div className="well card-header">
                    {props.options.header}
                </div> 
                <div className="card-body">
                    <div className="chart-container" >
                        <canvas  id={props.ID}></canvas>
                    </div> 
                </div>
                {/* <div className="well card-footer">
                    {props.header}
                </div> 
                 */}
            </div>   
        </div>
    );
}



class Chart_React_List extends Component{

    
    constructor(props) {
        super(props);
        this.listitems = [];
        for( var i =0; i < this.props.info.length; i++ ){
            this.listitems.push([i, this.props.info[i].options ]);
        }

        this.state = {
            listitems: this.listitems
          };
        
        //this.onResetArray.bind(this);
    }


    onResetArray = () => {
        this.setState({ listitems: inf });
    }

    render() {
        return (
            <div id ="inputClick" onClick={this.onResetArray}>
                
                {
                    this.state.listitems.map(listitem => (
                    <Chart_React  ID ={'c' + listitem[0]}
                    key={'c' + listitem[0]} options={listitem[1]}/>
                ))}

            </div>
        );
    }
}




export function plot_list( info_list ){


    for( var i = 0; i < charts.length; i++ )
        charts[i].destroy();
    charts = [];
    inf = []
    for( var i =0; i < info_list.length; i++ )
        inf.push([i, info_list[i].options ]);

    if( chart_react_list == undefined ){
        chart_react_list = <Chart_React_List  info = {info_list} />;
        ReactDOM.render(chart_react_list, document.getElementById('chart-list'));
    }else{
        //chart_react_list.type.prototype.update();
        var el = document.getElementById('inputClick').click();
        //chart_react_list.update_state(info_list);
    }
    

    for( var i = 0; i < info_list.length; i++ ){
        plot( info_list[i], i );
    }
}

function plot( info, index ){
    var x_axis = info.x_axis;
    var y_axis = info.y_axis;
    var labels = info.labels;;
    var chart_type = info.type;
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

    var ctx = document.getElementById('c' +index).getContext("2d");;
    var myChart = new Chart(ctx, {
        type: chart_type,
        data: {
            labels: x_axis,
            datasets: datasets
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: info.options.y_label
                      }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: info.options.x_label
                      }
                }]
            },
        // legend: {
        //     display: true,
        //     position: 'bottom',
        //     labels: {
        //         fontColor: "#000080",
        //     }
        // }

        }
    });
    charts.push(myChart);
}