import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navigation = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        signOut();
        navigate('/')
    }

    return (
        <nav>
            <div>
                <Link to='/'>Главная</Link>
            </div>

            <div>
                {user ? (
                    <>
                        <span>Привет {user.email}</span>
                        <Link to='/dashboard'>Профиль</Link>
                        <button onClick={handleLogout}>Выйти</button>
                    </>
                ) : (
                    <>
                        <Link to='/login'>Войти</Link>
                        <Link to='/register'>Регистрация</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navigation