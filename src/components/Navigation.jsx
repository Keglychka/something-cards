import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const Navigation = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (user) {
        loadProfile()
        }
    }, [user])

    const loadProfile = async () => {
        try {
        const { data } = await supabase
            .from('profiles')
            .select('nickname')
            .eq('id', user.id)
            .single()
        setProfile(data)
        } catch (error) {
        console.error('Ошибка загрузки профиля:', error)
        }
    }

    const handleLogout = async () => {
        signOut();
        navigate('/')
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to='/' className="navbar-logo">Игровой Гид</Link>
            </div>

            <div className="navbar-menu">
                {user ? (
                    <div className="navbar-auth auth-logged-in">
                        <span className="navbar-greeting">Привет, <span className="username">{profile?.nickname || user.email}</span></span>
                        <Link to='/guides/create' className='navbar-link btn-create'>Создать гайд</Link>
                        <Link to='/dashboard' className="navbar-link btn-profile">Профиль</Link>
                        <Link to='/guides/favorites' className='navbar-link favorites'>Избранное</Link>
                        <button onClick={handleLogout} className="btn-logout">Выйти</button>
                    </div>
                ) : (
                    <div className="navbar-auth auth-logged-out">
                        <Link to='/login' className="navbar-link btn-login">Войти</Link>
                        <Link to='/register' className="navbar-link btn-register">Регистрация</Link>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navigation