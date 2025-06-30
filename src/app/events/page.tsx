'use client'

import { useRouter } from 'next/navigation'
import { Badge, Card, Col, Container, Row } from 'react-bootstrap'

interface Tag {
    name: string
    color: string
}

// イベントの型定義
interface Event {
    id: string
    title: string
    description: string
    date: string
    startTime: string
    endTime: string
    staffStartTime: string
    location: string
    address: string
    tags: Tag[]
}

// サンプルデータ
const sampleEvents: Event[] = [
    {
        id: '1',
        title: '第２回米洗川いきもの探し',
        description:
            '初めて協力するイベントです☆生き物調査・自然観察の運営、子どもたちのサポートよろしくお願いいたします。近鉄名古屋線霞ヶ浦駅から徒歩圏内です。',
        date: '2025-07-05',
        startTime: '09:00',
        endTime: '11:00',
        staffStartTime: '8:30',
        location: '米洗川・羽津北小学校',
        address: '四日市市羽津500',
        tags: [{ name: '観察会', color: 'success' }],
    },
    {
        id: '2',
        title: 'かぶとの森テラス 田んぼの自然観察会',
        description:
            'キャンプ場を運営されているかぶとの森テラスさんの田んぼの自然観察会です。「かめやま生物多様性共生区域」にも認定されている田んぼです。生き物調査・自然観察の運営、子どもたちのサポートよろしくお願いいたします。JR亀山駅から送迎も可能です。',
        date: '2025-07-06',
        startTime: '09:00',
        endTime: '12:00',
        staffStartTime: '8:00',
        location: '加太地区の田んぼ',
        address: '亀山市加太中在家',
        tags: [{ name: '観察会', color: 'success' }],
    },
    {
        id: '3',
        title: '株式会社ミルボン 水辺の自然観察会',
        description:
            '企業さんとの自然観察会です。生き物調査・自然観察の運営、子どもたちのサポートよろしくお願いいたします。JR亀山駅から送迎も可能です。',
        date: '2025-07-19',
        startTime: '09:00',
        endTime: '13:00',
        staffStartTime: '9:00',
        location: '服部川',
        address: '伊賀市平田',
        tags: [{ name: '観察会', color: 'success' }],
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
                    <h1 className="h2 mb-3">ボランティアイベント一覧</h1>
                    <p className="text-muted">
                        地域のボランティア活動に参加して、より良い社会づくりに貢献しましょう
                    </p>
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
                                        bg={event.tags[0].color}
                                        className="mb-2"
                                    >
                                        {event.tags[0].name}
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
                                        <span>
                                            {event.startTime} - {event.endTime}{' '}
                                            (スタッフ: {event.staffStartTime})
                                        </span>
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
