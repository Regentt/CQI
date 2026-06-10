import { useNavigate } from 'react-router-dom'
import { UploadCloud, BarChart2, ClipboardList, ArrowRight, BookOpen } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth' 
import { useState } from 'react'

const ACTIONS = [
  {
    icon: UploadCloud,
    title: 'Upload PDFs',
    desc:  'Upload CQI documents for processing',
    to:    '/upload',
    color: 'bg-sky-50 text-sky-600',
  }, 
  {
    icon: ClipboardList,
    title: 'CQI plans',
    desc:  'Manage improvement action plans',
    to:    '/cqi-plans',
    color: 'bg-amber-50 text-amber-600',
  },
]

export default function HomePage() {
  const { user }  = useAuth()
  console.log("user:", user);
  const navigate  = useNavigate() 
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault() 
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
 
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {/* Welcome back{user?.username ? `, ${user.username}` : ''} */}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          CQI — Continuous Quality Improvement 
        </p>
      </div>
  
      <div> 
        <div className="grid grid-cols-2 gap-3">
          {ACTIONS.map(({ icon: Icon, title, desc, to, color }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="flex items-start gap-3 p-4 bg-white border border-gray-100
                         rounded-xl hover:border-gray-200 hover:shadow-sm transition-all text-left"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}