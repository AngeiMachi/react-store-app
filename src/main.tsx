import  { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route ,Navigate} from 'react-router-dom'; 
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes> 
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products/" element={<App />} /> 
        <Route path="/products/:id" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
