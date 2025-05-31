import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessProfile } from '../types';

interface BusinessFormProps {
  business: BusinessProfile;
}

const BusinessForm = ({ business }: BusinessFormProps) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<BusinessProfile>({ ...business });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors['companyName'] = 'Название бизнеса обязательно';
    }
    if (!formData.description?.trim()) {
      newErrors['description'] = 'Описание обязательно';
    }
    if (!formData.contactInfo?.email?.trim()) {
      newErrors['contactInfo.email'] = 'Email обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Здесь должно быть сохранение через API (например updateBusiness(formData))
    navigate(`/business/${business.id}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('contactInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="companyName" className="label">Название бизнеса</label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className={`input ${errors['companyName'] ? 'border-red-500' : ''}`}
        />
        {errors['companyName'] && <p className="text-red-500 text-sm mt-1">{errors['companyName']}</p>}
      </div>

      <div>
        <label htmlFor="logo" className="label">URL логотипа (необязательно)</label>
        <input
          type="text"
          id="logo"
          name="logo"
          value={formData.logo || ''}
          onChange={handleChange}
          className="input"
          placeholder="Введите URL логотипа"
        />
      </div>

      <div>
        <label htmlFor="description" className="label">Описание</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`input ${errors['description'] ? 'border-red-500' : ''}`}
        />
        {errors['description'] && <p className="text-red-500 text-sm mt-1">{errors['description']}</p>}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Контактная информация</h3>

        <div>
          <label htmlFor="contactInfo.email" className="label">Email</label>
          <input
            type="email"
            id="contactInfo.email"
            name="contactInfo.email"
            value={formData.contactInfo?.email || ''}
            onChange={handleChange}
            className={`input ${errors['contactInfo.email'] ? 'border-red-500' : ''}`}
          />
          {errors['contactInfo.email'] && <p className="text-red-500 text-sm mt-1">{errors['contactInfo.email']}</p>}
        </div>

        <div>
          <label htmlFor="contactInfo.phone" className="label">Телефон (необязательно)</label>
          <input
            type="text"
            id="contactInfo.phone"
            name="contactInfo.phone"
            value={formData.contactInfo?.phone || ''}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label htmlFor="contactInfo.website" className="label">Веб-сайт (необязательно)</label>
          <input
            type="text"
            id="contactInfo.website"
            name="contactInfo.website"
            value={formData.contactInfo?.website || ''}
            onChange={handleChange}
            className="input"
            placeholder="www.example.com"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate(`/business/${business.id}`)}
          className="btn btn-secondary"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Сохранить изменения
        </button>
      </div>
    </form>
  );
};

export default BusinessForm;
