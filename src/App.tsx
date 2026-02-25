import { Route, Routes } from 'react-router-dom';
import { DesktopShell } from './components/DesktopShell';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<DesktopShell />} />
      <Route path="*" element={<DesktopShell />} />
    </Routes>
  );
}
