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
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка профиля...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Личный кабинет</h1>
        {user && profile && (
          <div className="profile-info">
            <h2 className="profile-subtitle">Ваша информация:</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Никнейм:</span>
                <span className="info-value">{profile.nickname}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Дата регистрации:</span>
                <span className="info-value">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard