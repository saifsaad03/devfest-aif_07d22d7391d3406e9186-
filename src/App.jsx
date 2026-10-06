import BuilderPage from './pages/BuilderPage.jsx';
import Toast from './components/common/Toast.jsx';
import { usePersistence } from './hooks/usePersistence.js';

export default function App() {
  usePersistence();
  return (
    <>
      <BuilderPage />
      <Toast />
    </>
  );
}
