import { createContext, useContext, useState, ReactNode } from 'react'

// Types
export type Contact = {
  id: string
  name: string
  email: string
  phone: string
  company: string
  position: string
  status: 'lead' | 'customer' | 'churned'
  tags: string[]
  assignedTo: string
  lastContacted: Date
  createdAt: Date
}

export type Deal = {
  id: string
  name: string
  value: number
  stage: string
  probability: number
  expectedCloseDate: Date
  contacts: string[]
  assignedTo: string
  notes: string
  createdAt: Date
  updatedAt: Date
}

export type PipelineStage = {
  id: string
  name: string
  order: number
  color: string
}

export type Activity = {
  id: string
  type: 'call' | 'email' | 'meeting' | 'task'
  title: string
  description: string
  date: Date
  completed: boolean
  relatedTo: { type: 'deal' | 'contact', id: string }
  assignedTo: string
  createdAt: Date
}

type CrmContextType = {
  contacts: Contact[]
  deals: Deal[]
  stages: PipelineStage[]
  activities: Activity[]
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => void
  updateContact: (id: string, contact: Partial<Contact>) => void
  deleteContact: (id: string) => void
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateDeal: (id: string, deal: Partial<Deal>) => void
  deleteDeal: (id: string) => void
  moveDeal: (dealId: string, newStage: string) => void
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void
  updateActivity: (id: string, activity: Partial<Activity>) => void
  deleteActivity: (id: string) => void
}

const CrmContext = createContext<CrmContextType | undefined>(undefined)

// Mock data
const mockStages: PipelineStage[] = [
  { id: 'lead', name: 'Lead', order: 1, color: '#38BDF8' },
  { id: 'qualified', name: 'Qualified', order: 2, color: '#818CF8' },
  { id: 'proposal', name: 'Proposal', order: 3, color: '#C084FC' },
  { id: 'negotiation', name: 'Negotiation', order: 4, color: '#F472B6' },
  { id: 'closed', name: 'Closed Won', order: 5, color: '#34D399' },
  { id: 'lost', name: 'Closed Lost', order: 6, color: '#F87171' }
]

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '(555) 123-4567',
    company: 'Acme Inc',
    position: 'CTO',
    status: 'lead',
    tags: ['tech', 'enterprise'],
    assignedTo: '1',
    lastContacted: new Date('2023-05-15'),
    createdAt: new Date('2023-04-10')
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    phone: '(555) 987-6543',
    company: 'XYZ Corp',
    position: 'CEO',
    status: 'customer',
    tags: ['finance', 'enterprise'],
    assignedTo: '1',
    lastContacted: new Date('2023-05-20'),
    createdAt: new Date('2023-03-15')
  },
  {
    id: '3',
    name: 'Carol Williams',
    email: 'carol@example.com',
    phone: '(555) 456-7890',
    company: 'ABC Ltd',
    position: 'Marketing Director',
    status: 'lead',
    tags: ['marketing', 'mid-market'],
    assignedTo: '1',
    lastContacted: new Date('2023-05-18'),
    createdAt: new Date('2023-05-01')
  }
]

const mockDeals: Deal[] = [
  {
    id: '1',
    name: 'Acme Inc Software Implementation',
    value: 25000,
    stage: 'qualified',
    probability: 60,
    expectedCloseDate: new Date('2023-07-15'),
    contacts: ['1'],
    assignedTo: '1',
    notes: 'Need to follow up on technical requirements',
    createdAt: new Date('2023-05-01'),
    updatedAt: new Date('2023-05-10')
  },
  {
    id: '2',
    name: 'XYZ Corp Enterprise Plan',
    value: 50000,
    stage: 'proposal',
    probability: 75,
    expectedCloseDate: new Date('2023-06-30'),
    contacts: ['2'],
    assignedTo: '1',
    notes: 'Proposal sent, awaiting feedback',
    createdAt: new Date('2023-04-15'),
    updatedAt: new Date('2023-05-15')
  },
  {
    id: '3',
    name: 'ABC Ltd Marketing Campaign',
    value: 15000,
    stage: 'lead',
    probability: 30,
    expectedCloseDate: new Date('2023-08-01'),
    contacts: ['3'],
    assignedTo: '1',
    notes: 'Initial discussion about marketing needs',
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-05-10')
  },
  {
    id: '4',
    name: 'Global Industries Partnership',
    value: 100000,
    stage: 'negotiation',
    probability: 90,
    expectedCloseDate: new Date('2023-06-15'),
    contacts: ['1'],
    assignedTo: '1',
    notes: 'Final contract details being negotiated',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-05-18')
  },
  {
    id: '5',
    name: 'TechStart Annual Subscription',
    value: 12000,
    stage: 'closed',
    probability: 100,
    expectedCloseDate: new Date('2023-05-15'),
    contacts: ['2'],
    assignedTo: '1',
    notes: 'Deal closed successfully',
    createdAt: new Date('2023-04-01'),
    updatedAt: new Date('2023-05-15')
  }
]

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'call',
    title: 'Initial discovery call',
    description: 'Discuss needs and potential solutions',
    date: new Date('2023-05-20T10:00:00'),
    completed: true,
    relatedTo: { type: 'deal', id: '1' },
    assignedTo: '1',
    createdAt: new Date('2023-05-15')
  },
  {
    id: '2',
    type: 'email',
    title: 'Send proposal',
    description: 'Follow up with detailed proposal',
    date: new Date('2023-05-25T14:00:00'),
    completed: false,
    relatedTo: { type: 'deal', id: '2' },
    assignedTo: '1',
    createdAt: new Date('2023-05-18')
  },
  {
    id: '3',
    type: 'meeting',
    title: 'Contract negotiation',
    description: 'Finalize contract terms',
    date: new Date('2023-05-30T11:00:00'),
    completed: false,
    relatedTo: { type: 'deal', id: '4' },
    assignedTo: '1',
    createdAt: new Date('2023-05-20')
  }
]

export function CrmProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [deals, setDeals] = useState<Deal[]>(mockDeals)
  const [stages] = useState<PipelineStage[]>(mockStages)
  const [activities, setActivities] = useState<Activity[]>(mockActivities)

  // Contact functions
  const addContact = (contact: Omit<Contact, 'id' | 'createdAt'>) => {
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    setContacts([...contacts, newContact])
  }

  const updateContact = (id: string, updatedContact: Partial<Contact>) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, ...updatedContact } : contact
    ))
  }

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id))
  }

  // Deal functions
  const addDeal = (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date()
    const newDeal: Deal = {
      ...deal,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now
    }
    setDeals([...deals, newDeal])
  }

  const updateDeal = (id: string, updatedDeal: Partial<Deal>) => {
    setDeals(deals.map(deal => 
      deal.id === id ? { ...deal, ...updatedDeal, updatedAt: new Date() } : deal
    ))
  }

  const deleteDeal = (id: string) => {
    setDeals(deals.filter(deal => deal.id !== id))
  }

  const moveDeal = (dealId: string, newStage: string) => {
    setDeals(deals.map(deal => 
      deal.id === dealId ? { ...deal, stage: newStage, updatedAt: new Date() } : deal
    ))
  }

  // Activity functions
  const addActivity = (activity: Omit<Activity, 'id' | 'createdAt'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    setActivities([...activities, newActivity])
  }

  const updateActivity = (id: string, updatedActivity: Partial<Activity>) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, ...updatedActivity } : activity
    ))
  }

  const deleteActivity = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id))
  }

  return (
    <CrmContext.Provider value={{
      contacts,
      deals,
      stages,
      activities,
      addContact,
      updateContact,
      deleteContact,
      addDeal,
      updateDeal,
      deleteDeal,
      moveDeal,
      addActivity,
      updateActivity,
      deleteActivity
    }}>
      {children}
    </CrmContext.Provider>
  )
}

export function useCrm() {
  const context = useContext(CrmContext)
  if (context === undefined) {
    throw new Error('useCrm must be used within a CrmProvider')
  }
  return context
}