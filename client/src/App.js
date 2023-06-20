
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Signin from './pages/Signin/Signin';
import Signup from './pages/signup/signup';
import Navbar1 from './components/NavigationBar';
import Dashboard from './pages/Dashboard/Dashboard'
import NotFound from './components/NotFound/NotFound'
import Products from './pages/Products/Products'
import Users from './pages/Users/Users';
import Home from './pages/Home/Index';
import StockForm from './pages/Purchases';
import PurchaseList from './pages/Purchases/purchaseList';
import AddSupplier from './pages/Suppliers/AddSupplier';
import SupplierList from './pages/Suppliers/index';
import Pos from './pages/pos/index';
import Sales from './pages/Sales';
import DailySalesSummary from './pages/Sales/dailySummary';
function App() {
  return (
    <div className="App">
      <Navbar1 />
      <Routes>
            <Route path='*' element={<NotFound/>} />
            <Route path ='/' element={<Home />} />
            <Route  path='/dashboard' element={<Dashboard/>} />
            <Route path='/products' element={<Products/>} />
            <Route  path='/users' element={<Users/>} />
            <Route path='/login' element={<Signin/>}  />
            <Route path='/register' element={<Signup/>} />
            <Route path='/purchases' element={<PurchaseList/>} />
            <Route path='/purchases/add' element={<StockForm/>} />
            <Route path='/supplier/add' element={<AddSupplier/>} />
            <Route path='/suppliers' element={<SupplierList/>} />
            <Route path='/pos' element={<Pos/>} />
            <Route path='/sales' element={<Sales/>} />
            <Route path ='/dailysales' element={<DailySalesSummary/>} />

        </Routes>
    </div>
  );
}
export default App;
