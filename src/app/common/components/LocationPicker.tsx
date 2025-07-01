'use client'

import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'

// Google Maps APIの型定義
declare global {
    interface Window {
        google: any
    }
}

interface Location {
    address: string
    location: string
    lat?: number
    lng?: number
}

interface LocationPickerProps {
    value: Location
    onChange: (location: Location) => void
    className?: string
    disabled?: boolean
}

export default function LocationPicker({
    value,
    onChange,
    className = '',
    disabled = false,
}: LocationPickerProps) {
    const [showModal, setShowModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)
    const markerRef = useRef<any>(null)
    const geocoderRef = useRef<any>(null)

    // Google Maps APIの読み込み
    useEffect(() => {
        const loadGoogleMapsAPI = () => {
            if (window.google && window.google.maps) {
                return Promise.resolve()
            }

            return new Promise<void>((resolve, reject) => {
                const script = document.createElement('script')
                script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
                script.async = true
                script.defer = true
                script.onload = () => resolve()
                script.onerror = () =>
                    reject(new Error('Google Maps APIの読み込みに失敗しました'))
                document.head.appendChild(script)
            })
        }

        if (showModal) {
            loadGoogleMapsAPI()
                .then(() => {
                    initializeMap()
                })
                .catch((error) => {
                    setError(error.message)
                })
        }
    }, [showModal])

    // 地図の初期化
    const initializeMap = () => {
        if (!mapRef.current || !window.google) return

        const defaultLocation = { lat: 35.1815, lng: 136.9066 } // 名古屋市

        // 地図の初期化
        const map = new window.google.maps.Map(mapRef.current, {
            center:
                value.lat && value.lng
                    ? { lat: value.lat, lng: value.lng }
                    : defaultLocation,
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
        })

        mapInstanceRef.current = map
        geocoderRef.current = new window.google.maps.Geocoder()

        // マーカーの初期化
        if (value.lat && value.lng) {
            const marker = new window.google.maps.Marker({
                position: { lat: value.lat, lng: value.lng },
                map: map,
                draggable: true,
            })
            markerRef.current = marker

            // マーカーのドラッグ終了時の処理
            marker.addListener('dragend', () => {
                const position = marker.getPosition()
                if (position) {
                    reverseGeocode(position.lat(), position.lng())
                }
            })
        }

        // 地図クリック時の処理
        map.addListener('click', (event: any) => {
            const lat = event.latLng?.lat()
            const lng = event.latLng?.lng()

            if (lat && lng) {
                placeMarker(lat, lng)
                reverseGeocode(lat, lng)
            }
        })
    }

    // マーカーの配置
    const placeMarker = (lat: number, lng: number) => {
        if (!mapInstanceRef.current) return

        // 既存のマーカーを削除
        if (markerRef.current) {
            markerRef.current.setMap(null)
        }

        // 新しいマーカーを配置
        const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: mapInstanceRef.current,
            draggable: true,
        })
        markerRef.current = marker

        // マーカーのドラッグ終了時の処理
        marker.addListener('dragend', () => {
            const position = marker.getPosition()
            if (position) {
                reverseGeocode(position.lat(), position.lng())
            }
        })
    }

    // 逆ジオコーディング（座標から住所を取得）
    const reverseGeocode = (lat: number, lng: number) => {
        if (!geocoderRef.current) return

        geocoderRef.current.geocode(
            { location: { lat, lng } },
            (results: any, status: any) => {
                if (status === 'OK' && results && results[0]) {
                    const result = results[0]
                    const addressComponents = result.address_components

                    // 住所の構成要素を取得
                    let streetNumber = ''
                    let route = ''
                    let locality = ''
                    let administrativeArea = ''
                    let postalCode = ''

                    addressComponents.forEach((component: any) => {
                        const types = component.types
                        if (types.includes('street_number')) {
                            streetNumber = component.long_name
                        } else if (types.includes('route')) {
                            route = component.long_name
                        } else if (types.includes('locality')) {
                            locality = component.long_name
                        } else if (
                            types.includes('administrative_area_level_1')
                        ) {
                            administrativeArea = component.long_name
                        } else if (types.includes('postal_code')) {
                            postalCode = component.long_name
                        }
                    })

                    const address =
                        `${administrativeArea}${locality}${route}${streetNumber}`.trim()
                    const location = result.formatted_address

                    onChange({
                        address,
                        location,
                        lat,
                        lng,
                    })
                }
            }
        )
    }

    // 住所検索
    const searchLocation = async () => {
        if (!searchQuery.trim() || !geocoderRef.current) return

        setIsLoading(true)
        setError('')

        geocoderRef.current.geocode(
            { address: searchQuery },
            (results: any, status: any) => {
                setIsLoading(false)

                if (status === 'OK' && results && results[0]) {
                    const result = results[0]
                    const location = result.geometry.location
                    const lat = location.lat()
                    const lng = location.lng()

                    // 地図の中心を移動
                    if (mapInstanceRef.current) {
                        mapInstanceRef.current.setCenter({ lat, lng })
                        mapInstanceRef.current.setZoom(16)
                    }

                    // マーカーを配置
                    placeMarker(lat, lng)
                    reverseGeocode(lat, lng)
                } else {
                    setError('指定された住所が見つかりませんでした')
                }
            }
        )
    }

    // 現在地を取得
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError('お使いのブラウザは位置情報をサポートしていません')
            return
        }

        setIsLoading(true)
        setError('')

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setIsLoading(false)
                const lat = position.coords.latitude
                const lng = position.coords.longitude

                // 地図の中心を移動
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.setCenter({ lat, lng })
                    mapInstanceRef.current.setZoom(16)
                }

                // マーカーを配置
                placeMarker(lat, lng)
                reverseGeocode(lat, lng)
            },
            (error) => {
                setIsLoading(false)
                setError('現在地の取得に失敗しました')
            }
        )
    }

    // 場所を確定
    const confirmLocation = () => {
        setShowModal(false)
        setSearchQuery('')
        setError('')
    }

    return (
        <>
            <Card className={className}>
                <Card.Body>
                    <h5 className="card-title mb-3">
                        <i className="bi bi-geo-alt me-2"></i>
                        開催場所
                    </h5>

                    <div className="mb-3">
                        <Form.Group>
                            <Form.Label>場所名</Form.Label>
                            <Form.Control
                                type="text"
                                value={value.location}
                                onChange={(e) =>
                                    onChange({
                                        ...value,
                                        location: e.target.value,
                                    })
                                }
                                placeholder="例: 米洗川・羽津北小学校"
                                disabled={disabled}
                            />
                        </Form.Group>
                    </div>

                    <div className="mb-3">
                        <Form.Group>
                            <Form.Label>住所</Form.Label>
                            <Form.Control
                                type="text"
                                value={value.address}
                                onChange={(e) =>
                                    onChange({
                                        ...value,
                                        address: e.target.value,
                                    })
                                }
                                placeholder="例: 四日市市羽津500"
                                disabled={disabled}
                            />
                        </Form.Group>
                    </div>

                    {value.lat && value.lng && (
                        <div className="mb-3">
                            <small className="text-muted">
                                座標: {value.lat.toFixed(6)},{' '}
                                {value.lng.toFixed(6)}
                            </small>
                        </div>
                    )}

                    <Button
                        variant="outline-primary"
                        onClick={() => setShowModal(true)}
                        disabled={disabled}
                    >
                        <i className="bi bi-map me-2"></i>
                        地図で場所を選択
                    </Button>
                </Card.Body>
            </Card>

            {/* 地図選択モーダル */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>場所を選択</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && (
                        <Alert
                            variant="danger"
                            dismissible
                            onClose={() => setError('')}
                        >
                            {error}
                        </Alert>
                    )}

                    <Row className="mb-3">
                        <Col md={8}>
                            <Form.Control
                                type="text"
                                placeholder="住所を検索..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) =>
                                    e.key === 'Enter' && searchLocation()
                                }
                            />
                        </Col>
                        <Col md={4}>
                            <div className="d-grid gap-2">
                                <Button
                                    variant="outline-secondary"
                                    onClick={searchLocation}
                                    disabled={isLoading}
                                >
                                    {isLoading ? '検索中...' : '検索'}
                                </Button>
                                <Button
                                    variant="outline-info"
                                    onClick={getCurrentLocation}
                                    disabled={isLoading}
                                >
                                    現在地
                                </Button>
                            </div>
                        </Col>
                    </Row>

                    <div className="mb-3">
                        <div
                            ref={mapRef}
                            style={{ height: '400px', width: '100%' }}
                        ></div>
                    </div>

                    <div className="text-muted small">
                        <p className="mb-1">
                            <strong>場所名:</strong> {value.location}
                        </p>
                        <p className="mb-1">
                            <strong>住所:</strong> {value.address}
                        </p>
                        {value.lat && value.lng && (
                            <p className="mb-0">
                                <strong>座標:</strong> {value.lat.toFixed(6)},{' '}
                                {value.lng.toFixed(6)}
                            </p>
                        )}
                    </div>

                    <div className="text-muted small mt-2">
                        <i className="bi bi-info-circle me-1"></i>
                        地図をクリックするか、住所を検索して場所を選択してください。マーカーはドラッグして微調整できます。
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                    >
                        キャンセル
                    </Button>
                    <Button variant="primary" onClick={confirmLocation}>
                        場所を確定
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
