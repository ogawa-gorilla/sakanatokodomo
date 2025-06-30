'use client'

import { useRouter } from 'next/navigation'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'

export default function Home() {
    const router = useRouter()

    const handleNavigateToEvents = () => {
        router.push('/events')
    }

    return (
        <Container className="py-5 mt-5">
            {/* ヒーローセクション */}
            <Row className="mb-5">
                <Col className="text-center">
                    <h1 className="display-4 mb-3">魚と子どものネットワーク</h1>
                    <p className="lead text-muted mb-4">
                        地域のボランティア活動を通じて、より良い社会づくりに貢献しましょう
                    </p>
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleNavigateToEvents}
                        className="px-4"
                    >
                        イベント一覧を見る
                    </Button>
                </Col>
            </Row>

            {/* 統計情報 */}
            <Row className="mb-5">
                <Col md={4} className="mb-3">
                    <Card className="text-center h-100">
                        <Card.Body>
                            <h3 className="text-primary mb-2">15</h3>
                            <p className="text-muted mb-0">今月のイベント数</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="text-center h-100">
                        <Card.Body>
                            <h3 className="text-success mb-2">127</h3>
                            <p className="text-muted mb-0">
                                登録ボランティア数
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="text-center h-100">
                        <Card.Body>
                            <h3 className="text-warning mb-2">89</h3>
                            <p className="text-muted mb-0">今月の参加者数</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* 最近のイベント */}
            <Row>
                <Col>
                    <h2 className="mb-4">最近のイベント</h2>
                    <Row>
                        <Col md={6} className="mb-3">
                            <Card>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="card-title mb-0">
                                            地域清掃ボランティア
                                        </h5>
                                        <span className="badge bg-success">
                                            環境
                                        </span>
                                    </div>
                                    <p className="text-muted small mb-2">
                                        <i className="bi bi-calendar-event me-1"></i>
                                        2024年1月15日（月）
                                    </p>
                                    <p className="card-text">
                                        地域の公園や道路の清掃活動を行います。環境美化を通じて地域コミュニティの絆を深めましょう。
                                    </p>
                                    <Button variant="outline-primary" size="sm">
                                        詳細を見る
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} className="mb-3">
                            <Card>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="card-title mb-0">
                                            高齢者見守り活動
                                        </h5>
                                        <span className="badge bg-primary">
                                            福祉
                                        </span>
                                    </div>
                                    <p className="text-muted small mb-2">
                                        <i className="bi bi-calendar-event me-1"></i>
                                        2024年1月20日（土）
                                    </p>
                                    <p className="card-text">
                                        地域の高齢者の方々の見守り活動を行います。定期的な訪問や声かけを通じて、安心して暮らせる地域づくりを支援します。
                                    </p>
                                    <Button variant="outline-primary" size="sm">
                                        詳細を見る
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
