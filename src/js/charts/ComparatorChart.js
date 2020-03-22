import { GenericChart, InfoChart, OptionsChart } from "./GenericChart";

export class ComparatorChart extends GenericChart{

    constructor( countries ){
        super( countries );
        
    }


    getFirstDay( country ){
        for( var i=0; i < country.cases.length; i++ ){
            if( country.cases[i].value > 50 )
                return i;
        }
        return 0 ;
    }

    getXaxis( first_case ){
        var x_axis = [];
        var k = 0;
        for( var i =first_case; i < this.countries[0].cases.length; i++ ){
            x_axis.push( k++ );
        }
        return x_axis;
    }

    getYaxis( country, first_case, total_days ){
        var y = [];
         console.log(first_case);
          for( var j =first_case; j < first_case + total_days; j++ ){
              y.push(country.cases[j].value); 
          }
          return y;
    }


    getData( type, x_label, y_label, size, header ){

        var x_axis = [];
        var y_axis = [];
        var labels = [];

        var days = 10000;
        var index = 0;
        for( var i =0; i < this.countries.length; i++ ){
            var firstCase = this.getFirstDay(this.countries[i]);
            var diff = this.countries[i].cases.length - firstCase;
            if( diff < days ){
                days = diff;
                index = firstCase;
            }
        }

        x_axis = this.getXaxis(index);

        

        for( var i =0; i < this.countries.length; i++ ){
            let country = this.countries[i];
            var firstCase = this.getFirstDay(this.countries[i]);
            labels.push(country.name + ' ' + country.province);
            var y = this.getYaxis( country, firstCase, days );
            y_axis.push(y);
          }
        return new InfoChart( x_axis, y_axis, labels, type, new OptionsChart(x_label, y_label, size, header ))
        //return [x_axis, y_axis, labels, type];
    }

}