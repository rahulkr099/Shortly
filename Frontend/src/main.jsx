import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'react-toastify/ReactToastify.css';
import {Provider} from 'react-redux';
import {store} from '../src/containers/store'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
   <Provider store = {store}>
   <App />
   </Provider>
  </StrictMode>
  </BrowserRouter>
  
)
