import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from '../context/AuthContext'
import { createGuide, PLATFORMS, CATEGORIES, DIFFICULTIES } from '../api/guideApi'

const GuideCreate = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        game_title: '',
        title: '',
        content: '',
        category: '',
        difficulty: '',
        platform: '',
    })

    const { user } = useAuth();
    const navigate = useNavigate();

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { data, error } = await createGuide(formData, user.id);

            if(error) {
                setError(error);
            } else {
                navigate(`/guides/${data.id}`)
            }
        } catch (error) {
            setError('Неожиданная ошибка во время создания гайда')
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="guide-create-container">
        <div className="guide-create-card">
            <h1 className="guide-create-title">Создание гайда</h1>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="guide-create-form">
                <div className="form-row">
                    <div className="form-group">
                        <input
                            className="form-input"
                            name="game_title"
                            value={formData.game_title}
                            required
                            type='text'
                            maxLength='100'
                            placeholder="Например: The Witcher 3: Wild Hunt"
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            className="form-input"
                            name="title"
                            value={formData.title}
                            required
                            type='text'
                            maxLength='100'
                            placeholder="Например: Как победить всех боссов"
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <textarea
                        className="form-textarea"
                        name="content"
                        value={formData.content}
                        required
                        minLength='50'
                        placeholder="Опишите подробно ваш гайд. Используйте Markdown для форматирования..."
                        rows='12'
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <select 
                            className="form-select"
                            name='platform' 
                            value={formData.platform} 
                            onChange={handleChange} 
                            required 
                            disabled={loading}
                        >
                            <option value=''>Выберите платформу игры</option>
                            {PLATFORMS.map(platform => (
                                <option key={platform} value={platform}>{platform}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <select 
                            className="form-select"
                            name='category' 
                            value={formData.category} 
                            onChange={handleChange} 
                            required 
                            disabled={loading}
                        >
                            <option value=''>Выберите категорию гайда</option>
                            {CATEGORIES.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <select 
                            className="form-select"
                            name='difficulty' 
                            value={formData.difficulty} 
                            onChange={handleChange} 
                            required 
                            disabled={loading}
                        >
                            <option value=''>Выберите сложность выполнения</option>
                            {DIFFICULTIES.map(diff => (
                                <option key={diff} value={diff}>{diff}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-actions">
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => navigate(-1)}
                        disabled={loading}
                    >
                        Отмена
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Создание...
                            </>
                        ) : 'Создать гайд'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default GuideCreate