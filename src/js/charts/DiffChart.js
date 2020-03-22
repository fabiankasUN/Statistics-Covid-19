import { GenericChart, InfoChart, OptionsChart } from "./GenericChart";

export class DiffChart extends GenericChart{

    constructor( countries ){
        super( countries );
        this.start_day = this.getMinValueGreater( );
    }



    getYaxis( country ){
        var y = [];
        var last = 0;
        for( var j =this.start_day; j < country.cases.length; j++ ){
            var diff = country.cases[j].value - last; 
            var p = diff * 100.0/country.cases[j].value;
            last =  country.cases[j].value;
            if( this.start_day != j){
                y.push(p); 
            }else{
                y.push(0); 
            }
        }
        return y;
    }

    getData( type, x_label, y_label, size, header ){

        var x_axis = [];
        var y_axis = [];
        var labels = [];

        x_axis = this.getXaxis();

        for( var i =0; i < this.countries.length; i++ ){
            let country = this.countries[i];
            labels.push(country.name + ' ' + country.province);
            var y = this.getYaxis( country );
            y_axis.push(y);
          }



        return new InfoChart( x_axis, y_axis, labels, type, new OptionsChart(x_label, y_label, size, header))
        //return [x_axis, y_axis, labels, type];
    }

}