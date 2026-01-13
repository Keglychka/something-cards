import { useState, useEffect } from 'react'
import { fetchGuides } from '../api/guideApi'
import GuideCard from '../components/GuideCard';

const Home = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const savedSearch = localStorage.getItem('guide_search');
    if(savedSearch) {
      setSearch(savedSearch);
      setSearchInput(savedSearch)
    }
  }, [])

  useEffect(() => {
    loadGuides()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      if(searchInput.trim()) localStorage.setItem('guide_search', searchInput)
      else localStorage.removeItem('guide_search');
    }, 500)

    return () => clearTimeout(timer);
  }, [searchInput])

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

  const filteredGuides = guides.filter(guide => {
    if(!search.trim()) return true;

    const searchLower = search.toLowerCase();
    return (
      guide.game_title?.toLowerCase().includes(searchLower) ||
      guide.title?.toLowerCase().includes(searchLower)
    )
  })

  const handleSearchInput = e => {
    setSearchInput(e.target.value);
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

      <div className='search'>
        <div className='search-wrapper'>
          <input type='search' value={searchInput} onChange={handleSearchInput} placeholder='Поиск по названию игры или заголовку гайда' className='search-input' />
        </div>

        {search && (
          <div className='search-info'>
            <p>{filteredGuides.length === 0 ? `По запросу "${search}" ничего не найдено` : `Найдено ${filteredGuides.length} гайдов`}</p>
          </div>
        )}
      </div>

      {filteredGuides.length === 0 && search ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>Ничего не найдено</h3>
          <p>Попробуйте изменить запрос</p>
        </div>
      ) : (
        filteredGuides.length === 0 && !search ? (
          <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3>Гайдов пока нет</h3>
          <p>Будьте первым, кто добавит гайд!</p>
        </div>
        ) : (
          <div className="guides-grid">
            {filteredGuides.map(guide => (
              <GuideCard
                key={guide.id}
                guide={guide}
              />
            ))}
          </div>
        ))}
    </div>
  )
}

export default Home