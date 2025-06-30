'use client'

import { useParams, useRouter } from 'next/navigation'
import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap'

// イベントの型定義
interface Event {
    id: string
    title: string
    description: string
    fullDescription: string
    date: string
    time: string
    location: string
    category: string
    maxParticipants: number
    currentParticipants: number
    organizer: string
    contactEmail: string
    requirements: string[]
}

// サンプルデータ
const sampleEvents: Event[] = [
    {
        id: '1',
        title: '地域清掃ボランティア',
        description:
            '地域の公園や道路の清掃活動を行います。環境美化を通じて地域コミュニティの絆を深めましょう。参加者全員で協力して、より美しい街づくりを目指します。',
        fullDescription:
            '地域の公園や道路の清掃活動を行います。環境美化を通じて地域コミュニティの絆を深めましょう。参加者全員で協力して、より美しい街づくりを目指します。\n\n当日は以下の活動を行います：\n・公園内のゴミ拾い\n・道路沿いの清掃\n・花壇の手入れ\n・落ち葉の掃除\n\n参加者には清掃用具を提供いたします。動きやすい服装でお越しください。',
        date: '2024-01-15',
        time: '09:00-12:00',
        location: '中央公園',
        category: '環境',
        maxParticipants: 30,
        currentParticipants: 18,
        organizer: '地域環境保全会',
        contactEmail: 'info@environment-volunteer.jp',
        requirements: ['動きやすい服装', '帽子', '水分補給用の飲み物'],
    },
    {
        id: '2',
        title: '高齢者見守り活動',
        description:
            '地域の高齢者の方々の見守り活動を行います。定期的な訪問や声かけを通じて、安心して暮らせる地域づくりを支援します。',
        fullDescription:
            '地域の高齢者の方々の見守り活動を行います。定期的な訪問や声かけを通じて、安心して暮らせる地域づくりを支援します。\n\n活動内容：\n・高齢者宅への定期的な訪問\n・健康状態の確認\n・買い物や家事のサポート\n・地域の情報提供\n・緊急時の連絡体制の確認\n\n事前に研修を受けてから活動を開始します。',
        date: '2024-01-20',
        time: '14:00-16:00',
        location: '地域包括支援センター',
        category: '福祉',
        maxParticipants: 20,
        currentParticipants: 12,
        organizer: '地域福祉推進協議会',
        contactEmail: 'welfare@community-support.jp',
        requirements: [
            '事前研修の受講',
            '身分証明書',
            'コミュニケーション能力',
        ],
    },
    {
        id: '3',
        title: '子ども学習支援',
        description:
            '小学生を対象とした学習支援活動です。宿題のサポートや読書指導を行い、子どもたちの学力向上を支援します。',
        fullDescription:
            '小学生を対象とした学習支援活動です。宿題のサポートや読書指導を行い、子どもたちの学力向上を支援します。\n\n支援内容：\n・宿題のサポート\n・読書指導\n・算数の基礎学習\n・工作や実験のサポート\n・遊びを通じた学習\n\n教育経験のある方や、子どもが好きな方の参加をお待ちしています。',
        date: '2024-01-25',
        time: '16:00-18:00',
        location: '地域コミュニティセンター',
        category: '教育',
        maxParticipants: 15,
        currentParticipants: 8,
        organizer: '子ども支援ネットワーク',
        contactEmail: 'education@children-support.jp',
        requirements: [
            '子どもが好き',
            '基本的な学習指導能力',
            '犯罪経歴証明書',
        ],
    },
    {
        id: '4',
        title: '災害ボランティア研修',
        description:
            '災害時のボランティア活動に必要な知識と技術を学ぶ研修会です。緊急時の対応方法や安全確保について学習します。',
        fullDescription:
            '災害時のボランティア活動に必要な知識と技術を学ぶ研修会です。緊急時の対応方法や安全確保について学習します。\n\n研修内容：\n・災害ボランティアの基礎知識\n・安全確保の方法\n・避難所運営の基礎\n・被災者支援の心得\n・緊急時の連絡体制\n・実技訓練\n\n修了証を発行いたします。',
        date: '2024-02-01',
        time: '10:00-15:00',
        location: '市役所会議室',
        category: '防災',
        maxParticipants: 50,
        currentParticipants: 35,
        organizer: '市防災ボランティアセンター',
        contactEmail: 'disaster@city-volunteer.jp',
        requirements: ['18歳以上', '身分証明書', '筆記用具'],
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
    const params = useParams()
    const router = useRouter()
    const eventId = params.id as string

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
                        <Button
                            variant="primary"
                            onClick={() => router.push('/events')}
                        >
                            イベント一覧に戻る
                        </Button>
                    </Col>
                </Row>
            </Container>
        )
    }

    const participationRate = Math.round(
        (event.currentParticipants / event.maxParticipants) * 100
    )

    return (
        <Container className="py-4 mt-5">
            {/* 戻るボタン */}
            <Row className="mb-4">
                <Col>
                    <Button
                        variant="outline-secondary"
                        onClick={() => router.push('/events')}
                        className="mb-3"
                    >
                        ← イベント一覧に戻る
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
                                        <span>{event.time}</span>
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
                                    {event.fullDescription}
                                </div>
                            </div>

                            {/* 参加要件 */}
                            <div className="mb-4">
                                <h4>参加要件</h4>
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
                                    <span>
                                        {event.currentParticipants} /{' '}
                                        {event.maxParticipants}
                                    </span>
                                </div>
                                <div className="progress mb-2">
                                    <div
                                        className="progress-bar"
                                        style={{
                                            width: `${participationRate}%`,
                                        }}
                                    ></div>
                                </div>
                                <small className="text-muted">
                                    定員の{participationRate}%が埋まっています
                                </small>
                            </div>

                            <div className="d-grid gap-2">
                                <Button variant="primary" size="lg">
                                    参加申し込み
                                </Button>
                                <Button variant="outline-secondary">
                                    お気に入りに追加
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* 主催者情報 */}
                    <Card>
                        <Card.Body>
                            <h5 className="card-title">主催者情報</h5>
                            <p className="mb-2">
                                <strong>主催:</strong> {event.organizer}
                            </p>
                            <p className="mb-3">
                                <strong>連絡先:</strong>
                                <br />
                                <a href={`mailto:${event.contactEmail}`}>
                                    {event.contactEmail}
                                </a>
                            </p>
                            <Button variant="outline-primary" size="sm">
                                主催者に問い合わせ
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
