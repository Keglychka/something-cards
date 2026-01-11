import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth } from '../context/AuthContext'
import { fetchGuide, deleteGuide } from "../api/guideApi"
import { supabase } from "../lib/supabase"
import FavoritesButton from "../components/FavoritesButton"

const GuidePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [guide, setGuide] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [author, setAuthor] = useState(null);

    useEffect(() => {
      if (guide?.user_id) {
        loadAuthorNickname(guide.user_id);
      }
    }, [guide])

    const loadAuthorNickname = async userId => {
      const { data, error } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', userId)
        .maybeSingle()

      setAuthor(data);
    }

    useEffect(() => {
      const loadGuide = async () => {
        const { data, error } = await fetchGuide(id);

        if(error) {
          setError("Ошибка загрузки гайда: " + error);
        } else setGuide(data);

        setLoading(false);
      }

      if(id) loadGuide();
      else {
        setError("ID гайда не указан");
        return;
      }
    }, [id])

    const handleDelete = () => {
      const confirmed = window.confirm('Вы точно хотите удалить данный гайд?')

      if(confirmed) {
        deleteGuide(id, user.id)
          .then(res => {
            if(!res.error) navigate('/')
            else setError(res.error)
          })
      }
    }

    if(loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка гайда...</p>
        </div>
      )
    }

    if(error) {
      return (
        <div className="error-container">
          <div className="alert alert-error">
            <h2>Ошибка</h2>
            <p>{error}</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              На главную
            </button>
          </div>
        </div>
      )
    }

    if(!guide) {
      return (
        <div className="error-container">
          <div className="alert alert-error">
            <h2>Гайд не найден</h2>
            <p>Запрашиваемый гайд не существует или был удален</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              На главную
            </button>
          </div>
        </div>
      )
    }
    
  return (
    <div className="guide-page-container">
      <div className="guide-page-card">
        <div className="guide-header">
          <div className="guide-favorites-btn">
            <FavoritesButton guideId={guide.id} />
          </div>
          <button 
            className="btn btn-secondary btn-back"
            onClick={() => navigate('/')}
          >
            ← Назад
          </button>

          <div className="guide-meta-info">
            <div className="guide-author-section">
              <div className="author-avatar">
                {author?.nickname?.charAt(0) || '?'}
              </div>
              <div className="author-details">
                <span className="author-label">Автор:</span>
                <span className="author-name">{author?.nickname || 'Неизвестный автор'}</span>
              </div>
            </div>
          </div>

          <div className="guide-title-section">
            <h1 className="guide-game-title">{guide.game_title}</h1>
            <h2 className="guide-main-title">{guide.title}</h2>
          </div>

          <div className="guide-details-grid">
            <div className="detail-item">
              <span className="detail-label">Платформа:</span>
              <span className="detail-value detail-platform">{guide.platform}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Сложность:</span>
              <span className="detail-value detail-difficulty">{guide.difficulty}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Категория:</span>
              <span className="detail-value detail-category">{guide.category}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Создан:</span>
              <span className="detail-value detail-date">
                {new Date(guide.created_at).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="guide-content-section">
          <h3 className="content-title">Содержание:</h3>
          <div className="guide-content">
            {guide.content.split('\n').map((paragraph, index) => (
              paragraph.trim() ? (
                <p key={index} className="content-paragraph">{paragraph}</p>
              ) : (
                <br key={index} />
              )
            ))}
          </div>
        </div>

        <div className="guide-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            ← Назад к списку
          </button>
          <div className="action-buttons">
            {user?.id === guide.user_id && (
              <>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate(`/guides/${guide.id}/edit`)}
                >
                  Редактировать
                </button>
                <button 
                  className="btn btn-delete"
                  onClick={handleDelete}
                >
                  Удалить
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuidePage