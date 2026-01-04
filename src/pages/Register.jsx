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

    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data, error } = await signUp(email, password, nickname);

      if(error) {
        throw error;
      }

      setSuccess(`Успешная регистрация. Доброе пожаловать, ${nickname}`);
      setTimeout(() => {
        navigate('/dashboard');
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
    <div>
      <h1>Регистрация</h1>
      {error ?? (
        <div>{error}</div>
      )}

      {success ?? (
        <div>{success}</div>
      )}

      <form onSubmit={handleSubmit}>
        <input required type='text' onChange={(e) => setNickname(e.target.value.trim())} placeholder='Никнейм' disabled={loading || success} minLength='3' maxLength='30' />
        <input required type='email' onChange={(e) => setEmail(e.target.value)} placeholder='Email' disabled={loading || success} />
        <input required type='password' onChange={(e) => setPassword(e.target.value)} placeholder='Пароль' disabled={loading || success} />
        <input required type='password' onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Повторите пароль' disabled={loading || success} />
        <button type='submit' disabled={loading || success}>{loading? 'Регистрация..' : 'Зарегистрироваться'}</button>
      </form>
      <div>
        <p>
          Уже есть аккаунт?{' '}
          <Link to='/login'>Войти</Link>
        </p>
      </div>
    </div>
  )
}

export default Register