import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { SocketProvider } from './providers/SocketProvider';
import { ThemeProvider } from './providers/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

