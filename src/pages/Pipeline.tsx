import { useState, useMemo } from 'react'
import { 
  DndContext, 
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core'
import { 
  SortableContext, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { motion } from 'framer-motion'
import { 
  Search, 
  Plus, 
  Filter, 
  SlidersHorizontal,
  DollarSign,
  Calendar,
  User
} from 'lucide-react'
import { useCrm, Deal, PipelineStage } from '../context/CrmContext'
import { format } from 'date-fns'

// Components for the Kanban board
function DealCard({ deal, stage }: { deal: Deal, stage: PipelineStage }) {
  return (
    <div 
      className="bg-white p-4 rounded-md shadow-sm border border-gray-200 mb-3 cursor-move hover:shadow-md transition-shadow"
    >
      <h3 className="font-medium text-gray-900 mb-1">{deal.name}</h3>
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
        <span>${deal.value.toLocaleString()}</span>
      </div>
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
        <span>{format(new Date(deal.expectedCloseDate), 'MMM d, yyyy')}</span>
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <User className="h-4 w-4 mr-1 text-gray-400" />
        <span>John Doe</span>
      </div>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className="h-1.5 rounded-full" 
          style={{ width: `${deal.probability}%`, backgroundColor: stage.color }}
        ></div>
      </div>
    </div>
  )
}

function StageColumn({ stage, deals }: { stage: PipelineStage, deals: Deal[] }) {
  return (
    <div className="w-72 flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900 flex items-center">
          <span 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: stage.color }}
          ></span>
          {stage.name}
        </h3>
        <span className="text-sm text-gray-500">{deals.length}</span>
      </div>
      <div 
        className="bg-gray-50 p-2 rounded-md h-[calc(100vh-220px)] overflow-y-auto"
        style={{ minHeight: '300px' }}
      >
        <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map(deal => (
            <DealCard key={deal.id} deal={deal} stage={stage} />
          ))}
        </SortableContext>
        
        {deals.length === 0 && (
          <div className="flex items-center justify-center h-20 border-2 border-dashed border-gray-200 rounded-md">
            <p className="text-sm text-gray-500">No deals</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Pipeline() {
  const { deals, stages, moveDeal } = useCrm()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeDealId, setActiveDealId] = useState<string | null>(null)
  
  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  
  // Filter deals based on search term
  const filteredDeals = useMemo(() => {
    if (!searchTerm) return deals
    
    return deals.filter(deal => 
      deal.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [deals, searchTerm])
  
  // Group deals by stage
  const dealsByStage = useMemo(() => {
    const grouped = new Map<string, Deal[]>()
    
    stages.forEach(stage => {
      grouped.set(stage.id, [])
    })
    
    filteredDeals.forEach(deal => {
      const stageDeals = grouped.get(deal.stage) || []
      stageDeals.push(deal)
      grouped.set(deal.stage, stageDeals)
    })
    
    return grouped
  }, [filteredDeals, stages])
  
  // Get the active deal for drag overlay
  const activeDeal = useMemo(() => {
    if (!activeDealId) return null
    return deals.find(deal => deal.id === activeDealId) || null
  }, [activeDealId, deals])
  
  // Get the stage for the active deal
  const activeDealStage = useMemo(() => {
    if (!activeDeal) return null
    return stages.find(stage => stage.id === activeDeal.stage) || null
  }, [activeDeal, stages])
  
  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveDealId(active.id as string)
  }
  
  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const dealId = active.id as string
      const newStageId = over.id as string
      
      // Check if the over ID is a stage ID
      if (stages.some(stage => stage.id === newStageId)) {
        moveDeal(dealId, newStageId)
      }
    }
    
    setActiveDealId(null)
  }

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
            placeholder="Search deals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Sort
          </button>
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Deal
          </button>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="overflow-x-auto pb-4"
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex space-x-4 min-w-max">
            {stages.map(stage => (
              <StageColumn 
                key={stage.id} 
                stage={stage} 
                deals={dealsByStage.get(stage.id) || []} 
              />
            ))}
          </div>
          
          <DragOverlay>
            {activeDeal && activeDealStage && (
              <div className="w-72">
                <DealCard deal={activeDeal} stage={activeDealStage} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </motion.div>
    </div>
  )
}