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
        <nav>
            <div>
                <Link to='/'>Главная</Link>
            </div>

            <div>
                {user ? (
                    <>
                        <span>Привет {profile?.nickname || user.email}</span>
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