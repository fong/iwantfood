// import { MenuItem, TextField } from '@material-ui/core';
import MapboxCircle from 'mapbox-gl-circle';
import * as mapboxgl from 'mapbox-gl';
import * as React from 'react';
import './App.css';

Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set('pk.eyJ1IjoiZm9uZ2UiLCJhIjoiY2prZ2l0Ynh3MGpuZzNxb2E0ajlieTRuNiJ9.C08CmyiuDI7ghzetVakgCA');

// (mapboxgl as any).accessToken = "pk.eyJ1IjoiZm9uZ2UiLCJhIjoiY2prZ2l0Ynh3MGpuZzNxb2E0ajlieTRuNiJ9.C08CmyiuDI7ghzetVakgCA";

export default class App extends React.Component<{}> {

/*   public nextState = {
    area: false,
    currentLatLng: {
      lat: 0,
      lng: 0
    },
    distance: 50,
    nearby: false,
  } */

  public nextState: any = {
    area: false,
    currentLatLng: {
      lat: 0,
      lng: 0
    },
    distance: 50,
    nearby: false,
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
    }

  public onChange = () => {
    this.setState(this.nextState) // dumb easy: triggers render
    console.log();
  }

  public showCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({
            area: false,
            currentLatLng: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            distance: 50,
            nearby: true
          });
        }
      )
    }
  }

  public showMap = () => {
    const nextState = this.nextState;

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
          this.nextState.lat = this.map.getCenter().lat;
          this.nextState.lng = this.map.getCenter().lng;

          this.setState(this.nextState);
          this.circle.setCenter(this.map.getCenter());
        });
      }
    );
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
        this.showMap();
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

    this.setState(this.nextState); 
  }

  public render() {
    let distance;

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
          <span className="largetext">I really want food. </span>
          <br/><br/>
          <span className="mediumtext">I want go somewhere </span>

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

        <p>
          currentLat={this.nextState.currentLatLng.lat}<br/>
          currentLng={this.nextState.currentLatLng.lng}
        </p>
      </div>
    );
  }
}