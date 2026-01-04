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

      navigate('/dashboard');
    } catch(err) {
      console.error('Ошибка входа: ', err);
      setError(error.message || 'Ошибка входа. Проверьте email и пароль');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Вход в систему</h1>
      {error ?? (
        <div>{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <input required type='email' onChange={(e) => setEmail(e.target.value)} placeholder='Email' disabled={loading} />
        <input required type='password' onChange={(e) => setPassword(e.target.value)} placeholder='Пароль' disabled={loading} />
        <button type='submit' disabled={loading}>{loading? 'Вход..' : 'Войти'}</button>
      </form>
      <div>
        <p>
          Нет аккаунта?{' '}
          <Link to='/register'>Регистрация</Link>
        </p>
      </div>
    </div>
  )
}

export default Login