export class Country {

    constructor( name, province, lat, lon) {
      this.name = name;
      this.province = province;
      this.lat = lat;
      this.lon = lon;
      this.cases = [];
    };

    addCase( date, value ){
        this.cases.push(new Case(date, value));
    }
}

export class Case{

    constructor( date, value ){
        this.date = date;
        this.value = value;
    }

}