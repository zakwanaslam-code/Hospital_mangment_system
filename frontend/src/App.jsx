import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1E293B', color: '#F8FAFC', border: '1px solid #334155' },
      }} />
    </>
  );
}

export default App;