import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const Register = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nickname || !email || !password || !confirmPassword) {
      setError('Заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setError('Длина пароля должна быть больше 6');
      return;
    }

    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('nickname', nickname)
        .maybeSingle()

      if (existing) {
        setError('Этот никнейм уже занят');
        return;
      }
    } catch (err) {
      console.error('Ошибка проверки никнейма:', err);
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data, error } = await signUp(email, password, nickname);

      if(error) {
        throw error;
      }

      setSuccess(`Успешная регистрация. Добро пожаловать, ${nickname}!`);
      setTimeout(() => {
        navigate('/');
      }, 2000)
    } catch(err) {
      console.error('Ошибка регистрации: ', err);

      if (err.message.includes('already registered')) {
        setError('Этот email уже зарегистрирован')
      } else if (err.message.includes('invalid email')) {
        setError('Некорректный email адрес')
      } else {
        setError(err.message || 'Ошибка регистрации. Попробуйте позже.')
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Регистрация</h1>
        
        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        {success && (
          <div className="alert alert-success">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input 
              type='text' 
              onChange={(e) => setNickname(e.target.value.trim())} 
              placeholder='Никнейм' 
              disabled={loading || !!success}
              className="form-input"
              minLength='3' 
              maxLength='30'
              required
            />
          </div>
          <div className="form-group">
            <input 
              type='email' 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder='Email' 
              disabled={loading || !!success}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <input 
              type='password' 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder='Пароль' 
              disabled={loading || !!success}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <input 
              type='password' 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder='Повторите пароль' 
              disabled={loading || !!success}
              className="form-input"
              required
            />
          </div>
          <button 
            type='submit' 
            disabled={loading || !!success}
            className="btn btn-primary btn-block"
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p className="auth-link-text">
            Уже есть аккаунт?{' '}
            <Link to='/login' className="auth-link">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register