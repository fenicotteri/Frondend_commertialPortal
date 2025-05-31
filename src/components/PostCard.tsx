import { useEffect, useState, MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import {
  CalendarIcon,
  MapPinIcon,
  TagIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import { Post, BusinessProfile } from '../types'
import { useAuth } from '../context/AuthContext'
import axiosClient from '../context/axiosClient'
import { getBusinessById } from '../context/PostApi'

interface Props {
  post: Post
}

const typeLabel: Record<string, string> = {
  event: 'Событие',
  promotion: 'Акция',
  discount: 'Скидка'
}

const typeColor: Record<string, string> = {
  event: 'bg-purple-100 text-purple-800',
  promotion: 'bg-blue-100 text-blue-800',
  discount: 'bg-green-100 text-green-800'
}

const PostCard = ({ post }: Props) => {
  const navigate = useNavigate()
  const { authState } = useAuth()
  const { isAuthenticated } = authState

  const [business, setBusiness] = useState<BusinessProfile | null>(null)
  const [isFav, setIsFav] = useState(false)

  const fallbackImg =
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1350&q=80'

  useEffect(() => {
    getBusinessById(post.businessId).then(setBusiness).catch(console.error)
  }, [post.businessId])

  useEffect(() => {
    if (!isAuthenticated) return
    axiosClient
      .get<number[]>('/api/Post/favourites')
      .then(r => setIsFav(r.data.includes(post.id)))
      .catch(console.error)
  }, [isAuthenticated, post.id])


  useEffect(() => {
    axiosClient
      .post(`/api/Analitics/${post.id}/view`)
      .catch(err => console.error('Ошибка регистрации просмотра', err))
  }, [post.id])

  const toggleFavourite = async (e: MouseEvent) => {
    e.stopPropagation()
    try {
      if (isFav) {
        await axiosClient.delete(`/api/Post/favourites/${post.id}`)
      } else {
        await axiosClient.post(`/api/Post/favourites/${post.id}`)
      }
      setIsFav(prev => !prev)
    } catch (err) {
      console.error('Ошибка избранного', err)
    }
  }

  if (!business) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  const typeKey = post.type.toLowerCase()
  const showPercent =
    post.discount?.percentage !== undefined && post.discount.percentage > 0

  return (
    <div
      onClick={() => navigate(`/post/${post.id}`)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg"
    >
      <div className="h-80 overflow-hidden">
        <img
          src={post.imageUrl || fallbackImg}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-2 text-base text-gray-700">
          {business.logo && (
            <img
              src={business.logo}
              alt={business.companyName}
              className="h-9 w-9 rounded-full"
            />
          )}
          <span className="font-medium">{business.companyName}</span>
          <span
            className={`ml-auto rounded-full px-3 py-0.5 text-sm font-semibold ${
              typeColor[typeKey] ?? 'bg-gray-100 text-gray-800'
            }`}
          >
            {typeLabel[typeKey] ?? 'Другое'}
          </span>
          {showPercent && (
            <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-sm font-semibold text-red-600">
              {post.discount!.percentage}% OFF
            </span>
          )}
        </div>

        <h3 className="truncate text-xl font-bold">{post.title}</h3>
        <p className="line-clamp-3 text-base text-gray-700">{post.content}</p>

        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center">
            <CalendarIcon className="mr-1 h-5 w-5" />
            <span>
              {format(parseISO(post.startDate), 'dd MMM yyyy')}
              {post.endDate && ` – ${format(parseISO(post.endDate), 'dd MMM yyyy')}`}
            </span>
          </div>

          {post.location && (
            <div className="flex items-center">
              <MapPinIcon className="mr-1 h-5 w-5" />
              <span>{post.location}</span>
            </div>
          )}

          {(showPercent || post.discount?.code) && (
            <div className="flex items-center">
              <TagIcon className="mr-1 h-5 w-5" />
              {showPercent && <span>{post.discount!.percentage}% скидка</span>}
              {post.discount?.code && (
                <span className="ml-1 font-semibold">{post.discount.code}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {isAuthenticated && (
        <button
          onClick={toggleFavourite}
          className={`absolute bottom-4 right-4 rounded-full p-3 ${
            isFav
              ? 'bg-red-100 text-red-600'
              : 'bg-white text-gray-400 shadow hover:text-red-600'
          }`}
          title={isFav ? 'Убрать из избранного' : 'Добавить в избранное'}
        >
          {isFav ? <HeartSolid className="h-6 w-6" /> : <HeartIcon className="h-6 w-6" />}
        </button>
      )}
    </div>
  )
}

export default PostCard
