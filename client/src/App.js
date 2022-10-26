import './App.css';
import {BrowserRouter, Route} from 'react-router-dom' 
import Home from './components/Home'
//import Nav from './components/Nav'
import LandingPage from './components/LandingPage'
import CountryDetail from './components/CountryDetail';
//import { Link } from 'react-router-dom';
import CreateActivity from './components/CreateActivity';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Route exact path='/' component={LandingPage}/>
      <Route exact path='/home' component={Home}/>
      <Route path='/activity' component={CreateActivity}/>
      <Route path='/home/:countryId' component={CountryDetail}/>
    </div>
    </BrowserRouter>
  );
}

export default App;
