import { useState, useEffect } from "react"
import { fetchUserGuides } from "../api/guideApi"
import { useAuth } from "../context/AuthContext"
import GuideCard from "../components/GuideCard"

const UserGuides = () => {
    const [guide, setGuide] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true)

    const { user } = useAuth();

    useEffect(() => {
        if(user) loadGuides();
        else setLoading(false)
    }, [user])

    const loadGuides = async () => {
        try {
            const { data, error } = await fetchUserGuides(user.id)

            if(!error) setGuide(data || []);
            setLoading(false);
        } catch (error) {
            setError('Ошибка загрузки гайдов: ', error)
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
            <h1 className="guides-title">Личные гайды</h1>
        </div>        

        {guide.length === 0 ? (
            <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3>Гайдов пока нет</h3>
            <p>Добавьте свой первый гайд!</p>
            </div>
        ) : (
            <div className="guides-grid">
            {guide.map(guide => (
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

export default UserGuides