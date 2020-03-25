
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

    getMinValueGreater( value_type = 'cases' ){
        var init = 100000;
        for( var i =0; i < this.countries.length; i++ ){
          let country = this.countries[i];
          for( var j =0; j < country.cases.length; j++ ){
            var value = 0;
            if(value_type === 'cases') value = country.cases[j].value
            if(value_type === 'deaths') value = country.deaths[j].value
            if(value_type === 'recovered') value = country.recovered[j].value
              
            if(value > 0){
                init = Math.min(init, j);
            }
              
          }
        }
        return init;
    }

    getXaxis( value_type = 'cases' ){
        var x_axis = [];
        for( var i =this.start_day; i < this.countries[0].cases.length; i++ ){
            var value = 0;
            if(value_type === 'cases') value = this.countries[0].cases[i].date
            if(value_type === 'deaths') value = this.countries[0].deaths[i].date
            if(value_type === 'recovered') value = this.countries[0].recovered[i].date
            x_axis.push( value.getDate() + '/' + (value.getMonth()+1) );
        }
        return x_axis;
    }

    getYaxis( country, value_type = 'cases' ){
        var y = [];
          for( var j =this.start_day; j < country.cases.length; j++ ){
              if( value_type === 'cases' )
                y.push(country.cases[j].value); 
              if( value_type === 'deaths' )
                y.push(country.deaths[j].value); 
              if( value_type === 'recovered' )
                y.push(country.recovered[j].value); 
          }
          return y;
    }

    getData( type, x_label, y_label, size, header, value_type ){
  
        var x_axis = [];
        var y_axis = [];
        var labels = [];

        this.start_day = this.getMinValueGreater( value_type );
        var x_axis = this.getXaxis( value_type );
      
        for( var i =0; i < this.countries.length; i++ ){
          let country = this.countries[i];
          labels.push(country.name + ' ' + country.province);
          var y = this.getYaxis( country, value_type );
          y_axis.push(y);
        }

        return new InfoChart(x_axis, y_axis, labels, type, new OptionsChart(x_label, y_label, size, header))

        //return [x_axis, y_axis, labels, type];
      }
    
} 
