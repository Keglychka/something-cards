import { useState } from "react"
import { supabase } from "../lib/supabase"

const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))

        if(error) setError('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setError('Заполните все поля');
            return;
        }
        if(formData.currentPassword === formData.newPassword) {
            setError('Новый пароль должен отличаться от текущего')
            return;
        }
        if(formData.newPassword.length < 6) {
            setError('Длина пароля должна быть больше 6');
            return;
        }
        if(formData.newPassword !== formData.confirmPassword) {
            setError('Новые пароли не совпадают');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if(userError || !user) {
                setError('Пользователь не авторизован');
                setLoading(false);
                return;
            }


            const { error: reauthError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: formData.currentPassword
            })
            if(reauthError) {
                setError('Текущий пароль неверен');
                setLoading(false);
                return;
            }


            const { error: updateError } = await supabase.auth.updateUser({
                password: formData.newPassword
            })
            if(updateError) {
                setError('Ошибка смены пароля: ', updateError.message)
            } else {
                setSuccess('Пароль успешно изменен!')
            }

            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            })

            if(onSuccess) onSuccess();

            setTimeout(() => {
                onClose();
                onSuccess('');
            }, 2000)

        } catch (error) {
            setError('Неожиданная ошибка во время изменения пароля: ', error.message)
        } finally {
            setLoading(false);
        }
    }

    const handleClose = () => {
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        })
        setError('')
        setSuccess('')
        setLoading(false)
        onClose()
    }

    if(!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Смена пароля</h2>
          <button 
            className="modal-close" 
            onClick={handleClose}
            disabled={loading}
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          {error && (
            <div className="alert alert-error">
              ⚠️ {error}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success">
              ✅ {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="currentPassword">Текущий пароль</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Введите текущий пароль"
                required
                disabled={loading || success}
                autoComplete="current-password"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">Новый пароль</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Не менее 6 символов"
                required
                disabled={loading || success}
                minLength="6"
                autoComplete="new-password"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Подтвердите пароль</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Повторите новый пароль"
                required
                disabled={loading || success}
                autoComplete="new-password"
              />
            </div>
            
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={loading}
              >
                Отмена
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || success}
              >
                {loading ? '⏳ Изменение...' : 'Изменить пароль'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordModal