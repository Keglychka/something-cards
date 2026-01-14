import { useState, useEffect, useMemo } from 'react'
import { fetchGuides, CATEGORIES, DIFFICULTIES, PLATFORMS } from '../api/guideApi'
import GuideCard from '../components/GuideCard';

const Home = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [platform, setPlatform] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Подсчет активных фильтров
  useEffect(() => {
    let count = 0;
    if (platform) count++;
    if (category) count++;
    if (difficulty) count++;
    setActiveFilterCount(count);
  }, [platform, category, difficulty]);

  useEffect(() => {
    const savedSearch = localStorage.getItem('guide_search');
    const savedPlatform = localStorage.getItem('guide_platform');
    const savedCategory = localStorage.getItem('guide_category');
    const savedDifficulty = localStorage.getItem('guide_difficulty');

    if(savedSearch) {
      setSearch(savedSearch);
      setSearchInput(savedSearch)
    }
    if(savedCategory) setCategory(savedCategory);
    if(savedDifficulty) setDifficulty(savedDifficulty);
    if(savedPlatform) setPlatform(savedPlatform);
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

  useEffect(() => {
    if(platform) localStorage.setItem('guide_platform', platform)
    else localStorage.removeItem('guide_platform')
  }, [platform])

  useEffect(() => {
    if(category) localStorage.setItem('guide_category', category)
    else localStorage.removeItem('guide_category')
  }, [category])

  useEffect(() => {
    if(difficulty) localStorage.setItem('guide_difficulty', difficulty)
    else localStorage.removeItem('guide_difficulty')
  }, [difficulty])

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

  const filteredGuides = useMemo(() => {
    return guides.filter(guide => {
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        const matchesSearch = 
          guide.game_title?.toLowerCase().includes(searchLower) ||
          guide.title?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (platform && guide.platform !== platform) return false;
      
      if (category && guide.category !== category) return false;
      
      if (difficulty && guide.difficulty !== difficulty) return false;
      
      return true;
    });
  }, [guides, search, platform, category, difficulty]);

  const resetAllFilters = () => {
    setSearchInput('');
    setSearch('');
    setPlatform('');
    setCategory('');
    setDifficulty('');
    
    localStorage.removeItem('guide_search');
    localStorage.removeItem('guide_platform');
    localStorage.removeItem('guide_category');
    localStorage.removeItem('guide_difficulty');
  };

  const handleSearchInput = e => {
    setSearchInput(e.target.value);
  }

  const handleFilterChange = (type, value) => {
    switch(type) {
      case 'platform':
        setPlatform(value);
        break;
      case 'category':
        setCategory(value);
        break;
      case 'difficulty':
        setDifficulty(value);
        break;
      default:
        break;
    }
  };

  const removeFilter = (type) => {
    switch(type) {
      case 'platform':
        setPlatform('');
        localStorage.removeItem('guide_platform');
        break;
      case 'category':
        setCategory('');
        localStorage.removeItem('guide_category');
        break;
      case 'difficulty':
        setDifficulty('');
        localStorage.removeItem('guide_difficulty');
        break;
      case 'search':
        setSearchInput('');
        setSearch('');
        localStorage.removeItem('guide_search');
        break;
      default:
        break;
    }
  };

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

      <div className='search-section'>
        <div className='search-container'>
          <div className='search-wrapper'>
            <div className='search-icon'>🔍</div>
            <input 
              type='search' 
              value={searchInput} 
              onChange={handleSearchInput} 
              placeholder='Поиск по названию игры или заголовку гайда' 
              className='search-input' 
            />
            {searchInput && (
              <button 
                className='search-clear-btn'
                onClick={() => removeFilter('search')}
                title="Очистить поиск"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className='filters-toggle-section'>
          <button 
            className={`filters-toggle-btn ${showFilters ? 'active' : ''} ${activeFilterCount > 0 ? 'has-filters' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="filters-toggle-icon">⚙️</span>
            <span className="filters-toggle-text">
              {activeFilterCount > 0 ? `Фильтры (${activeFilterCount})` : 'Фильтры'}
            </span>
            <span className="filters-toggle-arrow">{showFilters ? '▲' : '▼'}</span>
          </button>
        </div>
      </div>

      {/* Активные фильтры в виде чипов */}
      {(search || platform || category || difficulty) && (
        <div className="active-filters">
          <div className="active-filters-label">Активные фильтры:</div>
          <div className="active-filters-chips">
            {search && (
              <div className="filter-chip">
                <span className="filter-chip-text">Поиск: "{search}"</span>
                <button 
                  className="filter-chip-remove"
                  onClick={() => removeFilter('search')}
                >
                  ×
                </button>
              </div>
            )}
            {platform && (
              <div className="filter-chip">
                <span className="filter-chip-text">Платформа: {platform}</span>
                <button 
                  className="filter-chip-remove"
                  onClick={() => removeFilter('platform')}
                >
                  ×
                </button>
              </div>
            )}
            {category && (
              <div className="filter-chip">
                <span className="filter-chip-text">Категория: {category}</span>
                <button 
                  className="filter-chip-remove"
                  onClick={() => removeFilter('category')}
                >
                  ×
                </button>
              </div>
            )}
            {difficulty && (
              <div className="filter-chip">
                <span className="filter-chip-text">Сложность: {difficulty}</span>
                <button 
                  className="filter-chip-remove"
                  onClick={() => removeFilter('difficulty')}
                >
                  ×
                </button>
              </div>
            )}
            <button 
              className="filter-chip-clear-all"
              onClick={resetAllFilters}
            >
              Очистить все
            </button>
          </div>
        </div>
      )}

      {/* Панель фильтров */}
      <div className={`filters-panel ${showFilters ? 'open' : ''}`}>
        <div className='filters-content'>
          <div className='filters-header'>
            <h3 className="filters-title">Фильтры гайдов</h3>
            <p className="filters-subtitle">Уточните поиск по параметрам</p>
          </div>

          <div className='filters-grid'>
            <div className='filter-group'>
              <label htmlFor="platform" className="filter-label">Платформа</label>
              <select 
                id="platform"
                value={platform}
                onChange={(e) => handleFilterChange('platform', e.target.value)}
                className="filter-select"
              >
                <option value="">Все платформы</option>
                {PLATFORMS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className='filter-group'>
              <label htmlFor="category" className="filter-label">Категория</label>
              <select 
                id="category"
                value={category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                <option value="">Все категории</option>
                {CATEGORIES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className='filter-group'>
              <label htmlFor="difficulty" className="filter-label">Сложность</label>
              <select 
                id="difficulty"
                value={difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="filter-select"
              >
                <option value="">Любая сложность</option>
                {DIFFICULTIES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filters-actions">
            <button 
              onClick={() => setShowFilters(false)}
              className="btn btn-secondary"
            >
              Скрыть фильтры
            </button>
            <button 
              onClick={resetAllFilters}
              className="btn btn-outline"
            >
              Сбросить фильтры
            </button>
          </div>
        </div>
      </div>

      {filteredGuides.length === 0 ? (
        <div className={`empty-state ${search ? 'search-empty-state' : ''}`}>
          <div className="empty-state-icon">{search ? '🔍' : '📚'}</div>
          <h3>
            {search 
              ? `По запросу "${search}" ничего не найдено` 
              : 'Гайдов пока нет'
            }
          </h3>
          <p>
            {search 
              ? 'Попробуйте изменить запрос или параметры фильтров' 
              : 'Будьте первым, кто добавит гайд!'
            }
          </p>
          {(search || platform || category || difficulty) && (
            <button 
              className="btn btn-primary"
              onClick={resetAllFilters}
            >
              Показать все гайды
            </button>
          )}
        </div>
      ) : (
        <>         
          <div className="guides-grid">
            {filteredGuides.map(guide => (
              <GuideCard
                key={guide.id}
                guide={guide}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Home