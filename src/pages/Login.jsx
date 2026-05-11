import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UtensilsCrossed, LogIn } from 'lucide-react';

export default function Login() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!login(email, password)) setError('Credenciales incorrectas');
  };

  const quickLogin = (role) => {
    const creds = { admin: ['admin@sigr.com', '1234'], mesero: ['mesero@sigr.com', '1234'], cliente: ['cliente@sigr.com', '1234'] };
    login(creds[role][0], creds[role][1]);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <UtensilsCrossed size={48} color="#e67e22" />
          <h1>SIGR</h1>
          <p>Sistema Integral de Gestión de Restaurante</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Correo electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="usuario@sigr.com" required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••" required />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn-primary btn-full">
            <LogIn size={18} /> Ingresar
          </button>
        </form>
        <div className="quick-access">
          <p>Acceso rápido (demo):</p>
          <div className="quick-btns">
            <button onClick={() => quickLogin('admin')} className="btn-role admin">Admin</button>
            <button onClick={() => quickLogin('mesero')} className="btn-role mesero">Mesero</button>
            <button onClick={() => quickLogin('cliente')} className="btn-role cliente">Cliente</button>
          </div>
        </div>
      </div>
    </div>
  );
}
