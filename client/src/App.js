
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Signin from './pages/Signin/Signin';
import Signup from './pages/signup/signup';
import Navbar1 from './components/NavigationBar';
import Dashboard from './pages/Dashboard/Dashboard'
import NotFound from './components/NotFound/NotFound'
import Products from './pages/Products/Products'
import Home from './pages/Home/Index'
function App() {
 
  return (
    <div className="App">
      <Navbar1 />
      <Routes>
            <Route path='*' element={<NotFound/>} />
            <Route path ='/' element={<Home />} />
            <Route  path='/dashboard' element={<Dashboard/>} />
            <Route path='/products' element={<Products/>} />
            <Route path='/login' element={<Signin/>}  />
            <Route path='/register' element={<Signup/>} />

        </Routes>
    </div>
  );
}

export default App;
