import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useCrm } from '../context/CrmContext'
import { Save, User, Lock, Bell, Database, Sliders } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function Settings() {
  const { user } = useAuth()
  const { stages } = useCrm()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Profile updated successfully')
  }
  
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Password updated successfully')
  }
  
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Notification preferences updated')
  }
  
  const handleSavePipeline = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Pipeline settings updated')
  }
  
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('General settings updated')
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences.
        </p>
      </motion.div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } mx-6`}
              onClick={() => setActiveTab('profile')}
            >
              <User className="h-4 w-4 inline mr-2" />
              Profile
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'password'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } mx-6`}
              onClick={() => setActiveTab('password')}
            >
              <Lock className="h-4 w-4 inline mr-2" />
              Password
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } mx-6`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell className="h-4 w-4 inline mr-2" />
              Notifications
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pipeline'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } mx-6`}
              onClick={() => setActiveTab('pipeline')}
            >
              <Database className="h-4 w-4 inline mr-2" />
              Pipeline
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } mx-6`}
              onClick={() => setActiveTab('general')}
            >
              <Sliders className="h-4 w-4 inline mr-2" />
              General
            </button>
          </nav>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSaveProfile}
              className="space-y-6"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="ml-5">
                  <button
                    type="button"
                    className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    className="ml-3 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <div className="mt-1">
                    <select
                      id="role"
                      name="role"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue={user?.role}
                      disabled
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="sales">Sales Representative</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                </div>
              </div>
            </motion.form>
          )}
          
          {/* Password Settings */}
          {activeTab === 'password' && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSavePassword}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="current-password"
                      name="current-password"
                      type="password"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="new-password"
                      name="new-password"
                      type="password"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Update Password
                  </button>
                </div>
              </div>
            </motion.form>
          )}
          
          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSaveNotifications}
              className="space-y-6"
            >
              <fieldset>
                <legend className="text-base font-medium text-gray-900">Email Notifications</legend>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="new-deal"
                        name="new-deal"
                        type="checkbox"
                        defaultChecked
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="new-deal" className="font-medium text-gray-700">
                        New deal created
                      </label>
                      <p className="text-gray-500">Get notified when a new deal is created.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="deal-stage"
                        name="deal-stage"
                        type="checkbox"
                        defaultChecked
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="deal-stage" className="font-medium text-gray-700">
                        Deal stage changes
                      </label>
                      <p className="text-gray-500">Get notified when a deal changes stage.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="new-contact"
                        name="new-contact"
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="new-contact" className="font-medium text-gray-700">
                        New contact added
                      </label>
                      <p className="text-gray-500">Get notified when a new contact is added.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="activity-reminder"
                        name="activity-reminder"
                        type="checkbox"
                        defaultChecked
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="activity-reminder" className="font-medium text-gray-700">
                        Activity reminders
                      </label>
                      <p className="text-gray-500">Get reminders for upcoming activities.</p>
                    </div>
                  </div>
                </div>
              </fieldset>
              
              <fieldset>
                <legend className="text-base font-medium text-gray-900">Notification Frequency</legend>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="freq-realtime"
                      name="notification-frequency"
                      type="radio"
                      defaultChecked
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                    />
                    <label htmlFor="freq-realtime" className="ml-3 block text-sm font-medium text-gray-700">
                      Real-time
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="freq-daily"
                      name="notification-frequency"
                      type="radio"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                    />
                    <label htmlFor="freq-daily" className="ml-3 block text-sm font-medium text-gray-700">
                      Daily digest
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="freq-weekly"
                      name="notification-frequency"
                      type="radio"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                    />
                    <label htmlFor="freq-weekly" className="ml-3 block text-sm font-medium text-gray-700">
                      Weekly digest
                    </label>
                  </div>
                </div>
              </fieldset>
              
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                </div>
              </div>
            </motion.form>
          )}
          
          {/* Pipeline Settings */}
          {activeTab === 'pipeline' && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSavePipeline}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Pipeline Stages</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Customize your sales pipeline stages.
                </p>
              </div>
              
              <div className="space-y-4">
                {stages.map((stage, index) => (
                  <div key={stage.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div 
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      ></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <input
                        type="text"
                        defaultValue={stage.name}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="flex-shrink-0">
                      <input
                        type="color"
                        defaultValue={stage.color}
                        className="h-8 w-8 rounded border-gray-300 cursor-pointer"
                      />
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        type="button"
                        className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-gray-400 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        <span className="sr-only">Delete stage</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stage
                </button>
              </div>
              
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                </div>
              </div>
            </motion.form>
          )}
          
          {/* General Settings */}
          {activeTab === 'general' && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSaveGeneral}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">General Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure general application settings.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="company-name"
                      id="company-name"
                      defaultValue="Acme Inc"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                    Currency
                  </label>
                  <div className="mt-1">
                    <select
                      id="currency"
                      name="currency"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue="USD"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                    Timezone
                  </label>
                  <div className="mt-1">
                    <select
                      id="timezone"
                      name="timezone"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue="America/New_York"
                    >
                      <option value="America/New_York">Eastern Time (US & Canada)</option>
                      <option value="America/Chicago">Central Time (US & Canada)</option>
                      <option value="America/Denver">Mountain Time (US & Canada)</option>
                      <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="date-format" className="block text-sm font-medium text-gray-700">
                    Date Format
                  </label>
                  <div className="mt-1">
                    <select
                      id="date-format"
                      name="date-format"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue="MM/DD/YYYY"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  )
}