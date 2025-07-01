export interface CertificateRequest {
    id: string
    name: string
    address: string
    eventName: string
    location: string
    eventDate: string
    eventTime: string
    status: 'pending' | 'completed'
    createdAt: string
}

export type CertificateRequestStatus = 'pending' | 'completed'
