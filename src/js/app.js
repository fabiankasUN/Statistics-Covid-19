import _ from 'lodash';
import '../../node_modules/chartist/dist/chartist.min.css';

import '../css/multilist.css';
import * as chart from './chart.js';
import * as d3 from '../../node_modules/d3-fetch/dist/d3-fetch.min.js';
import './bussiness/Plot.js';
import { Plot } from './bussiness/Plot.js';


var logic;

var left_list = document.getElementById('dual-list-right');

var right_list = document.getElementById('dual-list-left');


window.onload=function() {
  load_csv();
} 

function load_csv(){

  d3.csv("/src/data/time_series_19-covid-Confirmed.csv").then(function(data) {
    logic = new Plot(data);
    load_list(logic.countries);
  });
}


function plot_lines(lines){
  
  var x_axis = [];
  var y_axis = [];
  var labels = [];

  var init = 100000;
  for( var i =0; i < lines.length; i++ ){
    let country = logic.countries[lines[i]];
    for( var j =0; j < country.cases.length; j++ ){
      if(country.cases[j].value > 0){
        init = Math.min(init, j);
      }
    }
  }


  for( var i =init; i < logic.countries[0].cases.length; i++ ){
      x_axis.push(logic.countries[0].cases[i].date.getDate());
    
  }
  //logic.countries[0].cases.foreach( element => { x_axis.push(element.date.getDate()); });
  for( var i =0; i < lines.length; i++ ){
    let country = logic.countries[lines[i]];
    labels.push(country.name + ' ' + country.province);
    var y = [];
    for( var j =init; j < country.cases.length; j++ ){
        y.push(country.cases[j].value); 
    }
    y_axis.push(y);
  }

  chart.linear_chartjs( x_axis, y_axis, labels);
  //chart.linear_chart( x_axis, y_axis, 1000,600);
}

function plot_bars(lines){
  var x_axis = [];
  var y_axis = [];
  var labels = [];

  var init = 100000;
  for( var i =0; i < lines.length; i++ ){
    let country = logic.countries[lines[i]];
    for( var j =0; j < country.cases.length; j++ ){
      if(country.cases[j].value > 0){
        init = Math.min(init, j);
      }
    }
  }

  for( var i =init; i < logic.countries[0].cases.length; i++ ){
      x_axis.push(logic.countries[lines[0]].cases[i].date.getDate());
  }
  //logic.countries[0].cases.foreach( element => { x_axis.push(element.date.getDate()); });
  for( var i =0; i < lines.length; i++ ){
    let country = logic.countries[lines[i]];
    labels.push(country.name + ' ' + country.province);
    var y = [];
    var last = 0;
    for( var j =init; j < country.cases.length; j++ ){
      //if(country.cases[j].value > 0){
        y.push(country.cases[j].value);
        last = country.cases[j].value 
      //}
    }
    y_axis.push(y);
  }

  //chart.bar_chart( x_axis, y_axis );
  chart.bar_chartjs(x_axis, y_axis, labels);
}   

function plot_bars2(lines){
  var x_axis = [];
  var y_axis = [];
  var labels = [];

  var init = 100000;
  for( var i =0; i < lines.length; i++ ){
    let country = logic.countries[lines[i]];
    for( var j =0; j < country.cases.length; j++ ){
      if(country.cases[j].value > 0){
        init = Math.min(init, j);
      }
    }
  }
  console.log(init);

  for( var i =init; i < logic.countries[0].cases.length; i++ ){
      x_axis.push(logic.countries[lines[0]].cases[i].date.getDate());
  }
  //logic.countries[0].cases.foreach( element => { x_axis.push(element.date.getDate()); });
  for( var i =0; i < lines.length; i++ ){
    let country = logic.countries[lines[i]];
    labels.push(country.name + ' ' + country.province);
    var y = [];
    var last = 0;
    for( var j =init; j < country.cases.length; j++ ){
      //if(country.cases[j].value > 0){
        var diff = country.cases[j].value - last;
        y.push(diff*100/last);
        last = country.cases[j].value 
      //}
    }
    y_axis.push(y);
  }

  //chart.bar_chart( x_axis, y_axis );
  chart.bar_chartjs2(x_axis, y_axis, labels);
}   



function update_plot(){

  var lines = []
  for( var i = 1; i < right_list.childNodes.length; i++ ){
    var value = right_list.childNodes[i].value;
    lines.push(value);
  }

  plot_lines(lines);
  plot_bars(lines);
  plot_bars2(lines);

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

    //select.options[select.options.length] = new Option(element, index++);
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
  });
  
  
  $('body').on('click', '.dual-list-move-right', function (e) {
      e.preventDefault();

      var actives = $(this).parent();
      $(this).parent().find("span").remove();
      $(move_left).clone().appendTo(actives);
      actives.clone().appendTo('.list-right ul').removeClass("active");
      actives.remove();
      sortUnorderedList("dual-list-right");
      
      update_plot();

      
      updateSelectedOptions();
  });
  
  
  $('body').on('click', '.dual-list-move-left', function (e) {
      e.preventDefault();

      var actives = $(this).parent();
      $(this).parent().find("span").remove();
      $(move_right).clone().appendTo(actives);
      actives.clone().appendTo('.list-left ul').removeClass("active");
      actives.remove();


      update_plot();

      updateSelectedOptions();
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

