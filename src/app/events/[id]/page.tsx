'use client'

import dayjs from 'dayjs'
import ja from 'dayjs/locale/ja'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap'
import LineTemplateModal from './components/LineTemplateModal'
import { Event } from './types/Event'

// イベントの型定義

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
        category: '環境',
        currentParticipants: 18,
        currentStaffs: 3,
        organizer: '新玉',
        contactEmail: 'info@environment-volunteer.jp',
        requirements: ['動きやすい服装', '帽子', '水分補給用の飲み物'],
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
        category: '福祉',
        currentParticipants: 12,
        currentStaffs: 2,
        organizer: '新玉',
        contactEmail: 'welfare@community-support.jp',
        requirements: ['動きやすい服装', '帽子', '水分補給用の飲み物'],
    },
    {
        id: '3',
        title: '株式会社ミルボン 水辺の自然観察会',
        description:
            '企業さんとの自然観察会です。生き物調査・自然観察の運営、子どもたちのサポートよろしくお願いいたします。JR亀山駅から送迎も可能です。',
        date: '2024-01-25',
        startTime: '09:00',
        endTime: '13:00',
        staffStartTime: '9:00',
        location: '服部川',
        address: '伊賀市平田',
        category: '教育',
        currentParticipants: 8,
        currentStaffs: 1,
        organizer: '新玉',
        contactEmail: 'education@children-support.jp',
        requirements: ['動きやすい服装', '帽子', '水分補給用の飲み物'],
    },
]

// 日付をフォーマットする関数
const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
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

export default function EventDetailPage() {
    dayjs.locale(ja)
    const params = useParams()
    const router = useRouter()
    const eventId = params.id as string
    const [showLineTemplateModal, setShowLineTemplateModal] = useState(false)
    // イベントデータを取得
    const event = sampleEvents.find((e) => e.id === eventId)

    if (!event) {
        return (
            <Container className="py-5 mt-5">
                <Row>
                    <Col className="text-center">
                        <h2>イベントが見つかりません</h2>
                        <p className="text-muted">
                            指定されたイベントは存在しないか、削除された可能性があります。
                        </p>
                        <Button variant="primary" onClick={() => router.back()}>
                            ← 戻る
                        </Button>
                    </Col>
                </Row>
            </Container>
        )
    }

    return (
        <Container className="py-4 mt-5">
            {/* LINEテンプレート用モーダル */}
            <LineTemplateModal
                show={showLineTemplateModal}
                onHide={() => setShowLineTemplateModal(false)}
                event={event}
            />
            {/* 戻るボタン */}
            <Row className="mb-4">
                <Col>
                    <Button
                        variant="outline-secondary"
                        onClick={() => router.back()}
                        className="mb-3"
                    >
                        ← 戻る
                    </Button>
                </Col>
            </Row>

            {/* イベント詳細 */}
            <Row>
                <Col lg={8}>
                    {/* メイン情報 */}
                    <Card className="mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <h1 className="h2 mb-0">{event.title}</h1>
                                <Badge
                                    bg={getCategoryColor(event.category)}
                                    className="fs-6"
                                >
                                    {event.category}
                                </Badge>
                            </div>

                            {/* 基本情報 */}
                            <Row className="mb-4">
                                <Col md={6} className="mb-3">
                                    <div className="d-flex align-items-center text-muted">
                                        <i className="bi bi-calendar-event me-2"></i>
                                        <span>{formatDate(event.date)}</span>
                                    </div>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <div className="d-flex align-items-center text-muted">
                                        <i className="bi bi-clock me-2"></i>
                                        <span>
                                            {event.startTime} - {event.endTime}
                                        </span>
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <div className="d-flex align-items-center text-muted">
                                        <i className="bi bi-geo-alt me-2"></i>
                                        <span>{event.location}</span>
                                    </div>
                                </Col>
                            </Row>

                            {/* 詳細説明 */}
                            <div className="mb-4">
                                <h4>イベント詳細</h4>
                                <div style={{ whiteSpace: 'pre-line' }}>
                                    {event.description}
                                </div>
                            </div>

                            {/* 参加要件 */}
                            <div className="mb-4">
                                <h4>持ち物</h4>
                                <ul className="list-unstyled">
                                    {event.requirements.map(
                                        (requirement, index) => (
                                            <li key={index} className="mb-1">
                                                <i className="bi bi-check-circle-fill text-success me-2"></i>
                                                {requirement}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    {/* 参加情報 */}
                    <Card className="mb-4">
                        <Card.Body>
                            <h5 className="card-title">参加情報</h5>

                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <span>参加者数</span>
                                    <span>{event.currentParticipants}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-1">
                                    <span>スタッフ</span>
                                    <span>{event.currentStaffs}</span>
                                </div>
                            </div>

                            <div className="d-grid gap-2">
                                <Button variant="primary" size="lg">
                                    参加申し込み
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* 主催者情報 */}
                    <Card className="mb-4">
                        <Card.Body>
                            <h5 className="card-title">作成者情報</h5>
                            <p className="mb-2">
                                <strong>作成者:</strong> {event.organizer}
                            </p>
                            <p className="mb-3">
                                <strong>連絡先:</strong>
                                <br />
                                <a href={`mailto:${event.contactEmail}`}>
                                    {event.contactEmail}
                                </a>
                            </p>
                        </Card.Body>
                    </Card>

                    {/* スタッフメニュー */}
                    <Card className="mb-4">
                        <Card.Body>
                            <h5 className="card-title">スタッフメニュー</h5>
                            <small className="text-danger">
                                ※スタッフでログインしているときのみ表示予定
                            </small>
                            <div className="d-grid gap-2">
                                <Button
                                    variant="outline-secondary"
                                    onClick={() =>
                                        router.push(
                                            `/events/${eventId}/nameList`
                                        )
                                    }
                                >
                                    名簿を閲覧
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    onClick={() =>
                                        setShowLineTemplateModal(true)
                                    }
                                >
                                    LINE用テンプレート
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
