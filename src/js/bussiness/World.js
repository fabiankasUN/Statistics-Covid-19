
import { Country } from './Country.js';


export class World{

    constructor(confirmed, deaths, recovered, json_countries){
        this.countries = [];
        this.map_countries = {};
        this.map_countries_s = {};
        this.hot_map = null;

        this.load_countries(confirmed, deaths, recovered);
        this.countries.sort(this.compare);
        this.hot_map = this.load_json_data(json_countries);
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


    load_json_data( json ){

      this.map_countries['United States'] = this.map_countries['US'];
      this.map_countries['Venezuela, RB'] = this.map_countries['Venezuela'];
      this.map_countries['Hong Kong SAR, China'] = this.map_countries['China'];
      this.map_countries['Iran, Islamic Rep.'] = this.map_countries['Iran'];
      this.map_countries['Egypt, Arab Rep.'] = this.map_countries['Egypt'];
      this.map_countries['Russian Federation'] = this.map_countries['Russia'];

      

      for( var i= 0; i < json.length; i++ ){
        var cur = json[i];
        if( this.map_countries[cur.name] != undefined ){
          cur.value = this.map_countries[cur.name];
          json[i] = cur;
        }else {
          if( this.map_countries_s[cur.name] != undefined ){
            cur.value = this.map_countries_s[cur.name];
            json[i] = cur;
          }else{
            cur.value = 1;
            json[i] = cur;
            console.log(cur.name);
          }
        }
      }
      return json;
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

          if( this.map_countries[c.name] == undefined )
            this.map_countries[c.name] = 0
          this.map_countries[c.name] += +c.cases[c.cases.length-1].value;
          this.map_countries_s[c.province] = c.cases[c.cases.length-1].value;
          this.countries.push(c);



        }

    }

}