import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient.js';
import { ClerkProvider } from '@clerk/clerk-react';

import './styles/index.css'
import App from './App.jsx'

const clerkPubKey = 'pk_test_cHJlc2VudC1wb3Jwb2lzZS05NS5jbGVyay5hY2NvdW50cy5kZXYk';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApolloProvider>
    </ClerkProvider>
  </React.StrictMode>
)