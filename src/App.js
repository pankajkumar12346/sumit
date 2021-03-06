import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register';
import Clarifai from 'clarifai';
import './App.css';
import { connect } from 'react-redux';
import { imageInput } from './redux/actions';

const mapStateToProps = state => {
  return {
    input: state.imageSearch.input,
    //box: state.FaceBox.box
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onInput: event => dispatch(imageInput(event.target.value)),
    //onBox: () => dispatch(faceDetectionBox())
  };
}


const app = new Clarifai.App({
  apiKey: 'd5c6649c9cdf4c6dae8c4206b0ed0d7d'
 });

const particlesOptions = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  
  constructor() {
    super();
    this.state = {
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  } 

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('displayImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    };
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onButtonSubmit = () => {
    const { input } = this.props
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        input)
      .then(response => {
        if (response) {
          fetch('https://v3i12.sse.codesandbox.io/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
              })
            
        } 
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(err => console.log(err))
  }
    
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, route, box } = this.state
    const {onInput, input} = this.props
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' 
          ? <div> 
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm onInputChange={onInput} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={box} imageUrl={input} />
            </div>
          : (
            route === 'signin'
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);