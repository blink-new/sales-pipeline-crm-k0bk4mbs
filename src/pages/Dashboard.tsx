import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowRight 
} from 'lucide-react'
import { motion } from 'framer-motion'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { useCrm } from '../context/CrmContext'
import { format } from 'date-fns'

export default function Dashboard() {
  const { deals, contacts, activities, stages } = useCrm()
  
  // Calculate key metrics
  const totalDeals = deals.length
  const totalContacts = contacts.length
  const totalDealValue = useMemo(() => 
    deals.reduce((sum, deal) => sum + deal.value, 0), 
    [deals]
  )
  const wonDeals = useMemo(() => 
    deals.filter(deal => deal.stage === 'closed').length, 
    [deals]
  )
  
  // Calculate deals by stage for pie chart
  const dealsByStage = useMemo(() => {
    const stageMap = new Map()
    
    stages.forEach(stage => {
      stageMap.set(stage.id, {
        name: stage.name,
        value: 0,
        color: stage.color
      })
    })
    
    deals.forEach(deal => {
      const stage = stageMap.get(deal.stage)
      if (stage) {
        stage.value++
      }
    })
    
    return Array.from(stageMap.values())
  }, [deals, stages])
  
  // Calculate deal values by stage for bar chart
  const dealValuesByStage = useMemo(() => {
    const stageMap = new Map()
    
    stages.forEach(stage => {
      stageMap.set(stage.id, {
        name: stage.name,
        value: 0,
        color: stage.color
      })
    })
    
    deals.forEach(deal => {
      const stage = stageMap.get(deal.stage)
      if (stage) {
        stage.value += deal.value
      }
    })
    
    return Array.from(stageMap.values())
  }, [deals, stages])
  
  // Get upcoming activities
  const upcomingActivities = useMemo(() => {
    const now = new Date()
    return activities
      .filter(activity => !activity.completed && new Date(activity.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5)
  }, [activities])
  
  // Get recent deals
  const recentDeals = useMemo(() => {
    return [...deals]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
  }, [deals])

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Deals</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{totalDeals}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/pipeline" className="font-medium text-primary-600 hover:text-primary-500 flex items-center">
                View pipeline
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Contacts</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{totalContacts}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/contacts" className="font-medium text-primary-600 hover:text-primary-500 flex items-center">
                View contacts
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Deal Value</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">${totalDealValue.toLocaleString()}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/analytics" className="font-medium text-primary-600 hover:text-primary-500 flex items-center">
                View analytics
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Win Rate</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/analytics" className="font-medium text-primary-600 hover:text-primary-500 flex items-center">
                View details
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Deals by Stage</h3>
            <div className="mt-2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dealsByStage}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {dealsByStage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} deals`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Deal Value by Stage</h3>
            <div className="mt-2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dealValuesByStage}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                  <Bar dataKey="value" name="Value">
                    {dealValuesByStage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent and Upcoming */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Deals</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {recentDeals.map((deal) => (
                <li key={deal.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="truncate">
                      <p className="text-sm font-medium text-primary-600 truncate">{deal.name}</p>
                      <p className="mt-1 flex items-center text-sm text-gray-500">
                        <DollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span className="truncate">${deal.value.toLocaleString()}</span>
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        style={{ 
                          backgroundColor: stages.find(s => s.id === deal.stage)?.color + '20',
                          color: stages.find(s => s.id === deal.stage)?.color
                        }}
                      >
                        {stages.find(s => s.id === deal.stage)?.name}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
              {recentDeals.length === 0 && (
                <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                  No recent deals
                </li>
              )}
            </ul>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/pipeline" className="font-medium text-primary-600 hover:text-primary-500 flex items-center justify-center">
                View all deals
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Activities</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {upcomingActivities.map((activity) => (
                <li key={activity.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="truncate">
                      <p className="text-sm font-medium text-primary-600 truncate">{activity.title}</p>
                      <p className="mt-1 flex items-center text-sm text-gray-500">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span className="truncate">{format(new Date(activity.date), 'MMM d, yyyy h:mm a')}</span>
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {activity.type}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
              {upcomingActivities.length === 0 && (
                <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                  No upcoming activities
                </li>
              )}
            </ul>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/activities" className="font-medium text-primary-600 hover:text-primary-500 flex items-center justify-center">
                View all activities
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}