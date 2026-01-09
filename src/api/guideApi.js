import { supabase } from '../lib/supabase'

export const PLATFORMS = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'Другое']
export const DIFFICULTIES = ['новичок', 'средний', 'эксперт']
export const CATEGORIES = [
  'Прохождение', 
  'Советы и хитрости', 
  'Сборки персонажей', 
  'Гайды по классам', 
  'Гайды по оружию', 
  'Начало игры', 
  'Продвинутые тактики'
]

// Получение всех гайдов
export const fetchGuides = async (filters = {}) => {
    try {
        let query = supabase.from('guides').select('*');

        if(filters.search && filters.search.trim() !== '') {
            const searchTerm = `%${filters.search}%`
            query = query.or(`title.ilike.${searchTerm},content.ilike.${searchTerm},game_title.ilike.${searchTerm}`)
        }

        if (filters.platform && filters.platform.trim() !== '') {
            query = query.eq('platform', filters.platform);
        }

        if (filters.difficulty && filters.difficulty.trim() !== '') {
            query = query.eq('difficulty', filters.difficulty);
        }

        if (filters.category && filters.category.trim() !== '') {
            query = query.eq('category', filters.category);
        }

        query = query.order('created_at', { ascending: false });

        if(filters.page && filters.limit) {
            const start = (filters.page - 1) * filters.limit;
            const end = start + filters.limit - 1;
            query = query.range(start, end);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Ошибка при получении гайдов:', error)
            return { data: null, error: formatError(error) }
        }
        
        return { data, error: null }

    } catch (error) {
        console.error('Неожиданная ошибка в fetchGuides: ', error);
        return { data: null, error: 'Ошибка загрузки гайдов. Попробуйте позже.' }
    }
}

// Получение одного гайда по ID
export const fetchGuide = async (id) => {
    try {
        if(!id) {
            return { data: null, error: "ID гайда не указан" }
        }

        const { data, error } = await supabase
            .from('guides')
            .select('*')
            .eq('id', id)
            .maybeSingle()

        if (error) {
            if (error.code === 'PGRST116') {
                return { data: null, error: 'Гайд не найден' }
            }
            console.error('Ошибка при получении гайда:', error)
            return { data: null, error: formatError(error) }
        }
            
        return { data, error: null }
    } catch (error) {
        console.error('Неожиданная ошибка в fetchGuide: ', error);
        return { data: null, error: 'Ошибка загрузки гайда' }
    }
}

// Создание гайда
export const createGuide = async (guideData, userId) => {
    try {
        const validation = validateGuideData(guideData);
        if(!validation.isValid) {
            return { data: null, error: validation.errors.join(', ') }
        }

        if(!userId) {
            return { data: null, error: 'Пользователь не авторизован' }
        }

        const guideToCreate = {
            ...guideData,
            user_id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }

        const { data, error } = await supabase
            .from('guides')
            .insert([guideToCreate])
            .select()
            .maybeSingle()

        if (error) {
            console.error('Ошибка при создании гайда: ', error)
            return { data: null, error: formatError(error) }
        }

        return { data, error: null }
    } catch(error) {
        console.error('Неожиданная ошибка в createGuide: ', error);
        return { data: null, error: 'Ошибка создания гайда' }
    }
}

// Обновление гайда
export const updateGuide = async (id, updates, userId) => {
    try {
        if(!userId) {
            return { data: null, error: 'Пользователь не авторизован' }
        }

        if(!id) {
            return { data: null, error: 'ID гайда не указан' }
        }

        const { data: existingGuide, error: fetchError } = await fetchGuide(id)
        if(fetchError) {
            return { data: null, error: fetchError }
        }

        if(existingGuide.user_id !== userId) {
            return { data: null, error: 'Вы не можете редактировать данный гайд' }
        }

        const guideToUpdate = {
            ...updates,
            updated_at: new Date().toISOString()
        }

        const { data, error } = await supabase
            .from('guides')
            .update(guideToUpdate)
            .eq('id', id)
            .select()
            .maybeSingle()

        if (error) {
            console.error('Ошибка при обновлении гайда: ', error)
            return { data: null, error: formatError(error) }
        }

        return { data, error: null }
    } catch (error) {
        console.error('Неожиданная ошибка в updateGuide: ', error);
        return { data: null, error: 'Ошибка обновления гайда' }
    }
}

// Удаление гайда
export const deleteGuide = async (id, userId) => {
    try {
        if (!id) {
            return { data: null, error: 'ID гайда не указан' }
        }

        if (!userId) {
            return { data: null, error: 'Пользователь не авторизован' }
        }

        const { data: existingGuide, error: fetchError } = await fetchGuide(id)
        if (fetchError) {
            return { data: null, error: fetchError }
        }

        if (!existingGuide) {
            return { data: null, error: 'Гайд не найден' }
        }

        if (existingGuide.user_id !== userId) {
            return { data: null, error: "Вы не можете удалить данный гайд" }
        }

        const { data, error } = await supabase
            .from('guides')
            .delete()
            .eq('id', id)
            .select()

        if(error) {
            console.error('Неожиданная ошибка в deleteGuide: ', error)
            return { data: null, error: formatError(error) }
        }

        return { data: { success: true }, error: null }

    } catch (error) {
        console.error('Неожиданная ошибка в deleteGuide: ', error);
        return { data: null, error: 'Ошибка удаления гайда' }
    }
}

// Получение гайдов конкретного пользователя
export const fetchUserGuides = async (userId) => {
    try {
        if (!userId) {
            return { data: null, error: 'ID пользователя не указан' }
        }

        const { data, error } = await supabase
            .from('guides')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if(error) {
            console.error('Ошибка при получении гайдов пользователя: ', error)
            return { data: null, error: formatError(error) }
        }

        return { data, error: null }
    } catch(error) {
        console.error('Неожиданная ошибка в fetchUserGuides: ', error);
        return { data: null, error: 'Ошибка загрузки гайдов пользователя' }
    }
}

const validateGuideData = (data) => {
    const errors = []
    
    if (!data.game_title || data.game_title.trim() === '') {
        errors.push('Укажите название игры')
    }
    
    if (!data.title || data.title.trim() === '') {
        errors.push('Укажите заголовок гайда')
    }
    
    if (!data.content || data.content.trim() === '') {
        errors.push('Напишите содержание гайда')
    } else if (data.content.trim().length < 50) {
        errors.push('Содержание должно быть не менее 50 символов')
    }
    
    if (!data.category || data.category.trim() === '') {
        errors.push('Выберите категорию')
    } else if (!CATEGORIES.includes(data.category)) {
        errors.push('Неверная категория')
    }
    
    if (!data.difficulty || data.difficulty.trim() === '') {
        errors.push('Укажите сложность')
    } else if (!DIFFICULTIES.includes(data.difficulty)) {
        errors.push('Неверная сложность')
    }
    
    if (!data.platform || data.platform.trim() === '') {
        errors.push('Выберите платформу')
    } else if (!PLATFORMS.includes(data.platform)) {
        errors.push('Неверная платформа')
    }
    
    return {
        isValid: errors.length === 0,
        errors
    }
}

const formatError = (error) => {
    if (!error) return 'Неизвестная ошибка'
    
    if (error.message) {
        if (error.message.includes('duplicate key')) {
        return 'Ошибка: дублирующиеся данные'
        }
        if (error.message.includes('network')) {
        return 'Проблемы с подключением к сети'
        }
        if (error.message.includes('timeout')) {
        return 'Превышено время ожидания'
        }
        return error.message
    }
    
    if (error.code) {
        switch (error.code) {
        case '23505': // unique_violation
            return 'Такой гайд уже существует'
        case '23503': // foreign_key_violation
            return 'Ошибка связи с данными пользователя'
        case '42501': // insufficient_privilege
            return 'Недостаточно прав для выполнения операции'
        default:
            return `Ошибка: ${error.code}`
        }
    }
    
    return 'Произошла ошибка. Попробуйте ещё раз.'
}