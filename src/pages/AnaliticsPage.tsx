// src/pages/AnalyticsPage.tsx

import { useEffect, useState } from 'react';
import { BarChart, Calendar, Tag } from 'lucide-react';
import axiosClient from '../context/axiosClient';

interface PostAnaliticsDto {
  title: string;
  type: 'event' | 'promotion' | 'discount';
  guestLikes: number;
  subscriberLikes: number;
  guestViews: number;
  subscriberViews: number;
  promosCopied: number;
}

interface BusinessAnaliticsDto {
  totalGuestLikes: number;
  totalSubscriberLikes: number;
  totalGuestViews: number;
  totalSubscriberViews: number;
  totalPromosCopied: number;
  totalLikes: number;
  totalViews: number;
  subscribersCount: number;
  postAnalitics: PostAnaliticsDto[];
}

const AnalyticsPage = () => {
  const [data, setData] = useState<BusinessAnaliticsDto | null>(null);
  const [filter, setFilter] = useState<'all' | 'event' | 'promotion' | 'discount'>('all');

  useEffect(() => {
    axiosClient.get<BusinessAnaliticsDto>('/api/Analitics')
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) return <div className="p-6">Загрузка...</div>;

  const filteredPosts = data.postAnalitics.filter(e => filter === 'all' || e.type === filter);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart size={28} />
          Панель аналитики
        </h1>
        <p className="text-gray-600">Отслеживайте эффективность публикаций</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Metric title="Просмотры" value={data.totalViews} />
        <Metric title="Избранное" value={data.totalLikes} />
        <Metric title="Скопировано промокодов" value={data.totalPromosCopied} />
        <Metric title="Подписчиков" value={data.subscribersCount} />
        <Metric title="Лайков от подписчиков" value={data.totalSubscriberLikes} />
        <Metric title="Лайков от гостей" value={data.totalGuestLikes} />
        <Metric title="Просмотров от подписчиков" value={data.totalSubscriberViews} />
        <Metric title="Просмотров от гостей" value={data.totalGuestViews} />
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {['all', 'event', 'promotion', 'discount'].map(f => (
          <button key={f}
                  onClick={() => setFilter(f as any)}
                  className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}>
            {f === 'event' ? <Calendar size={16} className="inline mr-1" /> : null}
            {f === 'promotion' || f === 'discount' ? <Tag size={16} className="inline mr-1" /> : null}
            {f === 'all' ? 'Все' : f === 'event' ? 'События' : f === 'promotion' ? 'Акции' : 'Скидки'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPosts.map(e => (
          <div key={e.title} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-lg mb-1">{e.title}</h3>
            <p className="text-sm text-gray-500 mb-1">Тип: {e.type}</p>
            <p className="text-sm">
              Просмотры: {e.guestViews + e.subscriberViews}, Избранное: {e.guestLikes + e.subscriberLikes}, Скопировано: {e.promosCopied}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Metric = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-white p-5 rounded shadow">
    <div className="text-indigo-600 text-lg mb-1">{title}</div>
    <div className="text-3xl font-bold">{value}</div>
  </div>
);

export default AnalyticsPage;
