import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { addToFavorites, removeFromFavorites, isFavorite } from '../api/favoriteApi'

const FavoritesButton = ({ guideId }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [favorited, setFavorited] = useState(false);

    useEffect(() => {
        if (user && guideId) checkFavoriteStatus()
    }, [user, guideId])

    const checkFavoriteStatus = async () => {
        const { isFavorite: isFav } = await isFavorite(user.id, guideId)
        setFavorited(isFav);
    }

    const handleToggle = async () => {
        if(!user) {
            navigate('/login')
            return;
        }

        if(!guideId) {
            console.error('Нет guideId')
            return;
        }

        setLoading(true);

        try {
            if (favorited) {
                const { error } = await removeFromFavorites(user.id, guideId);
                if(error) console.error('Ошибка удаления из избранного: ', error)
                else setFavorited(false)
            } else {
                const { data, error } = await addToFavorites(user.id, guideId);
                if (error) {
                    console.error('Ошибка добавления в избранное: ', error)
                    if (error.includes('409') || error.includes('уже')) {
                        setFavorited(true);
                    }
                } else {
                    setFavorited(true);
                }
            }
        } catch (error) {
            console.error('Ошибка во время изменения избранного: ', error)
        } finally {
            setLoading(false);
        }
    }

    if(!guideId) return null;

  return (
    <button 
      onClick={handleToggle} 
      className={`favorite-btn ${favorited ? 'favorited' : ''} ${loading ? 'loading' : ''}`}
      disabled={loading}
      title={favorited ? "Удалить из избранного" : "Добавить в избранное"}
    >
      {favorited ? '❤️' : '🤍'}
    </button>
  )
}

export default FavoritesButton