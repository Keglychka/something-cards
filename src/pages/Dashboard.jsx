import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase";

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(user) {
      loadProfile();
    }
  }, [user])

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

      if(error) {
        throw error;
      }
      setProfile(data);
    } catch(err) {
      console.error('Ошибка загрузки профиля: ', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка профиля...</div>
  }

  return (
    <div>
      <h1>Личный кабинет</h1>
      {user && profile && (
        <div>
          <h2>Ваша информация:</h2>
          <p><strong>Никнейм:</strong> {profile.nickname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Дата регистрации:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
      )}

    </div>
  )
}

export default Dashboard