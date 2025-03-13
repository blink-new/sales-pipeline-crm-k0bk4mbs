import { useState, useMemo } from 'react'
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  Users, 
  FileText,
  CheckSquare
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useCrm, Activity } from '../context/CrmContext'
import { format, isToday, isPast, isFuture, isThisWeek, isThisMonth } from 'date-fns'

function ActivityItem({ activity }: { activity: Activity }) {
  const { deals, contacts, updateActivity } = useCrm()
  
  // Get related entity name
  const relatedName = useMemo(() => {
    if (activity.relatedTo.type === 'deal') {
      const deal = deals.find(d => d.id === activity.relatedTo.id)
      return deal ? deal.name : 'Unknown Deal'
    } else {
      const contact = contacts.find(c => c.id === activity.relatedTo.id)
      return contact ? contact.name : 'Unknown Contact'
    }
  }, [activity, deals, contacts])
  
  // Activity type icon
  const ActivityIcon = useMemo(() => {
    switch (activity.type) {
      case 'call':
        return Phone
      case 'email':
        return Mail
      case 'meeting':
        return Users
      case 'task':
        return FileText
      default:
        return Clock
    }
  }, [activity.type])
  
  // Handle toggle completion
  const handleToggleComplete = () => {
    updateActivity(activity.id, { completed: !activity.completed })
  }
  
  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow ${
      activity.completed ? 'opacity-75' : ''
    }`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className={`p-2 rounded-full ${
              activity.completed 
                ? 'bg-green-100 text-green-600' 
                : isPast(new Date(activity.date))
                  ? 'bg-red-100 text-red-600'
                  : 'bg-blue-100 text-blue-600'
            }`}>
              <ActivityIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-medium ${
                activity.completed ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}>
                {activity.title}
              </h3>
              <button
                onClick={handleToggleComplete}
                className={`p-1 rounded-full ${
                  activity.completed 
                    ? 'text-green-600 hover:bg-green-50' 
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                <CheckSquare className="h-5 w-5" />
              </button>
            </div>
            
            <p className="mt-1 text-sm text-gray-500">{activity.description}</p>
            
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span>{format(new Date(activity.date), 'MMM d, yyyy h:mm a')}</span>
              
              {isToday(new Date(activity.date)) && (
                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  Today
                </span>
              )}
              
              {isPast(new Date(activity.date)) && !activity.completed && !isToday(new Date(activity.date)) && (
                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  Overdue
                </span>
              )}
            </div>
            
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className="font-medium text-gray-900">Related to:</span>
              <span className="ml-1">{relatedName}</span>
              <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                {activity.relatedTo.type}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Activities() {
  const { activities } = useCrm()
  const [searchTerm, setSearchTerm] = useState('')
  const [timeFilter, setTimeFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Filter activities based on search term and filters
  const filteredActivities = useMemo(() => {
    let filtered = activities
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date()
      
      switch (timeFilter) {
        case 'today':
          filtered = filtered.filter(activity => isToday(new Date(activity.date)))
          break
        case 'thisWeek':
          filtered = filtered.filter(activity => isThisWeek(new Date(activity.date)))
          break
        case 'thisMonth':
          filtered = filtered.filter(activity => isThisMonth(new Date(activity.date)))
          break
        case 'overdue':
          filtered = filtered.filter(activity => 
            isPast(new Date(activity.date)) && !activity.completed && !isToday(new Date(activity.date))
          )
          break
        case 'upcoming':
          filtered = filtered.filter(activity => 
            isFuture(new Date(activity.date)) || isToday(new Date(activity.date))
          )
          break
      }
    }
    
    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(activity => activity.type === typeFilter)
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(activity => 
        statusFilter === 'completed' ? activity.completed : !activity.completed
      )
    }
    
    // Sort by date
    return [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [activities, searchTerm, timeFilter, typeFilter, statusFilter])

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="relative rounded-md shadow-sm max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </button>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white p-4 shadow rounded-lg"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="time-filter" className="block text-sm font-medium text-gray-700">Time</label>
            <select
              id="time-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="overdue">Overdue</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700">Type</label>
            <select
              id="type-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="call">Calls</option>
              <option value="email">Emails</option>
              <option value="meeting">Meetings</option>
              <option value="task">Tasks</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </motion.div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-4">
          Showing {filteredActivities.length} activities
        </p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {filteredActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
          
          {filteredActivities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow">
              <CalendarIcon className="h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No activities found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}