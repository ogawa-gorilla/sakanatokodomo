'use client'

import { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'

interface GoogleMapProps {
    address: string
    location: string
    className?: string
}

export default function GoogleMap({
    address,
    location,
    className = '',
}: GoogleMapProps) {
    const [mapUrl, setMapUrl] = useState('')

    useEffect(() => {
        // 住所とロケーション名を組み合わせてGoogleマップのURLを生成
        const searchQuery = encodeURIComponent(`${location} ${address}`)
        const url = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${searchQuery}`
        setMapUrl(url)
    }, [address, location])

    if (!mapUrl) {
        return (
            <Card className={`${className}`}>
                <Card.Body>
                    <div className="text-center py-4">
                        <div
                            className="spinner-border text-primary"
                            role="status"
                        >
                            <span className="visually-hidden">
                                読み込み中...
                            </span>
                        </div>
                        <p className="mt-2 text-muted">地図を読み込み中...</p>
                    </div>
                </Card.Body>
            </Card>
        )
    }

    return (
        <Card className={`${className}`}>
            <Card.Body>
                <h5 className="card-title mb-3">
                    <i className="bi bi-geo-alt me-2"></i>
                    開催場所
                </h5>
                <div className="ratio ratio-16x9">
                    <iframe
                        src={mapUrl}
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`${location}の地図`}
                    ></iframe>
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        <strong>場所:</strong> {location}
                    </p>
                    <p className="mb-0 text-muted small">
                        <strong>住所:</strong> {address}
                    </p>
                </div>
            </Card.Body>
        </Card>
    )
}
