'use client'

import { useRouter } from 'next/navigation'
import { Badge, Card, Col, Container, Row } from 'react-bootstrap'

// イベントの型定義
interface Event {
    id: string
    title: string
    description: string
    date: string
    time: string
    location: string
    category: string
}

// サンプルデータ
const sampleEvents: Event[] = [
    {
        id: '1',
        title: '地域清掃ボランティア',
        description:
            '地域の公園や道路の清掃活動を行います。環境美化を通じて地域コミュニティの絆を深めましょう。参加者全員で協力して、より美しい街づくりを目指します。',
        date: '2024-01-15',
        time: '09:00-12:00',
        location: '中央公園',
        category: '環境',
    },
    {
        id: '2',
        title: '高齢者見守り活動',
        description:
            '地域の高齢者の方々の見守り活動を行います。定期的な訪問や声かけを通じて、安心して暮らせる地域づくりを支援します。',
        date: '2024-01-20',
        time: '14:00-16:00',
        location: '地域包括支援センター',
        category: '福祉',
    },
    {
        id: '3',
        title: '子ども学習支援',
        description:
            '小学生を対象とした学習支援活動です。宿題のサポートや読書指導を行い、子どもたちの学力向上を支援します。',
        date: '2024-01-25',
        time: '16:00-18:00',
        location: '地域コミュニティセンター',
        category: '教育',
    },
    {
        id: '4',
        title: '災害ボランティア研修',
        description:
            '災害時のボランティア活動に必要な知識と技術を学ぶ研修会です。緊急時の対応方法や安全確保について学習します。',
        date: '2024-02-01',
        time: '10:00-15:00',
        location: '市役所会議室',
        category: '防災',
    },
]

// 説明文を短縮する関数
const truncateDescription = (description: string, maxLength: number = 80) => {
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength) + '...'
}

// 日付をフォーマットする関数
const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
    })
}

// カテゴリに応じた色を返す関数
const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
        環境: 'success',
        福祉: 'primary',
        教育: 'warning',
        防災: 'danger',
        その他: 'secondary',
    }
    return colors[category] || 'secondary'
}

export default function EventsPage() {
    const router = useRouter()

    const handleViewDetail = (eventId: string) => {
        router.push(`/events/${eventId}`)
    }

    return (
        <Container className="py-4">
            {/* ページヘッダー */}
            <Row className="mb-4">
                <Col>
                    <h1 className="h2 mb-3">イベント一覧</h1>
                </Col>
            </Row>

            {/* イベント一覧 */}
            <Row>
                {sampleEvents.map((event) => (
                    <Col key={event.id} xs={12} md={6} lg={4} className="mb-4">
                        <Card className="h-100 shadow-sm">
                            <Card.Body className="d-flex flex-column">
                                {/* カテゴリバッジ */}
                                <div className="mb-2">
                                    <Badge
                                        bg={getCategoryColor(event.category)}
                                        className="mb-2"
                                    >
                                        {event.category}
                                    </Badge>
                                </div>

                                {/* タイトル */}
                                <Card.Title className="h5 mb-3 fw-bold">
                                    {event.title}
                                </Card.Title>

                                {/* 説明文 */}
                                <Card.Text className="text-muted mb-3 flex-grow-1">
                                    {truncateDescription(event.description)}
                                </Card.Text>

                                {/* イベント詳細情報 */}
                                <div className="mt-auto">
                                    <div className="d-flex align-items-center mb-2 text-muted small">
                                        <i className="bi bi-calendar-event me-2"></i>
                                        <span>{formatDate(event.date)}</span>
                                    </div>

                                    <div className="d-flex align-items-center mb-2 text-muted small">
                                        <i className="bi bi-clock me-2"></i>
                                        <span>{event.time}</span>
                                    </div>

                                    <div className="d-flex align-items-center mb-3 text-muted small">
                                        <i className="bi bi-geo-alt me-2"></i>
                                        <span>{event.location}</span>
                                    </div>

                                    {/* 参加ボタン */}
                                    <div className="d-grid">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() =>
                                                handleViewDetail(event.id)
                                            }
                                        >
                                            詳細を見る
                                        </button>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* イベントが見つからない場合 */}
            {sampleEvents.length === 0 && (
                <Row>
                    <Col className="text-center py-5">
                        <div className="text-muted">
                            <h4>現在、開催予定のイベントはありません</h4>
                            <p>
                                新しいイベントが追加された際にお知らせします。
                            </p>
                        </div>
                    </Col>
                </Row>
            )}
        </Container>
    )
}
