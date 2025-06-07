import NavBar from '@components/NavBar';

import './App.css';
import LayoutUser from '@components/Layout/User';

function App() {
  return (
    <LayoutUser>
      <NavBar />
      <h1 className="text-3xl font-light text-blue-500">Hello Tailwind</h1>
    </LayoutUser>
  );
}

export default App;
