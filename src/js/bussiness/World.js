
import { Country } from './Country.js';


export class World{

    constructor(confirmed, deaths, recovered){
        this.countries = [];
        this.load_countries(confirmed, deaths, recovered);
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

    load_countries(confirmed, deaths, recovered){

        for( var i =0; i < confirmed.length; i++ ){
          var conf = confirmed[i];
          var death = deaths[i];
          var recov = recovered[i];

          var dates = Object.keys(conf).slice(4, conf.length);
          var c = new Country(conf['Country/Region'],conf['Province/State'], conf['Lat'], conf['Long'] );
          
          var conf_values = Object.values(conf).slice(4, conf.length);
          var death_values = Object.values(death).slice(4, death.length);
          var recov_values = Object.values(recov).slice(4, recov.length);

          for( var j =0; j < conf_values.length; j++ ){
              c.add_case(new Date(dates[j]), conf_values[j]);
              c.add_death(new Date(dates[j]), death_values[j]);
              c.add_recovered(new Date(dates[j]), recov_values[j]);
          }
            this.countries.push(c);
        }

    }

}