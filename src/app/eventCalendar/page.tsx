'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import {
    Badge,
    Button,
    Card,
    Col,
    Container,
    Modal,
    Row,
} from 'react-bootstrap'

// イベントの型定義
interface Event {
    id: string
    title: string
    description: string
    date: string
    spareDate?: string
    startTime: string
    endTime: string
    staffStartTime: string
    location: string
    address: string
    category: string
    currentParticipants: number
    currentStaffs: number
    organizer: string
    contactEmail: string
    requirements: string[]
}

// サンプルデータ（events/[id]/page.tsxから取得）
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
    // テスト用：同じ日に複数のイベント
    {
        id: '4',
        title: '朝の清掃活動',
        description:
            '地域の清掃活動を行います。ゴミ拾いと環境美化を目的としています。',
        date: '2025-07-05',
        startTime: '07:00',
        endTime: '08:30',
        staffStartTime: '6:30',
        location: '米洗川周辺',
        address: '四日市市羽津500',
        category: '環境',
        currentParticipants: 5,
        currentStaffs: 2,
        organizer: '環境保護団体',
        contactEmail: 'cleanup@environment.jp',
        requirements: ['軍手', 'ゴミ袋'],
    },
    {
        id: '5',
        title: '夕方の防災訓練',
        description:
            '地域住民を対象とした防災訓練を実施します。避難経路の確認と消火器の使用方法を学びます。',
        date: '2025-07-05',
        startTime: '18:00',
        endTime: '20:00',
        staffStartTime: '17:30',
        location: '羽津北小学校体育館',
        address: '四日市市羽津500',
        category: '防災',
        currentParticipants: 25,
        currentStaffs: 5,
        organizer: '防災委員会',
        contactEmail: 'disaster@community.jp',
        requirements: ['動きやすい服装', '上履き'],
    },
    {
        id: '6',
        title: '夜の星空観察会',
        description: '天体観測を行います。望遠鏡を使って月や星を観察します。',
        date: '2025-07-05',
        startTime: '20:30',
        endTime: '22:00',
        staffStartTime: '20:00',
        location: '羽津北小学校グラウンド',
        address: '四日市市羽津500',
        category: '教育',
        currentParticipants: 15,
        currentStaffs: 3,
        organizer: '天文クラブ',
        contactEmail: 'astronomy@education.jp',
        requirements: ['防寒具', '懐中電灯'],
    },
]

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

export default function EventCalendarPage() {
    const router = useRouter()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [showDateModal, setShowDateModal] = useState(false)

    // 現在の月の最初の日と最後の日を取得
    const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    )
    const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    )

    // カレンダーの最初の日（前月の日付を含む）
    const firstDayOfCalendar = new Date(firstDayOfMonth)
    firstDayOfCalendar.setDate(
        firstDayOfMonth.getDate() - firstDayOfMonth.getDay()
    )

    // カレンダーの最後の日（翌月の日付を含む）
    const lastDayOfCalendar = new Date(lastDayOfMonth)
    lastDayOfCalendar.setDate(
        lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay())
    )

    // カレンダーに表示する日付の配列を生成
    const calendarDays = useMemo(() => {
        const days = []
        const current = new Date(firstDayOfCalendar)

        while (current <= lastDayOfCalendar) {
            days.push(new Date(current))
            current.setDate(current.getDate() + 1)
        }

        return days
    }, [firstDayOfCalendar, lastDayOfCalendar])

    // 指定された日付のイベントを取得
    const getEventsForDate = (date: Date) => {
        const dateString = date.toISOString().split('T')[0]
        return sampleEvents.filter((event) => event.date === dateString)
    }

    // 前の月に移動
    const goToPreviousMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        )
    }

    // 次の月に移動
    const goToNextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        )
    }

    // 今日の日付かどうかを判定
    const isToday = (date: Date) => {
        const today = new Date()
        return date.toDateString() === today.toDateString()
    }

    // 現在の月の日付かどうかを判定
    const isCurrentMonth = (date: Date) => {
        return date.getMonth() === currentDate.getMonth()
    }

    // 日付モーダルを閉じる
    const handleCloseDateModal = () => {
        setShowDateModal(false)
        setSelectedDate(null)
    }

    // 日付モーダルを開く
    const handleDateClick = (date: Date) => {
        const events = getEventsForDate(date)
        if (events.length > 0) {
            setSelectedDate(date)
            setShowDateModal(true)
        }
    }

    // イベント詳細ページに遷移
    const handleEventDetail = (eventId: string) => {
        router.push(`/events/${eventId}`)
    }

    return (
        <Container
            fluid
            className="py-4 mt-5"
            style={{ maxWidth: '100vw', overflow: 'hidden' }}
        >
            {/* ヘッダー */}
            <Row className="mb-4">
                <Col>
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                        <h1 className="h2 mb-0" style={{ fontSize: '1.5rem' }}>
                            イベントカレンダー
                        </h1>
                        <div className="d-flex gap-2">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={goToPreviousMonth}
                            >
                                ← 前の月
                            </Button>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={goToNextMonth}
                            >
                                次の月 →
                            </Button>
                        </div>
                    </div>
                    <h3
                        className="text-muted mt-2"
                        style={{ fontSize: '1.1rem' }}
                    >
                        {currentDate.getFullYear()}年
                        {currentDate.getMonth() + 1}月
                    </h3>
                </Col>
            </Row>

            {/* カレンダー */}
            <Card style={{ maxWidth: '100vw', overflow: 'hidden' }}>
                <Card.Body className="p-0">
                    {/* 曜日ヘッダー */}
                    <Row className="border-bottom m-0">
                        {['日', '月', '火', '水', '木', '金', '土'].map(
                            (day, index) => (
                                <Col
                                    key={day}
                                    className="p-1 text-center fw-bold border-end"
                                    style={{
                                        minHeight: '40px',
                                        maxWidth: 'calc(100vw / 7)',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <div className="d-none d-sm-block">
                                        {day}
                                    </div>
                                    <div
                                        className="d-block d-sm-none"
                                        style={{ fontSize: '0.7rem' }}
                                    >
                                        {day}
                                    </div>
                                </Col>
                            )
                        )}
                    </Row>

                    {/* カレンダーの日付 */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(7, 1fr)',
                            maxWidth: '100%',
                            overflow: 'hidden',
                        }}
                    >
                        {calendarDays.map((date, index) => {
                            const events = getEventsForDate(date)
                            const isCurrentMonthDate = isCurrentMonth(date)
                            const isTodayDate = isToday(date)

                            // 表示するイベント数を制限（最初の3件まで）
                            const displayEvents = events.slice(0, 3)
                            const remainingCount = events.length - 3

                            return (
                                <div
                                    key={index}
                                    className={`border-end border-bottom p-1 ${
                                        !isCurrentMonthDate
                                            ? 'bg-light text-muted'
                                            : ''
                                    }`}
                                    style={{
                                        minHeight: '100px',
                                        maxWidth: 'calc(100vw / 7)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        cursor:
                                            events.length > 0
                                                ? 'pointer'
                                                : 'default',
                                    }}
                                    onClick={() =>
                                        events.length > 0 &&
                                        handleDateClick(date)
                                    }
                                    title={
                                        events.length > 0
                                            ? `${events.length}件のイベントがあります`
                                            : ''
                                    }
                                >
                                    {/* 日付 */}
                                    <div
                                        className={`mb-1 ${
                                            isTodayDate
                                                ? 'fw-bold text-primary'
                                                : ''
                                        }`}
                                        style={{
                                            fontSize: '0.8rem',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {date.getDate()}
                                    </div>

                                    {/* イベント */}
                                    <div
                                        className="d-flex flex-column gap-1"
                                        style={{
                                            maxHeight: '70px',
                                            overflowY: 'auto',
                                            overflowX: 'hidden',
                                        }}
                                    >
                                        {displayEvents.map((event) => (
                                            <div
                                                key={event.id}
                                                className="event-band p-1 rounded"
                                                style={{
                                                    backgroundColor: `var(--bs-${getCategoryColor(
                                                        event.category
                                                    )})`,
                                                    color: 'white',
                                                    fontSize: '0.6rem',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    minHeight: '24px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    maxWidth: '100%',
                                                    pointerEvents: 'none', // クリックイベントを無効化
                                                }}
                                                title={event.title}
                                            >
                                                <div
                                                    className="fw-bold"
                                                    style={{
                                                        fontSize: '0.55rem',
                                                        overflow: 'hidden',
                                                        textOverflow:
                                                            'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {event.title}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '0.5rem',
                                                        overflow: 'hidden',
                                                        textOverflow:
                                                            'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {event.startTime}-
                                                    {event.endTime}
                                                </div>
                                            </div>
                                        ))}

                                        {/* 残りのイベント数表示 */}
                                        {remainingCount > 0 && (
                                            <div
                                                className="p-1 rounded text-center"
                                                style={{
                                                    backgroundColor:
                                                        'var(--bs-secondary)',
                                                    color: 'white',
                                                    fontSize: '0.55rem',
                                                    minHeight: '18px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    pointerEvents: 'none', // クリックイベントを無効化
                                                }}
                                                title={`他${remainingCount}件のイベントがあります`}
                                            >
                                                他{remainingCount}件
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Card.Body>
            </Card>

            {/* 日付イベント一覧モーダル */}
            <Modal show={showDateModal} onHide={handleCloseDateModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedDate &&
                            formatDate(
                                selectedDate.toISOString().split('T')[0]
                            )}
                        のイベント
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedDate && (
                        <div>
                            {getEventsForDate(selectedDate).map((event) => (
                                <Card key={event.id} className="mb-3">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h6
                                                className="card-title mb-0"
                                                style={{ fontSize: '1rem' }}
                                            >
                                                {event.title}
                                            </h6>
                                            <Badge
                                                bg={getCategoryColor(
                                                    event.category
                                                )}
                                            >
                                                {event.category}
                                            </Badge>
                                        </div>

                                        <div className="mb-2">
                                            <small className="text-muted">
                                                <i className="bi bi-clock me-1"></i>
                                                {event.startTime} -{' '}
                                                {event.endTime}
                                            </small>
                                        </div>

                                        <div className="mb-2">
                                            <small className="text-muted">
                                                <i className="bi bi-geo-alt me-1"></i>
                                                {event.location}
                                            </small>
                                        </div>

                                        <p
                                            className="card-text small"
                                            style={{
                                                whiteSpace: 'pre-line',
                                                maxHeight: '60px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {event.description}
                                        </p>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <small className="text-muted">
                                                参加者:{' '}
                                                {event.currentParticipants}人 /
                                                スタッフ: {event.currentStaffs}
                                                人
                                            </small>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                style={{ minWidth: '80px' }}
                                                onClick={() => {
                                                    handleEventDetail(event.id)
                                                }}
                                            >
                                                詳細
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDateModal}>
                        閉じる
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}
