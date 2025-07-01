'use client'

import React, { useMemo, useState } from 'react'
import {
    Badge,
    Button,
    Col,
    Form,
    Pagination,
    Row,
    Table,
} from 'react-bootstrap'
import {
    CertificateRequest,
    CertificateRequestStatus,
} from '../types/CertificateRequest'

interface CertificateRequestTableProps {
    requests: CertificateRequest[]
    onStatusChange: (id: string, status: CertificateRequestStatus) => void
    onDelete: (id: string) => void
    onExportXlsx: (id: string) => void
}

const CertificateRequestTable: React.FC<CertificateRequestTableProps> = ({
    requests,
    onStatusChange,
    onDelete,
    onExportXlsx,
}) => {
    const [showPendingOnly, setShowPendingOnly] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // フィルタリングされたデータ
    const filteredRequests = useMemo(() => {
        if (showPendingOnly) {
            return requests.filter((request) => request.status === 'pending')
        }
        return requests
    }, [requests, showPendingOnly])

    // ページネーション
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentRequests = filteredRequests.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const getStatusBadge = (status: CertificateRequestStatus) => {
        return status === 'completed' ? (
            <Badge bg="success">対応済み</Badge>
        ) : (
            <Badge bg="warning" text="dark">
                未対応
            </Badge>
        )
    }

    return (
        <div>
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Check
                        type="checkbox"
                        label="未対応のみ表示"
                        checked={showPendingOnly}
                        onChange={(e) => setShowPendingOnly(e.target.checked)}
                    />
                </Col>
                <Col md={6} className="text-end">
                    {/* 統計出力ボタンは削除 - 個別出力に変更 */}
                </Col>
            </Row>

            <Table responsive striped bordered hover>
                <thead>
                    <tr>
                        <th>氏名</th>
                        <th>住所</th>
                        <th>イベント名</th>
                        <th>開催場所</th>
                        <th>開催日時</th>
                        <th>ステータス</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRequests.map((request) => (
                        <tr key={request.id}>
                            <td>{request.name}</td>
                            <td>{request.address}</td>
                            <td>{request.eventName}</td>
                            <td>{request.location}</td>
                            <td>
                                {request.eventDate}
                                <br />
                                <small className="text-muted">
                                    {request.eventTime}
                                </small>
                            </td>
                            <td>{getStatusBadge(request.status)}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline-success"
                                        onClick={() => onExportXlsx(request.id)}
                                    >
                                        <i className="bi bi-file-earmark-excel me-1"></i>
                                        xlsx
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline-success"
                                        onClick={() => {}}
                                    >
                                        <i className="bi bi-printer me-1"></i>
                                        宛名印刷
                                    </Button>
                                    {request.status === 'pending' && (
                                        <Button
                                            size="sm"
                                            variant="success"
                                            onClick={() =>
                                                onStatusChange(
                                                    request.id,
                                                    'completed'
                                                )
                                            }
                                        >
                                            対応済み
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => onDelete(request.id)}
                                    >
                                        削除
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center">
                    <Pagination>
                        <Pagination.First
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                        />
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        />

                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                        ).map((page) => (
                            <Pagination.Item
                                key={page}
                                active={page === currentPage}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </Pagination.Item>
                        ))}

                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />
                        <Pagination.Last
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </div>
            )}
        </div>
    )
}

export default CertificateRequestTable
