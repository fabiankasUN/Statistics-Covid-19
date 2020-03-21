
import { Country } from './Country.js';


export class Plot{

    constructor(data){
        this.countries = [];
        this.load_countries(data);
        this.countries.sort(this.compare);
    }


    compare( a, b ) {
        if ( a.name < b.name ){
          return -1;
        }
        if ( a.name > b.name ){
          return 1;
        }
        return 0;
      }

    load_countries(data){
        data.forEach(element => {
            var c = new Country(element['Country/Region'],element['Province/State'], element['Lat'], element['Long'] );
        
            var dates = Object.keys(element).slice(4, element.length);
            var values = Object.values(element).slice(4, element.length);
        
            for( var i =0; i < dates.length; i++ )
                c.addCase(new Date(dates[i]), values[i]);
            this.countries.push(c);
          });

    }

}