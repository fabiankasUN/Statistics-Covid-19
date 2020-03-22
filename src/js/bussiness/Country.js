export class Country {

    constructor( name, province, lat, lon) {
      this.name = name;
      this.province = province;
      this.lat = lat;
      this.lon = lon;
      this.cases = [];
      this.deaths = [];
      this.recovered = [];
    };

    add_case( date, value ){
        this.cases.push(new Case(date, value));
    }

    add_death( date, value){
        this.deaths.push(new Case(date, value));
    }

    add_recovered( date, value){
        this.recovered.push(new Case(date, value));
    } 
}

export class Case{

    constructor( date, value ){
        this.date = date;
        this.value = value;
    }

}