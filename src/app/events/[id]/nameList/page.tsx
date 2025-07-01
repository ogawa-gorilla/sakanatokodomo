'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Row, Table } from 'react-bootstrap'

interface Participant {
    id: string
    name: string
    email: string
    phone: string
    people: {
        adults: number
        children: number
    }
    isStaff: boolean
    notes: string
}

const NameListPage: React.FC = () => {
    const params = useParams()
    const eventId = params.id as string
    const [participants, setParticipants] = useState<Participant[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const eventName = '[イベント名]'

    // モックデータ（実際のAPIから取得する場合はここを変更）
    useEffect(() => {
        const mockData: Participant[] = [
            {
                id: '1',
                name: '田中太郎',
                email: 'tanaka@example.com',
                phone: '090-1234-5678',
                people: { adults: 2, children: 0 },
                isStaff: true,
                notes: 'ボランティア参加証明書希望',
            },
            {
                id: '2',
                name: '佐藤花子',
                email: 'sato@example.com',
                phone: '080-9876-5432',
                people: { adults: 3, children: 1 },
                isStaff: false,
                notes: 'なし',
            },
            {
                id: '3',
                name: '鈴木一郎',
                email: 'suzuki@example.com',
                phone: '070-5555-1234',
                people: { adults: 1, children: 0 },
                isStaff: true,
                notes: 'なし',
            },
            {
                id: '4',
                name: '高橋美咲',
                email: 'takahashi@example.com',
                phone: '090-7777-8888',
                people: { adults: 2, children: 2 },
                isStaff: false,
                notes: 'ライフジャケット希望',
            },
        ]

        setParticipants(mockData)
        setLoading(false)
    }, [eventId])

    const staffMembers = participants.filter((p) => p.isStaff)
    const regularParticipants = participants.filter((p) => !p.isStaff)

    const renderPeople = (people: { adults: number; children: number }) => {
        const parts = []
        if (people.adults > 0) parts.push(`大人${people.adults}名`)
        if (people.children > 0) parts.push(`子供${people.children}名`)
        return parts.length > 0 ? parts.join(', ') : '1名'
    }

    const getTotalPeople = (people: { adults: number; children: number }) => {
        return people.adults + people.children
    }

    // CSV出力機能
    const downloadCSV = () => {
        // CSVヘッダー
        const headers = [
            '区分',
            '名前',
            'メールアドレス',
            '電話番号',
            '大人',
            '子供',
            '合計人数',
            '詳細人数',
            '備考',
        ]

        // CSVデータ行を生成
        const csvData = participants.map((participant) => [
            participant.isStaff ? 'スタッフ' : '一般参加者',
            participant.name,
            participant.email,
            participant.phone,
            participant.people.adults.toString(),
            participant.people.children.toString(),
            getTotalPeople(participant.people).toString(),
            renderPeople(participant.people),
            participant.notes,
        ])

        // CSVコンテンツを生成
        const csvContent = [
            headers.join(','),
            ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n')

        // BOMを追加して日本語文字化けを防ぐ
        const bom = '\uFEFF'
        const blob = new Blob([bom + csvContent], {
            type: 'text/csv;charset=utf-8;',
        })

        // ダウンロードリンクを作成
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute(
            'download',
            `参加者名簿_${eventName}_${
                new Date().toISOString().split('T')[0]
            }.csv`
        )
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const renderParticipantTable = (
        participantList: Participant[],
        title: string,
        variant: string
    ) => (
        <Card className="mb-4">
            <Card.Header className={`bg-${variant} text-white`}>
                <h5 className="mb-0">{title}</h5>
            </Card.Header>
            <Card.Body className="p-0">
                <div className="table-responsive">
                    <Table className="mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="border-0">名前</th>
                                <th className="border-0">メールアドレス</th>
                                <th className="border-0">電話番号</th>
                                <th className="border-0">人数</th>
                                <th className="border-0">備考</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participantList.map((participant) => (
                                <tr key={participant.id}>
                                    <td className="border-0">
                                        <div className="d-flex align-items-center">
                                            <span className="fw-medium">
                                                {participant.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="border-0">
                                        <small className="text-muted">
                                            {participant.email}
                                        </small>
                                    </td>
                                    <td className="border-0">
                                        <small>{participant.phone}</small>
                                    </td>
                                    <td className="border-0">
                                        <div className="d-flex flex-column">
                                            <small className="fw-medium">
                                                {getTotalPeople(
                                                    participant.people
                                                )}
                                                名
                                            </small>
                                            <small className="text-muted">
                                                {renderPeople(
                                                    participant.people
                                                )}
                                            </small>
                                        </div>
                                    </td>
                                    <td className="border-0">
                                        <small className="text-muted">
                                            {participant.notes}
                                        </small>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
        </Card>
    )

    if (loading) {
        return (
            <Container className="py-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">読み込み中...</span>
                    </div>
                </div>
            </Container>
        )
    }

    return (
        <Container className="py-4 mt-5">
            {/* 戻るボタン */}
            <Row className="mb-4">
                <Col>
                    <Button
                        variant="outline-secondary"
                        onClick={() => router.push(`/events/${eventId}`)}
                        className="mb-3"
                    >
                        ← イベントへ
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0">参加者名簿</h2>
                        <div className="d-flex align-items-center gap-3">
                            {participants.length > 0 && (
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={downloadCSV}
                                >
                                    📊 CSVで出力
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* スタッフ一覧 */}
                    {staffMembers.length > 0 &&
                        renderParticipantTable(
                            staffMembers,
                            `スタッフ (${staffMembers.length}組)`,
                            'primary'
                        )}

                    {/* 一般参加者一覧 */}
                    {regularParticipants.length > 0 &&
                        renderParticipantTable(
                            regularParticipants,
                            `一般参加者 (${regularParticipants.length}組)`,
                            'success'
                        )}

                    {participants.length === 0 && (
                        <Card>
                            <Card.Body className="text-center py-5">
                                <p className="text-muted mb-0">
                                    参加者が登録されていません
                                </p>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default NameListPage
