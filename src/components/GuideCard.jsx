import { useNavigate } from 'react-router-dom'

const GuideCard = ({ guide }) => {
  const navigate = useNavigate();

  const getPreview = (content) => {
    if (!content || typeof content !== 'string') return '';
    
    const plainText = content
      .replace(/#{1,6}\s?/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/\n+/g, ' ')
      .trim();
    
    if (plainText.length <= 50) return plainText;
    
    return plainText.substring(0, 50) + '...';
  };

  const contentPreview = getPreview(guide.content);

  // Функция для получения цвета платформы
  const getPlatformColor = (platform) => {
    const colors = {
      'PC': '#4361ee',
      'PlayStation': '#003087',
      'Xbox': '#107c10',
      'Nintendo': '#e60012',
      'Mobile': '#ff6b6b',
      'Cross-platform': '#7209b7'
    };
    return colors[platform] || '#6c757d';
  };

  return (
    <div className="guide-card" onClick={() => navigate(`/guides/${guide.id}`)}>
      <div className="guide-card-header">
        <span 
          className="guide-platform" 
          style={{ backgroundColor: getPlatformColor(guide.platform) }}
        >
          {guide.platform}
        </span>
        <span className="guide-game">{guide.game_title}</span>
      </div>
      
      <div className="guide-card-body">
        <h3 className="guide-title">{guide.title}</h3>
        <p className="guide-preview">{contentPreview}</p>
      </div>
      
      <div className="guide-card-footer">
        <button 
          className="btn btn-outline guide-open-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/guides/${guide.id}`);
          }}
        >
          Открыть гайд
        </button>
      </div>
    </div>
  );
}

export default GuideCard