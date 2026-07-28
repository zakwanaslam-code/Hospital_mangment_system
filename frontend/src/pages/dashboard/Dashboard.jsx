import { useAuth } from '../../context/AuthContext.jsx';

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold text-dark-text">
        Welcome back, {user?.name?.split(' ')[0]} 👋
      </h1>
      <p className="text-dark-muted text-sm mt-1">
        Yahan aapke hospital ka overview hoga — Dashboard Cards aur Charts agle step me.
      </p>
    </div>
  );
}

export default Dashboard;