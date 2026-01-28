import { Routes, Route } from 'react-router-dom';
import EliteModule from '@/pages/EliteModule';

function App() {
    return (
        <Routes>
            <Route path="/" element={<EliteModule />} />
            <Route path="*" element={<EliteModule />} />
        </Routes>
    );
}

export default App;
