import _ from 'lodash';
import '../../node_modules/chartist/dist/chartist.min.css';
import '../css/app.css';

import * as chart from './charts/chart_factory.js';
import * as d3 from '../../node_modules/d3-fetch/dist/d3-fetch.min.js';
import './bussiness/World.js';


import { World } from './bussiness/World.js';
import { GenericChart } from './charts/GenericChart.js';
import { CountryChart } from './charts/CountryChart.js';
import { DiffChart } from './charts/DiffChart.js';
import { ComparatorChart } from './charts/ComparatorChart';

//var Highcharts = require('highcharts'); 
//require('highcharts/modules/exporting')(Highcharts);   


const URL_CONFIRMED_CASES = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
const URL_DEATHS_CASES = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
const URL_RECOVERED_CASES = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv";
const URL_COUNTRIES = "https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-density.json";

//var COL_KEYS = [['co-ca','Cauca'],['co-na','Nariño'],['co-ch','Choco'],['co-3653','null'],['co-to','Tolima'],['co-cq','Caqueta'],['co-hu','Huila'],['co-pu','Putumayo'],['co-am','Amazonas'],['co-bl','Bolivar'],['co-vc','Valle del Cauca'],['co-su','Sucre'],['co-at','Atlantico'],['co-ce','Cesar'],['co-lg','La Guajira'],['co-ma','Magdalena'],['co-ar','Arauca'],['co-ns','Norte de Santander'],['co-cs','Casanare'],['co-gv','Guaviare'],['co-me','Meta'],['co-vp','Vaupes'],['co-vd','Vichada'],['co-an','Antioquia'],['co-co','Cordoba'],['co-by','Boyaca'],['co-st','Santander'],['co-cl','Caldas'],['co-cu','Cundinamarca'],['co-1136','Bogota'],['co-ri','Risaralda'],['co-qd','Quindio'],['co-gn','Guainia']];

var col_data;
var keys;

var logic;
var json_countries;
var left_list = document.getElementById('dual-list-right');
var right_list = document.getElementById('dual-list-left');
var size = 12;



window.onload=function() {
  
  load_csv();
  load_buttons();
  
} 

function load_map_co( col_data, keys ){

  var map_departments = {};
  var array_keys = {}
  var data = [];

  for( var i = 0; i < keys.length; i++ ){
    var cur = keys[i];
    map_departments[cur['Nombre Municipio']] = cur['Key'];
  }

  for( var j =0; j < col_data.length; j++ ){
    var dep = col_data[j]['Ciudad de ubicación'];
    dep = dep.replace('á','a').replace('é','e').replace('í','i').replace('ó','o').replace('ú','u').toUpperCase();
    if( map_departments[dep] != undefined ){
      var key = map_departments[dep];
      if( array_keys[key] == undefined )
        array_keys[key] = 0;

      array_keys[key]++;
    }else{
      console.log(dep);
    }
  }
  array_keys['co-cu'] = array_keys['co-1136'] + array_keys['co-cu'];
  for (var m in array_keys){
    data.push([m, array_keys[m]]);
  }

  Highcharts.mapChart('container2', {
    chart: {
        map: 'countries/co/co-all'
    },

    title: {
        text: 'Casos Colombia por departamento'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/co/co-all.js">Colombia</a>'
    },

    mapNavigation: {
        enabled: true,
        buttonOptions: {
            verticalAlign: 'bottom'
        }
    },

    colorAxis: {
        min: 0,
        //type: 'logarithmic',
        minColor: '#efecf3',
        maxColor: '#990041',
        lineWidth: 10
    },

    series: [{
        data: data,
        name: 'Casos Confirmados',
        states: {
            hover: {
                color: '#BADA55'
            }
        },
        dataLabels: {
            enabled: true,
            format: '{point.name}'
        }
    }]
});
}

function load_map( hot_map ){
    Highcharts.mapChart('container', {

        title: {
            text: 'Mapa de calor casos confirmados covid-19'
        },
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 1,
            max: 200000,
            type: 'logarithmic',
            minColor: '#efecf3',
            maxColor: '#990041',
            lineWidth: 10
        },

        series: [{
            data: hot_map,
            mapData: Highcharts.maps['custom/world'],
            joinBy: ['iso-a2', 'code'],
            name: 'Casos confirmados',
            borderColor: 'black',
            borderWidth: 0.5,
            states: {
                hover: {
                    borderWidth: 1
                }
            },
            tooltip: {
                valueSuffix: ''
            }
        }]
    });
}

function load_csv(){

  Promise.all([
    d3.csv(URL_CONFIRMED_CASES),
    d3.csv(URL_DEATHS_CASES),
    d3.csv(URL_RECOVERED_CASES),
    d3.json(URL_COUNTRIES),
    d3.csv('./src/data/Casos1.csv'),
    d3.csv('./src/data/dep_col.csv')
  ]).then(function(files) {
    logic = new World( files[0], files[1], files[2], files[3] );
    col_data = files[4];
    keys = files[5];
    load_map(logic.hot_map);
    load_list(logic.countries);
  }).catch(function(err) {
  })
}

function load_buttons(){

  document.getElementById('r4').addEventListener('click', function(){
    size = 4;
    update_plot();
  });
  document.getElementById('r6').addEventListener('click', function(){
    size = 6;
    update_plot();
  });
  document.getElementById('r12').addEventListener('click', function(){
    size = 12;
    update_plot();
  });
}



function update_plot(){
  document.getElementById("col_plot").style.display = "none";
  if(right_list.childNodes.length === 0)
    return;
  
  var countries = []
  for( var i = 1; i < right_list.childNodes.length; i++ ){
    var value = right_list.childNodes[i].value;
    countries.push(logic.countries[value]);

    if( logic.countries[value].name == 'Colombia' ){
      document.getElementById("col_plot").style.display = "inline";
      load_map_co(col_data, keys);
      
    }
  }
  
   

  var info_list = [];

  //var g1 = plot_lines(countries);
  var g1 = new GenericChart( countries ).getData('line', 'Fecha por dia', '# casos', 'col-md-' + size
  , 'Cantidad de casos confirmados desde el primer dia de aparición en los paises', 'cases');
  var g2 = new GenericChart( countries ).getData('line','Fecha por dia', '# muertes', 'col-md-' + size
  ,'Cantidad de muertes desde el primer dia de aparición en los paises', 'deaths');
  var g3 = new GenericChart( countries ).getData('line','Fecha por dia', '# recuperados', 'col-md-' + size
  ,'Cantidad de recuperados desde el primer dia de aparición en los paises', 'recovered');
  var g4 = new DiffChart(countries ).getData('bar', 'Fecha por dia', 'Porcentaje de crecimiento ', 'col-md-' + size
  , 'Porcentaje de crecimiento de casos confirmados respecto del día anterior');
  var g5 = new ComparatorChart( countries).getData('line','Fecha por dia', '# casos ', 'col-md-' + size
  ,'Comparativo de paises asumiendo el día 0 cuando superaron los 50 casos ');

  //var cases = new CountryChart( countries, countries[0] ).getData('line', 'Fecha por dia', '# casos ' + countries[0].name, 6);

  info_list.push(g1);
  info_list.push(g2);
  //info_list.push(g3);
  info_list.push(g4);
  info_list.push(g5);

  for( var  i =0; i < countries.length; i++ ){
    info_list.push(new CountryChart( countries, countries[i] ).getData('line', 'Fecha por dia', '# casos ' + countries[i].name, 'col-md-' + size
    , 'Cantidad de casos confirmados y muertes ' + countries[i].name));
  }

  //for( var i = 0; i < countries.length; i++ ){
  chart.plot_list(info_list);


}


function load_list(countries){
  var i = 0;
  countries.forEach( element => {
    var li = document.createElement("li");
    var span = document.createElement("span");
    li.classList.add("list-group-item");
    li.setAttribute('data-value', i);
    li.setAttribute('value', i++);
    span.classList.add("glyphicon");
    span.classList.add("glyphicon-plus");
    span.classList.add("pull-right");
    span.classList.add("dual-list-move-left");

    li.appendChild(document.createTextNode(element.name + " " + element.province));
    li.appendChild(span);
    left_list.appendChild(li);
  });
}



/**
 * Multilist events
 */


$(function () {
  var move_right = '<span class="glyphicon glyphicon-minus pull-left  dual-list-move-right" title="Remove Selected"></span>';
  var move_left  = '<span class="glyphicon glyphicon-plus  pull-right dual-list-move-left " title="Add Selected"></span>';
  
  $(".dual-list.list-left .list-group").sortable({
      stop: function( event, ui ) {
          updateSelectedOptions();
      }
  });
  
  
  $('body').on('click', '.list-group .list-group-item', function () {
      $(this).toggleClass('active');

      if( this.offsetParent !== null ){
        var type = this.offsetParent.className;
        if( type === "dual-list list-right col-md-6"){
          moveToRight(this);
        }else{
          moveToLeft(this);
        }
      }
  });
  

  function moveToRight( t ){
      if(right_list.childNodes.length >= 6)
         return;
      t = t.childNodes[1];
      var actives = $(t).parent();
      $(t).parent().find("span").remove();
      $(move_right).clone().appendTo(actives);
      actives.clone().appendTo('.list-left ul').removeClass("active");
      actives.remove();


      update_plot();

      updateSelectedOptions();
  }

  function moveToLeft( t ){
      t = t.childNodes[1];
      var actives = $(t).parent();
      $(t).parent().find("span").remove();
      $(move_left).clone().appendTo(actives);
      actives.clone().appendTo('.list-right ul').removeClass("active");
      actives.remove();
      sortUnorderedList("dual-list-right");
      
      if(right_list.childNodes.length > 1)
        update_plot();

      
      updateSelectedOptions();
  }
  
  $('body').on('click', '.dual-list-move-right', function (e) {
      e.preventDefault();
  });
  
  
  $('body').on('click', '.dual-list-move-left', function (e) {
      e.preventDefault();
  });
  
  
  $('.move-right, .move-left').click(function () {
      var $button = $(this), actives = '';
      if ($button.hasClass('move-left')) {
          actives = $('.list-right ul li.active');
          actives.find(".dual-list-move-left").remove();
          actives.append($(move_right).clone());
          actives.clone().appendTo('.list-left ul').removeClass("active");
          actives.remove();
          
      } else if ($button.hasClass('move-right')) {
          actives = $('.list-left ul li.active');
          actives.find(".dual-list-move-right").remove();
          actives.append($(move_left).clone());
          actives.clone().appendTo('.list-right ul').removeClass("active");
          actives.remove();
          
      }
      
      updateSelectedOptions();
  });
  
  
  function updateSelectedOptions() {
      $('#dual-list-options').find('option').remove();

      $('.list-left ul li').each(function(idx, opt) {
          $('#dual-list-options').append($("<option></option>")
              .attr("value", $(opt).data("value"))
              .text( $(opt).text())
              .prop("selected", "selected")
          ); 
      });
  }
  
  
  $('.dual-list .selector').click(function () {
      var $checkBox = $(this);
      if (!$checkBox.hasClass('selected')) {
          $checkBox.addClass('selected').closest('.well').find('ul li:not(.active)').addClass('active');
          $checkBox.children('i').removeClass('glyphicon-unchecked').addClass('glyphicon-check');
      } else {
          $checkBox.removeClass('selected').closest('.well').find('ul li.active').removeClass('active');
          $checkBox.children('i').removeClass('glyphicon-check').addClass('glyphicon-unchecked');
      }
  });
  
  
  $('[name="SearchDualList"]').keyup(function (e) {
      var code = e.keyCode || e.which;
      if (code == '9') return;
      if (code == '27') $(this).val(null);
      var $rows = $(this).closest('.dual-list').find('.list-group li');
      var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
      $rows.show().filter(function () {
          var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
          return !~text.indexOf(val);
      }).hide();
  });
  
  
  $(".glyphicon-search").on("click", function() {
      $(this).next("input").focus();
  });
  
  
  function sortUnorderedList(ul, sortDescending) {
      $("#" + ul + " li").sort(sort_li).appendTo("#" + ul);
      
      function sort_li(a, b){
          return ($(b).data('value')) < ($(a).data('value')) ? 1 : -1;    
      }
  }
      
  $("#dual-list-left li").append(move_right);
  $("#dual-list-right li").append(move_left);

});


/**
 * slider
 */