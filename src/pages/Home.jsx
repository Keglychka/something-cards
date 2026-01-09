import { useState, useEffect } from 'react'
import { fetchGuides } from '../api/guideApi'
import GuideCard from '../components/GuideCard';

const Home = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGuides()
  }, [])

  const loadGuides = async () => {
    try {
      const { data, error } = await fetchGuides({});
      if(!error) {
        setGuides(data || [])
      }
      setLoading(false)
    } catch (error) {
      setError('Неожиданная ошибка загрузки гайдов: ', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка гайдов...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-error">
          <h3>Ошибка загрузки</h3>
          <p>{error}</p>
          <button onClick={loadGuides} className="btn btn-secondary">
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="guides-container">
      <div className="guides-header">
        <h1 className="guides-title">Игровые гайды</h1>
        <p className="guides-subtitle">Полезные руководства и советы для ваших любимых игр</p>
      </div>

      {guides.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3>Гайдов пока нет</h3>
          <p>Будьте первым, кто добавит гайд!</p>
        </div>
      ) : (
        <div className="guides-grid">
          {guides.map(guide => (
            <GuideCard
              key={guide.id}
              guide={guide}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home