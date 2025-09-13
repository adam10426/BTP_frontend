import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaseLayout from '../layout/BaseLayout';
import Dashboard from '../pages/Dashboard';

const NotFound = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
  </div>
);

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<BaseLayout/>}>
          <Route index element={<Dashboard/>}/>
        </Route>
      </Routes>
    </Router>
  )
}


export default AppRouter

