import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserFavorites } from '../api/favoriteApi'
import GuideCard from '../components/GuideCard'

const Favorites = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if(user) loadFavorites();
    }, [user])

    const loadFavorites = async () => {
        const { data, error } = await getUserFavorites(user.id)
        if(error) console.error('Ошибка во время получения избранных гайдов: ', error)
        else setFavorites(data?.map(item => item.guides) || []);
        setLoading(false);
    }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1 className="favorites-title">Мое избранное</h1>
        <p className="favorites-subtitle">Сохраненные гайды для быстрого доступа</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка избранного...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="favorites-empty">
          <h3>Избранное пусто</h3>
          <p>Добавляйте гайды в избранное, чтобы вернуться к ним позже</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Найти гайды
          </button>
        </div>
      ) : (
        <>
          <div className='guides-grid'>
            {favorites.map(guide => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Favorites