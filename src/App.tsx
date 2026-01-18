import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Modules from '@/pages/Modules';
import EliteModule from '@/pages/EliteModule';
import StandardModule from '@/pages/StandardModule';
import AdminPanel from '@/pages/AdminPanel';
import Profile from '@/pages/Profile';
import ProtectedRoute from '@/components/layout/ProtectedRoute'; // Will create this next

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Landing />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="modules" element={<Modules />} />
                <Route path="standard" element={<StandardModule />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="dashboard" element={<Modules />} />
                    <Route path="profile" element={<Profile />} />
                </Route>

                {/* VIP / VUP Specific Routes */}
                <Route element={<ProtectedRoute requiredPlan="vip" />}>
                    <Route path="elite" element={<EliteModule />} />
                </Route>

                <Route element={<ProtectedRoute requiredPlan="vup" />}>
                    <Route path="standard" element={<StandardModule />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute requiredRole="admin" />}>
                    <Route path="admin" element={<AdminPanel />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
