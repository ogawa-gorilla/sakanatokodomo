export interface Event {
    id: string
    title: string
    description: string
    date: string
    spareDate?: string
    startTime: string
    endTime: string
    staffStartTime: string
    location: string
    address: string
    lat?: number
    lng?: number
    category: string
    currentParticipants: number
    currentStaffs: number
    organizer: string
    contactEmail: string
    requirements: string[]
}
