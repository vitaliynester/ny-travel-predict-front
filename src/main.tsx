import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App.tsx'
import {YMaps} from "@pbe/react-yandex-maps";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <YMaps>
          <App />
      </YMaps>
  </React.StrictMode>,
)
