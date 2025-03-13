import { useState, useMemo } from 'react'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { motion } from 'framer-motion'
import { useCrm } from '../context/CrmContext'
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns'

export default function Analytics() {
  const { deals, stages } = useCrm()
  const [timeRange, setTimeRange] = useState('6months')
  
  // Calculate date range based on selected time range
  const dateRange = useMemo(() => {
    const now = new Date()
    let startDate
    
    switch (timeRange) {
      case '30days':
        startDate = subMonths(now, 1)
        break
      case '3months':
        startDate = subMonths(now, 3)
        break
      case '6months':
        startDate = subMonths(now, 6)
        break
      case '12months':
        startDate = subMonths(now, 12)
        break
      default:
        startDate = subMonths(now, 6)
    }
    
    return { startDate, endDate: now }
  }, [timeRange])
  
  // Generate months for the selected time range
  const months = useMemo(() => {
    return eachMonthOfInterval({
      start: startOfMonth(dateRange.startDate),
      end: endOfMonth(dateRange.endDate)
    })
  }, [dateRange])
  
  // Calculate deals by stage
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
  
  // Calculate deal values by stage
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
  
  // Calculate monthly deal values
  const monthlyDealValues = useMemo(() => {
    const monthlyData = months.map(month => {
      const monthStart = startOfMonth(month)
      const monthEnd = endOfMonth(month)
      const monthDeals = deals.filter(deal => {
        const dealDate = new Date(deal.createdAt)
        return dealDate >= monthStart && dealDate <= monthEnd
      })
      
      const totalValue = monthlyDeals.reduce((sum, deal) => sum + deal.value, 0)
      const wonValue = monthlyDeals
        .filter(deal => deal.stage === 'closed')
        .reduce((sum, deal) => sum + deal.value, 0)
      
      return {
        name: format(month, 'MMM yyyy'),
        total: totalValue,
        won: wonValue
      }
    })
    
    return monthlyData
  }, [deals, months])
  
  // Calculate conversion rates
  const conversionRates = useMemo(() => {
    const stageTransitions = []
    
    for (let i = 0; i < stages.length - 1; i++) {
      const currentStage = stages[i]
      const nextStage = stages[i + 1]
      
      const dealsInCurrentStage = deals.filter(deal => deal.stage === currentStage.id).length
      const dealsInNextStage = deals.filter(deal => deal.stage === nextStage.id).length
      
      const conversionRate = dealsInCurrentStage > 0 
        ? Math.round((dealsInNextStage / dealsInCurrentStage) * 100) 
        : 0
      
      stageTransitions.push({
        name: `${currentStage.name} → ${nextStage.name}`,
        rate: conversionRate,
        color: currentStage.color
      })
    }
    
    return stageTransitions
  }, [deals, stages])

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center"
      >
        <h2 className="text-xl font-semibold text-gray-800">Sales Analytics</h2>
        
        <div>
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
        </div>
      </motion.div>
      
      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Deals</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{deals.length}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Value</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              ${deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
            </dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Average Deal Size</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              ${deals.length > 0 
                ? Math.round(deals.reduce((sum, deal) => sum + deal.value, 0) / deals.length).toLocaleString() 
                : 0}
            </dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Win Rate</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {deals.length > 0 
                ? Math.round((deals.filter(deal => deal.stage === 'closed').length / deals.length) * 100)
                : 0}%
            </dd>
          </div>
        </div>
      </motion.div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Monthly Deal Value</h3>
            <div className="mt-2 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyDealValues}
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
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                  <Legend />
                  <Line type="monotone" dataKey="total" name="Total Value" stroke="#0284C7" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="won" name="Won Value" stroke="#10B981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Deal Value by Stage</h3>
            <div className="mt-2 h-80">
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
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Deals by Stage</h3>
            <div className="mt-2 h-80">
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
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Stage Conversion Rates</h3>
            <div className="mt-2 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={conversionRates}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                  <Bar dataKey="rate" name="Conversion Rate">
                    {conversionRates.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}