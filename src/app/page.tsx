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
                    <h1 className="display-4 mb-3">
                        魚と子どものネットワーク イベント・名簿管理システム
                    </h1>
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
                                            第２回米洗川いきもの探し
                                        </h5>
                                        <span className="badge bg-success">
                                            環境
                                        </span>
                                    </div>
                                    <p className="text-muted small mb-2">
                                        <i className="bi bi-calendar-event me-1"></i>
                                        2025年7月5日（土）
                                    </p>
                                    <p className="card-text">
                                        初めて協力するイベントです☆生き物調査・自然観察の運営、子どもたちのサポートよろしくお願いいたします。近鉄名古屋線霞ヶ浦駅から徒歩圏内です
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
                                            かぶとの森テラス 田んぼの自然観察会
                                        </h5>
                                        <span className="badge bg-primary">
                                            福祉
                                        </span>
                                    </div>
                                    <p className="text-muted small mb-2">
                                        <i className="bi bi-calendar-event me-1"></i>
                                        2025年7月6日（日）
                                    </p>
                                    <p className="card-text">
                                        キャンプ場を運営されているかぶとの森テラスさんの田んぼの自然観察会です。「かめやま生物多様性共生区域」にも認定されている田んぼです。生き物調査・自然観察の運営、子どもたちのサポートよろしくお願いいたします。JR亀山駅から送迎も可能です。
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
