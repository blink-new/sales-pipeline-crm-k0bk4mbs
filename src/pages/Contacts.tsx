import { useState, useMemo } from 'react'
import { 
  Search, 
  Plus, 
  Filter, 
  Mail, 
  Phone, 
  Building, 
  Tag,
  MoreHorizontal,
  Edit,
  Trash,
  UserPlus
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useCrm, Contact } from '../context/CrmContext'
import { format } from 'date-fns'

function ContactCard({ contact }: { contact: Contact }) {
  const statusColors = {
    lead: 'bg-blue-100 text-blue-800',
    customer: 'bg-green-100 text-green-800',
    churned: 'bg-red-100 text-red-800'
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-semibold">
              {contact.name.charAt(0)}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
              <p className="text-sm text-gray-500">{contact.position} at {contact.company}</p>
            </div>
          </div>
          <div className="relative">
            <button className="text-gray-400 hover:text-gray-500">
              <MoreHorizontal className="h-5 w-5" />
            </button>
            {/* Dropdown menu would go here */}
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 gap-2">
          <div className="flex items-center text-sm text-gray-500">
            <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            <span className="truncate">{contact.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            <span>{contact.phone}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Building className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            <span>{contact.company}</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[contact.status]}`}>
            {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
          </span>
          <div className="ml-2 flex flex-wrap gap-1">
            {contact.tags.map((tag, index) => (
              <span key={index} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          Last contacted: {format(new Date(contact.lastContacted), 'MMM d, yyyy')}
        </div>
      </div>
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
        <div className="flex justify-end space-x-2">
          <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </button>
          <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <UserPlus className="h-3 w-3 mr-1" />
            Add Deal
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Contacts() {
  const { contacts } = useCrm()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  
  // Filter contacts based on search term and status
  const filteredContacts = useMemo(() => {
    let filtered = contacts
    
    if (searchTerm) {
      filtered = filtered.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(contact => contact.status === selectedStatus)
    }
    
    return filtered
  }, [contacts, searchTerm, selectedStatus])

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
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="lead">Leads</option>
            <option value="customer">Customers</option>
            <option value="churned">Churned</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </button>
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </button>
        </div>
      </motion.div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-4">
          Showing {filteredContacts.length} contacts
        </p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
          
          {filteredContacts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow">
              <Tag className="h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}