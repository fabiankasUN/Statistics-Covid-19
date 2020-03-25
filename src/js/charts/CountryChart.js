import { GenericChart, InfoChart, OptionsChart } from "./GenericChart";

export class CountryChart extends GenericChart{

    constructor( countries, country ){
        super( countries );
        this.country = country;
        this.start_day = this.getMinValueGreater( );
    }



    getYaxis( ){
        var y_axis = [[],[]];
          for( var j =this.start_day; j < this.country.cases.length; j++ ){
              y_axis[0].push(this.country.cases[j].value); 
              y_axis[1].push(this.country.deaths[j].value); 
              //y_axis[2].push(this.country.recovered[j].value); 
          }
          return y_axis;
    }
    
    getData( type, x_label, y_label, size, header ){

        var x_axis = [];
        var y_axis = [];
        var labels = [];

        var x_axis = this.getXaxis();
        var y_axis = this.getYaxis();
        var labels = ['Casos activos','Muertes'];


        return new InfoChart( x_axis, y_axis, labels, type, new OptionsChart(x_label, y_label, size, header))
        //return [x_axis, y_axis, labels, type];
    }

}