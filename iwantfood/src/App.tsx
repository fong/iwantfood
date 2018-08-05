// import { MenuItem, TextField } from '@material-ui/core';
import * as React from 'react';
import './App.css';

export default class App extends React.Component<{}> {

  public state = {
    area: false,
    currentLatLng: {
      lat: 0,
      lng: 0
    },
    distance: 50,
    nearby: false,
  }

  constructor(props: any){
    super(props)
    // this.showCurrentLocation()
    this.nearbySelect = this.nearbySelect.bind(this);
    this.areaSelect = this.areaSelect.bind(this);
    }

  public onChange = () => {
    this.setState(this.state) // dumb easy: triggers render
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

  public nearbySelect(){
    const prevState = JSON.parse(JSON.stringify(this.state));
    if (prevState.area === true){
      prevState.nearby = true;
      prevState.area = false;
    } else {
      if (prevState.nearby === true){
        prevState.nearby = false;
        prevState.area = false;
      } else {
        prevState.nearby = true;
        prevState.area = false;
        this.showCurrentLocation();
      }
    }
    this.setState(prevState); 
  }

  public areaSelect(){
    const prevState = JSON.parse(JSON.stringify(this.state));
    if (prevState.nearby === true){
      prevState.area = true;
      prevState.nearby = false;
    } else {
      if (prevState.area === true){
        prevState.area = false;
        prevState.nearby = false;
      } else {
        prevState.area = true;
        prevState.nearby = false;
      }
    }
    this.setState(prevState);
  }

  public distanceSelect(distance: number){
    let prevState = JSON.parse(JSON.stringify(this.state.distance));
    prevState = distance;

    this.setState({
      distance: prevState 
    }); 
  }

  public render() {
    return (
      <div className="container">
        <span className="largetext">I really want food. </span>
        <br/><br/><br/><br/>
        <span className="mediumtext">I want go somewhere </span>

        {this.state.nearby ? (
          <span>
            <span className="selected" onClick={this.nearbySelect}>nearby</span>
          </span>
          ) : (
          <span>
            <span className="select" onClick={this.nearbySelect}>nearby</span>
          </span>)}

        <span className="mediumtext"> / </span>
        
        {this.state.area ? (
          <span>
            <span className="selected" onClick={this.areaSelect}>in another area</span>
          </span>
          ) : (
          <span>
            <span className="select" onClick={this.areaSelect}>in another area</span>
          </span>)}

        <span className="mediumtext">.</span><br/><br/>

         {this.state.nearby ? (
          <div>
            <span className="mediumtext">I want it to be </span>
            
            {this.state.distance === 500 ? (
              <span>
                <span className="selected" onClick={this.distanceSelect.bind(this, 500)}>pretty <sub style={{fontSize: "0.5em"}}> (500m)</sub></span>
              </span>
              ) : (
              <span>
                <span className="select" onClick={this.distanceSelect.bind(this, 500)}>pretty <sub style={{fontSize: "0.5em"}}> (500m)</sub></span>
              </span>)}

            <span className="mediumtext"> / </span>
            
            {this.state.distance === 1000 ? (
              <span>
                <span className="selected" onClick={this.distanceSelect.bind(this, 1000)}>kinda <sub style={{fontSize: "0.5em"}}> (1km)</sub></span>
              </span>
              ) : (
              <span>
                <span className="select" onClick={this.distanceSelect.bind(this, 1000)}>kinda  <sub style={{fontSize: "0.5em"}}> (1km)</sub></span>
              </span>)}

            <span className="mediumtext"> / </span>
            
            {this.state.distance === 2000 ? (
              <span>
                <span className="selected" onClick={this.distanceSelect.bind(this, 2000)}>somewhat  <sub style={{fontSize: "0.5em"}}> (2km)</sub></span>
              </span>
              ) : (
              <span>
                <span className="select" onClick={this.distanceSelect.bind(this, 2000)}>somewhat  <sub style={{fontSize: "0.5em"}}> (2km)</sub></span>
              </span>)}

            <span className="mediumtext"> / </span>
            
            {this.state.distance === 5000 ? (
              <span>
                <span className="selected" onClick={this.distanceSelect.bind(this, 5000)}>not even  <sub style={{fontSize: "0.5em"}}> (5km)</sub></span>
              </span>
              ) : (
              <span>
                <span className="select" onClick={this.distanceSelect.bind(this, 5000)}>not even  <sub style={{fontSize: "0.5em"}}> (5km)</sub></span>
              </span>)}

            <span className="mediumtext"> close.</span>
          </div>
         ):(<div>Nope</div>)}

        <p>
          currentLat={this.state.currentLatLng.lat}<br/>
          currentLng={this.state.currentLatLng.lng}
        </p>
      </div>
    );
  }
}