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

const URL_CONFIRMED_CASES = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
const URL_DEATHS_CASES = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv";
const URL_RECOVERED_CASES = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv";

var logic;
var left_list = document.getElementById('dual-list-right');
var right_list = document.getElementById('dual-list-left');
var size = 12;


window.onload=function() {
  load_csv();
  load_buttons();
} 


function load_csv(){

  Promise.all([
    d3.csv(URL_CONFIRMED_CASES),
    d3.csv(URL_DEATHS_CASES),
    d3.csv(URL_RECOVERED_CASES)
  ]).then(function(files) {
    logic = new World(files[0], files[1], files[2]);
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

  if(right_list.childNodes.length === 0)
    return;
    
  var countries = []
  for( var i = 1; i < right_list.childNodes.length; i++ ){
    var value = right_list.childNodes[i].value;
    countries.push(logic.countries[value]);
  }
  
   

  var info_list = [];

  //var g1 = plot_lines(countries);
  var g1 = new GenericChart( countries ).getData('line', 'Fecha por dia', '# casos', 'col-md-' + size
  , 'Cantidad de casos confirmados desde el primer dia de aparición en los paises');
  var g2 = new GenericChart( countries ).getData('bar','Fecha por dia', '# casos', 'col-md-' + size
  ,'Cantidad de casos confirmados desde el primer dia de aparición en los paises');
  var g3 = new DiffChart(countries ).getData('bar', 'Fecha por dia', 'Porcentaje de crecimiento ', 'col-md-' + size
  , 'Porcentaje de crecimiento de casos confirmados respecto del día anterior');
  var g4 = new ComparatorChart( countries).getData('line','Fecha por dia', '# casos ', 'col-md-' + size
  ,'Comparativo de paises asumiendo el día 0 cuando superaron los 50 casos ');

  //var cases = new CountryChart( countries, countries[0] ).getData('line', 'Fecha por dia', '# casos ' + countries[0].name, 6);

  info_list.push(g1);
  info_list.push(g2);
  info_list.push(g3);
  info_list.push(g4);


  for( var  i =0; i < countries.length; i++ ){
    info_list.push(new CountryChart( countries, countries[i] ).getData('line', 'Fecha por dia', '# casos ' + countries[i].name, 'col-md-' + size
    , 'Cantidad de casos confirmados, muertes y recuperados ' + countries[i].name));
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

      

      // var actives = $(this).parent();
      // $(this).parent().find("span").remove();
      // $(move_left).clone().appendTo(actives);
      // actives.clone().appendTo('.list-right ul').removeClass("active");
      // actives.remove();
      // sortUnorderedList("dual-list-right");
      
      // update_plot();

      
      // updateSelectedOptions();
  });
  
  
  $('body').on('click', '.dual-list-move-left', function (e) {
      e.preventDefault();

      // if(right_list.childNodes.length >= 6)
      //    return;
        
      // var actives = $(this).parent();
      // $(this).parent().find("span").remove();
      // $(move_right).clone().appendTo(actives);
      // actives.clone().appendTo('.list-left ul').removeClass("active");
      // actives.remove();


      // update_plot();

      // updateSelectedOptions();
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