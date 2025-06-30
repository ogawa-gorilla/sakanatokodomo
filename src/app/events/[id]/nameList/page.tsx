'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
    Badge,
    Button,
    Card,
    Col,
    Container,
    Row,
    Table,
} from 'react-bootstrap'

interface Participant {
    id: string
    name: string
    contact: string
    lineName: string
    people: {
        adults: number
        children: number
        staff: number
    }
    isStaff: boolean
}

const NameListPage: React.FC = () => {
    const params = useParams()
    const eventId = params.id as string
    const [participants, setParticipants] = useState<Participant[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    // モックデータ（実際のAPIから取得する場合はここを変更）
    useEffect(() => {
        const mockData: Participant[] = [
            {
                id: '1',
                name: '田中太郎',
                contact: '090-1234-5678',
                lineName: 'たなか',
                people: { adults: 2, children: 0, staff: 0 },
                isStaff: true,
            },
            {
                id: '2',
                name: '佐藤花子',
                contact: '080-9876-5432',
                lineName: 'はなこ',
                people: { adults: 3, children: 1, staff: 0 },
                isStaff: false,
            },
            {
                id: '3',
                name: '鈴木一郎',
                contact: '070-5555-1234',
                lineName: 'いちろう',
                people: { adults: 1, children: 0, staff: 0 },
                isStaff: true,
            },
            {
                id: '4',
                name: '高橋美咲',
                contact: '090-7777-8888',
                lineName: 'みさき',
                people: { adults: 2, children: 2, staff: 0 },
                isStaff: false,
            },
        ]

        setParticipants(mockData)
        setLoading(false)
    }, [eventId])

    const staffMembers = participants.filter((p) => p.isStaff)
    const regularParticipants = participants.filter((p) => !p.isStaff)

    const renderPeople = (people: {
        adults: number
        children: number
        staff: number
    }) => {
        const parts = []
        if (people.adults > 0) parts.push(`大人${people.adults}名`)
        if (people.children > 0) parts.push(`子供${people.children}名`)
        if (people.staff > 0) parts.push(`スタッフ${people.staff}名`)
        return parts.length > 0 ? parts.join(', ') : '1名'
    }

    const getTotalPeople = (people: {
        adults: number
        children: number
        staff: number
    }) => {
        return people.adults + people.children + people.staff
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
                                <th className="border-0">連絡先</th>
                                <th className="border-0">LINE名</th>
                                <th className="border-0">人数</th>
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
                                            {participant.contact}
                                        </small>
                                    </td>
                                    <td className="border-0">
                                        <small>{participant.lineName}</small>
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
                        ← イベントに戻る
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0">参加者名簿</h2>
                        <Badge bg="secondary" className="fs-6">
                            総参加者: {participants.length}組
                        </Badge>
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
