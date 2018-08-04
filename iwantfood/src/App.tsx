import * as React from 'react';
import './App.css';

export default class App extends React.Component<{}> {
  /* public render() {
    return (
      <div className="container-fluid">
      <div className="centreText">
        { }
        <h2>I really want food.</h2>
        <p>{this.props.coords.latitude}</p>
        <p>{this.props.coords.longitude}</p>
      </div>
    </div>
    );
  } */

  public state = {
    currentLatLng: {
      lat: 0,
      lng: 0
    }
  }

  constructor(props: any){
    super(props)
    // this.showCurrentLocation()

    }

  public onChange = () => {
    this.setState(this.state) // dumb easy: triggers render
  }

  public showCurrentLocation = () => {
    console.log("showCurrentLocation");
    if (navigator.geolocation) {
      console.log("OK");
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({
            currentLatLng: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          });
          console.log(this.state);
        }
      )
    } else {
      console.log("Not OK");
      this.setState({
        currentLatLng: {
          lat: 0,
          lng: 0
        }
      });
    }
    console.log("SetState");
    this.forceUpdate();
  }


  public componentDidMount() {
    this.showCurrentLocation()
  }

  public render() {
    return (
      <div>
        <button onClick={this.showCurrentLocation}>Get My Location
        </button>
        <p>
          currentLat={this.state.currentLatLng.lat}<br/>
          currentLng={this.state.currentLatLng.lng}
        </p>
      </div>
    );
  }
}
