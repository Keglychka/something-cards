import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);

      if(error) {
        throw error;
      }

      navigate('/');
    } catch(err) {
      console.error('Ошибка входа: ', err);
      setError(err.message || 'Ошибка входа. Проверьте email и пароль');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Вход в систему</h1>
        
        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input 
              type='email' 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder='Email' 
              disabled={loading}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <input 
              type='password' 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder='Пароль' 
              disabled={loading}
              className="form-input"
              required
            />
          </div>
          <button 
            type='submit' 
            disabled={loading}
            className="btn btn-primary btn-block"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p className="auth-link-text">
            Нет аккаунта?{' '}
            <Link to='/register' className="auth-link">Регистрация</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login