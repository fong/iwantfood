// import { MenuItem, TextField } from '@material-ui/core';
import MapboxCircle from 'mapbox-gl-circle';
import * as mapboxgl from 'mapbox-gl';
import * as React from 'react';
import './App.css';

Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set('pk.eyJ1IjoiZm9uZ2UiLCJhIjoiY2prZ2l0Ynh3MGpuZzNxb2E0ajlieTRuNiJ9.C08CmyiuDI7ghzetVakgCA');

// (mapboxgl as any).accessToken = "pk.eyJ1IjoiZm9uZ2UiLCJhIjoiY2prZ2l0Ynh3MGpuZzNxb2E0ajlieTRuNiJ9.C08CmyiuDI7ghzetVakgCA";

export default class App extends React.Component<{}> {

  public state = {
    area: false,
    currentLatLng: {
      lat: 0,
      lng: 0
    },
    distance: 1,
    nearby: false,
    restaurant: null
  }

  public nextState: any = {
    area: false,
    currentLatLng: {
      lat: 0,
      lng: 0
    },
    distance: 1,
    nearby: false,
    restaurant: null,
  };

  public lat = 0;
  public lng = 0;
  public zoom = 1.5;
  public mapBox: any = null;
  public map: any;
  public circle: any;

  mapToggle: boolean = false;
  mapContainer: HTMLDivElement;

/*   public mapContainer: any;
 */
  constructor(props: any){
    super(props)
    // this.showCurrentLocation()
    this.nearbySelect = this.nearbySelect.bind(this);
    this.areaSelect = this.areaSelect.bind(this);
    this.showCurrentLocation();
    //this.getSearch();
    //this.onChange();
    }

  public onChange = () => {
    this.setState(this.nextState); // dumb easy: triggers render
    console.log("onChange");
  }

  public showCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.nextState = JSON.parse(JSON.stringify(this.nextState));
          this.nextState.currentLatLng.lat = position.coords.latitude;
          this.nextState.currentLatLng.lng = position.coords.longitude;
          this.setState(this.nextState);
        }
      )
    }
  }

  public showMap = () => {
    // const nextState = this.nextState;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.lat =  position.coords.latitude;
          this.lng = position.coords.longitude;

          this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v10',
            center: [this.lng, this.lat],
            zoom: 12
          });

          this.circle = new MapboxCircle({lat: this.lat, lng: this.lng}, this.nextState.distance, {
            fillColor: '#29AB87'
          }).addTo(this.map);
      
          this.map.on('move', () => {
            this.nextState = JSON.parse(JSON.stringify(this.nextState));
            this.nextState.currentLatLng.lat = this.map.getCenter().lat;
            this.nextState.currentLatLng.lng = this.map.getCenter().lng;

            this.setState(this.nextState);
            console.log(this.nextState);
            this.circle.setCenter(this.map.getCenter());
          });

          this.map.on('dragend', () => {
            this.getSearch(this.nextState.currentLatLng.lat, this.nextState.currentLatLng.lng, this.nextState.distance); 
          });
        }
        ,function error(msg){alert('Please enable your GPS position future.');  
        }, {maximumAge:600000, timeout:5000, enableHighAccuracy: true});
    }
  }

  public nearbySelect(){
    console.log("this.nearbySelect");
    this.nextState = JSON.parse(JSON.stringify(this.nextState));
    if (this.nextState.area === true){
      this.nextState.nearby = true;
      this.nextState.area = false;
    } else {
      if (this.nextState.nearby === true){
        this.nextState.nearby = false;
        this.nextState.area = false;
      } else {
        this.nextState.nearby = true;
        this.nextState.area = false;
      }
    }
    this.setState(this.nextState); 
  }

  public areaSelect(){
    this.nextState = JSON.parse(JSON.stringify(this.nextState));
    this.showMap();
    if (this.nextState.nearby === true){
      this.nextState.area = true;
      this.nextState.nearby = false;
    } else {
      if (this.nextState.area === true){
        this.nextState.area = false;
        this.nextState.nearby = false;
      } else {
        this.nextState.area = true;
        this.nextState.nearby = false;
      }
    }
    this.setState(this.nextState);
  }

  public distanceSelect(distance: number){
    this.nextState = JSON.parse(JSON.stringify(this.nextState));
    this.nextState.distance = distance;

    if (this.circle){
      this.circle.setRadius(distance);
    }
    this.getSearch(this.nextState.currentLatLng.lat, this.nextState.currentLatLng.lng, this.nextState.distance);
    this.setState(this.nextState);
  }

  public getSearch(lat1, lng1, radius) {

    let header = new Headers();
    header.append('Accept', 'application/json');
    header.append('user-key', '94a1cc7a801233acc372942240f48ef5');

    let init = {
        method: 'GET',
        headers: header
      }

    fetch(new Request('https://developers.zomato.com/api/v2.1/search?lat=' + lat1 + '&lon=' + lng1 + '&radius=' + radius + '&sort=real_distance&order=desc'), init)
    .then((response : any) => {
      if (!response.ok) {
        //this.setState({results: response.statusText})
      }
      else {
        response.json().then((resp:any) => {

          let searching = true;
          let valid = false;
          let count = 0;
                    
          while (searching){
            let x = Math.floor(Math.random() * Math.floor(20));
            let lat2 = (resp.restaurants[x].restaurant.location.latitude);
            let lng2 = (resp.restaurants[x].restaurant.location.longitude);
            if (latlngToDistance(lat1, lng1, lat2, lng2) <= radius){
              searching = false;
              valid = true;
              this.nextState = JSON.parse(JSON.stringify(this.nextState));
              this.nextState.restaurant = resp.restaurants[x].restaurant;
              console.log(this.nextState.restaurant);
              this.setState(this.nextState);
            }
            if (count == 40){
              searching = false;
              valid = false;
            }
            count++;
          }
          this.setState(this.nextState);
        });
      }
      return response;
    })
  }

  public render() {
    let distance;
    let e;

    if (this.nextState.nearby || this.nextState.area){
      distance = <div>
                  <span className="mediumtext">I want it to be </span>
                  
                  {this.nextState.distance === 500 ? (
                    <span>
                      <span className="picked" onClick={this.distanceSelect.bind(this, 500)}>really <sub style={{fontSize: "0.5em"}}> (500m)</sub></span>
                    </span>
                    ) : (
                    <span>
                      <span className="notpicked" onClick={this.distanceSelect.bind(this, 500)}>really <sub style={{fontSize: "0.5em"}}> (500m)</sub></span>
                    </span>)}

                  <span className="mediumtext"> / </span>

                   {this.nextState.distance === 750 ? (
                    <span>
                      <span className="picked" onClick={this.distanceSelect.bind(this, 750)}>pretty <sub style={{fontSize: "0.5em"}}> (750m)</sub></span>
                    </span>
                    ) : (
                    <span>
                      <span className="notpicked" onClick={this.distanceSelect.bind(this, 750)}>pretty <sub style={{fontSize: "0.5em"}}> (750m)</sub></span>
                    </span>)}

                  <span className="mediumtext"> / </span>
                  
                  {this.nextState.distance === 1000 ? (
                    <span>
                      <span className="picked" onClick={this.distanceSelect.bind(this, 1000)}>kinda <sub style={{fontSize: "0.5em"}}> (1km)</sub></span>
                    </span>
                    ) : (
                    <span>
                      <span className="notpicked" onClick={this.distanceSelect.bind(this, 1000)}>kinda  <sub style={{fontSize: "0.5em"}}> (1km)</sub></span>
                    </span>)}

                  <span className="mediumtext"> / </span>
                  
                  {this.nextState.distance === 2000 ? (
                    <span>
                      <span className="picked" onClick={this.distanceSelect.bind(this, 2000)}>somewhat  <sub style={{fontSize: "0.5em"}}> (2km)</sub></span>
                    </span>
                    ) : (
                    <span>
                      <span className="notpicked" onClick={this.distanceSelect.bind(this, 2000)}>somewhat  <sub style={{fontSize: "0.5em"}}> (2km)</sub></span>
                    </span>)}

                  <span className="mediumtext"> / </span>
                  
                  {this.nextState.distance === 5000 ? (
                    <span>
                      <span className="picked" onClick={this.distanceSelect.bind(this, 5000)}>not even  <sub style={{fontSize: "0.5em"}}> (5km)</sub></span>
                    </span>
                    ) : (
                    <span>
                      <span className="notpicked" onClick={this.distanceSelect.bind(this, 5000)}>not even  <sub style={{fontSize: "0.5em"}}> (5km)</sub></span>
                    </span>)}

                  <span className="mediumtext"> close.</span>
                </div>;
    }

    if (this.nextState.area){
      this.mapBox = <div className="mapBox">
        <div ref={el => this.mapContainer = el} className="map left right" style={{position: 'relative', width: "85%", height: "360px"}}/>
      </div>
    } else {
      console.log('else');
      this.mapBox = <div className="mapBox" style={{display: 'hidden'}}>
        <div ref={el => this.mapContainer = el} className="map left right" style={{display: 'hidden', position: 'relative', width: "0", height: "0"}}/>
      </div>
    }

    return (
      <div className="container">
        <div style={{textAlign: "center"}}>
          <div className="largetext">I really want food. </div>
          <br/><br/>
          {/* <span className="mediumtext">I want to eat </span>
          {e} */}
          <br/><br/>
          <div className="mediumtext">I want go somewhere </div>

          {this.nextState.nearby ? (
            <span>
              <span className="picked" onClick={this.nearbySelect}>nearby</span>
            </span>
            ) : (
            <span>
              <span className="notpicked" onClick={this.nearbySelect}>nearby</span>
            </span>)}

          <span className="mediumtext"> / </span>
          
          {this.nextState.area ? (
            <span>
              <span className="picked" onClick={this.areaSelect}>in another area</span>
            </span>
            ) : (
            <span>
              <span className="notpicked" onClick={this.areaSelect}>in another area</span>
            </span>)}

          <span className="mediumtext">.</span><br/><br/>
        </div>

        <div style={{textAlign: "center"}}>
          {distance}
        </div>

        <br/><br/>


        {this.mapBox}

      <div style={{textAlign: "center", marginTop: "1em"}}>
        {this.nextState.restaurant ? (
            <div>
              <div className="name" onClick={this.areaSelect}>{this.nextState.restaurant.name}</div>
              <div className="cuisine">{this.nextState.restaurant.cuisines}</div>
            </div>) : (<span></span>)}
      </div>
    </div>
    );
  }
}

// function toObject(arr) {
//   var rv = {};
//   for (var i = 0; i < arr.length; ++i)
//     if (arr[i] !== undefined) rv[i] = arr[i];
//   return rv;
// }

function latlngToDistance(lat1, lng1, lat2, lng2){
  let R = 6371e3; // metres
  let φ1 = toRadians(lat1);
  let φ2 = toRadians(lat2);
  let Δφ = toRadians(lat2-lat1);
  let Δλ = toRadians(lng2-lng1);

  let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
          let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  //var d = R * c;
  return R * c;
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}