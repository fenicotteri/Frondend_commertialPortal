import React, { useEffect, useMemo, useState } from 'react';
import EventCard from '../components/PostCard';
import BranchCard from '../components/BranchCard';
import { Calendar, Building2, Tag, Search } from 'lucide-react';
import './HomePage.css';
import { BusinessBranch } from '../types';
import axios from 'axios';

import { useAppDispatch, useAppSelector } from '../Store/hooks';
import { setPosts} from '../Store/postsSlice';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const allPosts = useAppSelector((state) => state.posts.allPosts);
  const [branches, setBranches] = useState<BusinessBranch[]>([]);
  const [filter, setFilter] = useState<'all' | 'events' | 'promotions' | 'discounts' | 'branches'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postsRes, branchesRes] = await Promise.all([
          axios.get('http://localhost:5083/api/Post'),
          axios.get('http://localhost:5083/api/branch')
        ]);

        dispatch(setPosts(postsRes.data));
        setBranches(branchesRes.data ?? []);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const filteredItems = useMemo(() => {
    const safePosts = Array.isArray(allPosts) ? allPosts : [];
    const safeBranches = Array.isArray(branches) ? branches : [];

    let filteredPosts = safePosts;
    let filteredBranches = safeBranches;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filteredPosts = filteredPosts.filter(event =>
        (event.title || '').toLowerCase().includes(term) ||
        (event.content || '').toLowerCase().includes(term)
      );
      filteredBranches = filteredBranches.filter(branch =>
        (branch.description || '').toLowerCase().includes(term) ||
        (branch.location || '').toLowerCase().includes(term)
      );
    }

    switch (filter) {
      case 'events':
        return { events: filteredPosts.filter(e => (e.type || '').toLowerCase() === 'event'), branches: [] };
      case 'promotions':
        return { events: filteredPosts.filter(e => (e.type || '').toLowerCase() === 'promotion'), branches: [] };
      case 'discounts':
        return { events: filteredPosts.filter(e => (e.type || '').toLowerCase() === 'discount'), branches: [] };
      case 'branches':
        return { events: [], branches: filteredBranches };
      default:
        return { events: filteredPosts, branches: filteredBranches };
    }
  }, [allPosts, branches, filter, searchTerm]);

  const { events: displayEvents, branches: displayBranches } = filteredItems;

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Афиша Ростова-на-Дону</h1>
        <p>Самые интересные события, скидки, акции и места</p>
      </div>

      <div className="home-search">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Поиск..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="home-filters">
        <button onClick={() => setFilter('all')} className={`filter-button ${filter === 'all' ? 'active' : ''}`}>Все</button>
        <button onClick={() => setFilter('events')} className={`filter-button ${filter === 'events' ? 'active' : ''}`}>
          <Calendar size={16} className="filter-icon" /> События
        </button>
        <button onClick={() => setFilter('promotions')} className={`filter-button ${filter === 'promotions' ? 'active' : ''}`}>
          <Tag size={16} className="filter-icon" /> Акции
        </button>
        <button onClick={() => setFilter('discounts')} className={`filter-button ${filter === 'discounts' ? 'active' : ''}`}>
          <Tag size={16} className="filter-icon" /> Скидки
        </button>
        <button onClick={() => setFilter('branches')} className={`filter-button ${filter === 'branches' ? 'active' : ''}`}>
          <Building2 size={16} className="filter-icon" /> Филиалы
        </button>
      </div>

      <div className="home-content">
        {loading ? (
          <div className="home-empty"><p>Загрузка...</p></div>
        ) : error ? (
          <div className="home-empty"><p>{error}</p></div>
        ) : (displayEvents.length === 0 && displayBranches.length === 0) ? (
          <div className="home-empty"><p>Нет контента</p></div>
        ) : (
          <div className="home-grid">
            {displayEvents.map(event => (
              <EventCard key={event.id} post={event} />
            ))}
            {displayBranches.map(branch => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
