import './App.css';
import { BrowserRouter, Route, Switch, NavLink } from 'react-router-dom'

// pages
import Home from './pages/Home'
import Contact from './pages/Contact'
import About from './pages/About'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav>
          <h1>My Articles</h1>
          {/* NavLink auto-apply an active class to currently active link */}
          <NavLink exact to="/">home</NavLink>
          <NavLink exact to="/about">about</NavLink>
          <NavLink exact to="/contact">contact</NavLink>
        </nav>

        <Switch>
          <Route exact path="/"><Home/></Route>
          <Route exact path="/about"><About/></Route>
          <Route exact path="/contact"><Contact/></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
