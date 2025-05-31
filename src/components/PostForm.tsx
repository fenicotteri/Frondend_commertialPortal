import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostType, BusinessBranch } from '../types';
import { getBranchesByBusinessId } from '../context/PostApi';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../context/axiosClient';

interface PostFormData {
  title: string;
  content: string;
  type: PostType;
  imageUrl?: string;
  startDate: string;
  endDate?: string;
  branchIds?: number;
  discount?: {
    percentage?: number;
    code?: string;
  };
}

const PostForm = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const businessId = authState.ownedBusinessId ?? 1;

  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    type: 'event',
    imageUrl: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
    branchIds: undefined,
    discount: {
      percentage: undefined,
      code: ''
    }
  });

  const [branches, setBranches] = useState<BusinessBranch[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getBranchesByBusinessId(businessId);
        setBranches(data);
      } catch (error) {
        console.error('Ошибка загрузки филиалов', error);
      }
    };
    fetchBranches();
  }, [businessId]);

  const askGpt = async (prompt: string) => {
    const response = await axiosClient.post('/api/YandexGpt/ask', { prompt });
    return response.data.answer;
  };

  const handleAiHelp = async () => {
    if (!formData.content.trim()) {
      alert('Введите хотя бы короткое описание.');
      return;
    }

    try {
      setIsLoadingAi(true);
      const answer = await askGpt(formData.content);
      setFormData(prev => ({ ...prev, content: answer }));
    } catch (error) {
      console.error('Ошибка ИИ:', error);
      alert('Ошибка генерации описания.');
    } finally {
      setIsLoadingAi(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Введите заголовок';
    if (!formData.content.trim()) newErrors.content = 'Описание обязательно';
    if (!formData.startDate) newErrors.startDate = 'Дата начала обязательна';
    if (formData.type === 'discount' && !formData.discount?.percentage)
      newErrors.discountPercentage = 'Укажите процент скидки';
    if (formData.type === 'event' && !formData.branchIds)
      newErrors.branchIds = 'Выберите филиал для события';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    setIsSubmitting(true);

    const typeMap: Record<string, number> = {
      event: 0,
      promotion: 1,
      discount: 2
    };

    const payload = {
      title: formData.title,
      content: formData.content,
      type: typeMap[formData.type],
      imageUrl: formData.imageUrl || '',
      startDate: new Date(formData.startDate).toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      discount: (formData.type === 'discount' || formData.type === 'promotion')
        ? {
            percentage: formData.discount?.percentage ?? 0,
            amount: 0,
            code: formData.discount?.code ?? 'string'
          }
        : null,
      branchIds: formData.branchIds ? [formData.branchIds] : []
    };

    console.log('Отправка на сервер:', JSON.stringify(payload, null, 2));

    const response = await axiosClient.post('/api/Post/create', payload);

    console.log('Успешный ответ:', response.status, response.data);
    navigate('/');
  } catch (error: any) {
    console.error('Ошибка создания поста:', error);

    if (error.response) {
      // Сервер ответил статусом ошибки
      console.error('Ответ сервера:', error.response.status, error.response.data);
      alert(`Ошибка: ${error.response.status} ${error.response.statusText}`);
    } else if (error.request) {
      // Запрос был отправлен, но ответ не получен
      console.error('Нет ответа от сервера');
      alert('Сервер не отвечает');
    } else {
      // Ошибка настройки запроса
      console.error('Ошибка при настройке запроса:', error.message);
      alert('Ошибка при отправке запроса');
    }
  } finally {
    setIsSubmitting(false);
  }
};



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('discount.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        discount: {
          ...prev.discount,
          [key]: key === 'percentage' ? (value ? Number(value) : undefined) : value
        }
      }));
    } else if (name === 'branchIds') {
      setFormData(prev => ({ ...prev, branchIds: parseInt(value) || undefined }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="label">Заголовок</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`input ${errors.title ? 'border-red-500' : ''}`}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div>
        <label className="label">Тип публикации</label>
        <select name="type" value={formData.type} onChange={handleChange} className="input">
          <option value="event">Событие</option>
          <option value="promotion">Акция</option>
          <option value="discount">Скидка</option>
        </select>
      </div>

      <div>
        <label className="label">Описание</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          className={`input ${errors.content ? 'border-red-500' : ''}`}
          rows={5}
        />
        {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
      </div>

      <button type="button" onClick={handleAiHelp} className="btn btn-secondary" disabled={isLoadingAi}>
        {isLoadingAi ? 'Генерация...' : 'ИИ-помощь'}
      </button>

      <div>
        <label className="label">Изображение (URL)</label>
        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="input" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Начало</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`input ${errors.startDate ? 'border-red-500' : ''}`}
          />
          {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
        </div>
        <div>
          <label className="label">Конец</label>
          <input type="date" name="endDate" value={formData.endDate || ''} onChange={handleChange} className="input" />
        </div>
      </div>

      <div>
        <label className="label">Филиал</label>
        <select
          name="branchIds"
          value={formData.branchIds?.toString() || ''}
          onChange={handleChange}
          className={`input ${errors.branchIds ? 'border-red-500' : ''}`}
        >
          <option value="">Выберите филиал</option>
          {branches.map(branch => (
            <option key={branch.id} value={branch.id.toString()}>
              {branch.location}
            </option>
          ))}
        </select>
        {errors.branchIds && <p className="text-red-500 text-sm">{errors.branchIds}</p>}
      </div>

      {formData.type === 'discount' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Процент скидки</label>
            <input
              type="number"
              name="discount.percentage"
              value={formData.discount?.percentage ?? ''}
              onChange={handleChange}
              className={`input ${errors.discountPercentage ? 'border-red-500' : ''}`}
              min={1}
              max={100}
            />
            {errors.discountPercentage && <p className="text-red-500 text-sm">{errors.discountPercentage}</p>}
          </div>
        </div>
      )}

      {formData.type === 'promotion' && (
        <div>
          <label className="label">Код скидки</label>
          <input
            type="text"
            name="discount.code"
            value={formData.discount?.code || ''}
            onChange={handleChange}
            className="input"
          />
        </div>
      )}

      <div className="flex justify-end gap-4">
        <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
          Отмена
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Публикация...' : 'Опубликовать'}
        </button>
      </div>

      {/* Визуальный отладочный вывод */}
      <pre className="bg-gray-100 text-sm mt-8 p-4 rounded whitespace-pre-wrap break-all">
        {JSON.stringify(formData, null, 2)}
      </pre>
    </form>
  );
};

export default PostForm;
