'use client'

import React, { useState } from 'react'
import { Alert, Card, Col, Container, Row } from 'react-bootstrap'
import CertificateRequestTable from './components/CertificateRequestTable'
import { mockCertificateRequests } from './data/mockData'
import {
    CertificateRequest,
    CertificateRequestStatus,
} from './types/CertificateRequest'

const CertificatesPage: React.FC = () => {
    const [requests, setRequests] = useState<CertificateRequest[]>(
        mockCertificateRequests
    )
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const handleStatusChange = (
        id: string,
        status: CertificateRequestStatus
    ) => {
        setRequests((prev) =>
            prev.map((request) =>
                request.id === id ? { ...request, status } : request
            )
        )
        setAlertMessage('ステータスを更新しました')
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 3000)
    }

    const handleDelete = (id: string) => {
        if (window.confirm('この申請を削除しますか？')) {
            setRequests((prev) => prev.filter((request) => request.id !== id))
            setAlertMessage('申請を削除しました')
            setShowAlert(true)
            setTimeout(() => setShowAlert(false), 3000)
        }
    }

    const handleExportXlsx = (id: string) => {
        // モックアップ: 個別の参加証xlsx出力の実装は後で追加
        const request = requests.find((r) => r.id === id)
        setAlertMessage(`${request?.name}さんの参加証を出力しました`)
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 3000)
    }

    return (
        <Container fluid className="py-4 mt-5">
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h4 className="mb-0">
                                <i className="bi bi-file-earmark-text me-2"></i>
                                ボランティア参加証発行申請待ちリスト
                            </h4>
                        </Card.Header>
                        <Card.Body>
                            {showAlert && (
                                <Alert
                                    variant="success"
                                    dismissible
                                    onClose={() => setShowAlert(false)}
                                    className="mb-3"
                                >
                                    {alertMessage}
                                </Alert>
                            )}

                            <CertificateRequestTable
                                requests={requests}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDelete}
                                onExportXlsx={handleExportXlsx}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default CertificatesPage
