
export class OptionsChart{

    constructor( x_label, y_label, size, header){
        this.x_label = x_label;
        this.y_label = y_label;
        this.size = size;
        this.header = header;
    }
}

export class InfoChart{

    constructor( x_axis, y_axis, labels, type, options ){
        this.x_axis = x_axis;
        this.y_axis = y_axis;
        this.labels = labels;
        this.type = type;
        this.options = options;
    }
} 



export class GenericChart{

    constructor( countries ){
        this.countries = countries;
        this.start_day = this.getMinValueGreater( );
    }

    getMinValueGreater( ){
        var init = 100000;
        for( var i =0; i < this.countries.length; i++ ){
          let country = this.countries[i];
          for( var j =0; j < country.cases.length; j++ ){
            if(country.cases[j].value > 0){
              init = Math.min(init, j);
            }
          }
        }
        return init;
    }

    getXaxis( ){
        var x_axis = [];
        for( var i =this.start_day; i < this.countries[0].cases.length; i++ ){
            x_axis.push( this.countries[0].cases[i].date.getDate() + '/' + (this.countries[0].cases[i].date.getMonth()+1) );
        }
        return x_axis;
    }

    getYaxis( country ){
        var y = [];
          for( var j =this.start_day; j < country.cases.length; j++ ){
              y.push(country.cases[j].value); 
          }
          return y;
    }

    getData( type, x_label, y_label, size, header ){
  
        var x_axis = [];
        var y_axis = [];
        var labels = [];
      
        var x_axis = this.getXaxis();

        for( var i =0; i < this.countries.length; i++ ){
          let country = this.countries[i];
          labels.push(country.name + ' ' + country.province);
          var y = this.getYaxis( country );
          y_axis.push(y);
        }

        return new InfoChart(x_axis, y_axis, labels, type, new OptionsChart(x_label, y_label, size, header))

        //return [x_axis, y_axis, labels, type];
      }
    
} 
