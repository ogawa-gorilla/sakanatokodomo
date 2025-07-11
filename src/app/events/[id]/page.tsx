'use client'

import GoogleMap from '@/app/common/components/GoogleMap'
import QRCode from '@/app/common/components/QRCode'
import dayjs from 'dayjs'
import ja from 'dayjs/locale/ja'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
    Badge,
    Button,
    Card,
    Col,
    Collapse,
    Container,
    Form,
    Row,
} from 'react-bootstrap'
import LineTemplateModal from './components/LineTemplateModal'
import { Event } from './types/Event'

// イベントの型定義

// 参加者とスタッフのダミーデータ
const sampleParticipants = [
    '田中太郎',
    '佐藤花子',
    '鈴木一郎',
    '高橋美咲',
    '渡辺健太',
    '伊藤恵子',
    '山田次郎',
    '中村由美',
    '小林正男',
    '加藤愛',
    '吉田裕子',
    '山口達也',
    '松本真理',
    '井上雄一',
    '木村美穂',
    '林健二',
    '斎藤恵美',
    '清水大輔',
]

const sampleStaffs = ['新玉', '山本', '佐々木']

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
        category: '観察会',
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
        category: '観察会',
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
    const [showParticipants, setShowParticipants] = useState(false)
    const [showStaffs, setShowStaffs] = useState(false)
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
                                            {event.startTime} - {event.endTime}{' '}
                                            (スタッフ {event.staffStartTime})
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

                            {/* Googleマップ */}
                            <div className="mb-4">
                                <GoogleMap
                                    address={event.address}
                                    location={event.location}
                                />
                            </div>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${event.location} ${event.address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="outline-secondary">
                                    Google Mapで開く
                                </Button>
                            </a>
                        </Card.Body>
                    </Card>
                    {/* 参加情報 */}
                    <Card className="mb-4">
                        <Card.Body>
                            <h5 className="card-title">参加者情報</h5>

                            {/* 参加者 */}
                            <div className="mb-3">
                                <Button
                                    variant="outline-primary"
                                    onClick={() =>
                                        setShowParticipants(!showParticipants)
                                    }
                                    aria-controls="participants-collapse"
                                    aria-expanded={showParticipants}
                                    className="w-100 text-start d-flex justify-content-between align-items-center"
                                >
                                    <span>
                                        参加者 ({sampleParticipants.length}名)
                                    </span>
                                    <i
                                        className={`bi ${
                                            showParticipants
                                                ? 'bi-chevron-up'
                                                : 'bi-chevron-down'
                                        }`}
                                    ></i>
                                </Button>
                                <Collapse in={showParticipants}>
                                    <div
                                        id="participants-collapse"
                                        className="mt-2"
                                    >
                                        <div className="border rounded p-3 bg-light">
                                            <div className="row">
                                                {sampleParticipants.map(
                                                    (participant, index) => (
                                                        <div
                                                            key={index}
                                                            className="col-6 col-md-4 mb-1"
                                                        >
                                                            {participant}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Collapse>
                            </div>

                            {/* スタッフ */}
                            <div className="mb-3">
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowStaffs(!showStaffs)}
                                    aria-controls="staffs-collapse"
                                    aria-expanded={showStaffs}
                                    className="w-100 text-start d-flex justify-content-between align-items-center"
                                >
                                    <span>
                                        スタッフ ({sampleStaffs.length}名)
                                    </span>
                                    <i
                                        className={`bi ${
                                            showStaffs
                                                ? 'bi-chevron-up'
                                                : 'bi-chevron-down'
                                        }`}
                                    ></i>
                                </Button>
                                <Collapse in={showStaffs}>
                                    <div id="staffs-collapse" className="mt-2">
                                        <div className="border rounded p-3 bg-light">
                                            <div className="row">
                                                {sampleStaffs.map(
                                                    (staff, index) => (
                                                        <div
                                                            key={index}
                                                            className="col-6 col-md-4 mb-1"
                                                        >
                                                            {staff}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Collapse>
                            </div>

                            <div className="d-grid gap-2">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={() =>
                                        router.push(
                                            `/events/${eventId}/participation`
                                        )
                                    }
                                >
                                    参加申し込み
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
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
                                    variant="outline-primary"
                                    onClick={() =>
                                        router.push(`/events/${eventId}/edit`)
                                    }
                                >
                                    イベントを編集
                                </Button>
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
                    {/* 参加受付 */}
                    <Card className="mb-4">
                        <Card.Body>
                            <h5 className="card-title">参加受付情報</h5>
                            <small className="text-danger">
                                ※スタッフでログインしているときのみ表示予定
                            </small>
                            <p className="mb-2">
                                <strong>QRコード:</strong>
                            </p>
                            <div className="d-flex justify-content-center">
                                <QRCode
                                    url={`${process.env.NEXT_PUBLIC_HOST}events/${event?.id}/participation`}
                                />
                            </div>
                            <p className="mb-2">
                                <strong>URL:</strong>
                                <Form.Control
                                    type="text"
                                    value={`${process.env.NEXT_PUBLIC_HOST}events/${event?.id}/participation`}
                                    readOnly
                                />
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
