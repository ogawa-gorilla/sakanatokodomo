import dayjs from 'dayjs'
import { useState } from 'react'
import { Button, Form, Modal, Toast } from 'react-bootstrap'
import { Clipboard } from 'react-bootstrap-icons'
import { Event } from '../types/Event'

interface LineTemplateModalProps {
    show: boolean
    onHide: () => void
    event?: Event
}

export default function LineTemplateModal({
    show,
    onHide,
    event,
}: LineTemplateModalProps) {
    const [showToast, setShowToast] = useState(false)

    const lineTemplate = `${dayjs(event?.date).format('M/D(ddd)')}　${
        event?.startTime
    }～${event?.endTime}　準備${event?.staffStartTime}～
${event?.title}@${event?.location}(${event?.address})
→${event?.description}

イベント詳細: ${process.env.NEXT_PUBLIC_HOST}events/${event?.id}
参加受付はこちら: ${process.env.NEXT_PUBLIC_HOST}events/${
        event?.id
    }/participation`

    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(lineTemplate)
            setShowToast(true)
            // 3秒後にトーストを自動的に非表示にする
            setTimeout(() => setShowToast(false), 3000)
        } catch (err) {
            console.error('クリップボードへのコピーに失敗しました:', err)
        }
    }

    return (
        <>
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>LINE用テンプレート</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-grid gap-2">
                        <Form.Control
                            as="textarea"
                            rows={10}
                            value={lineTemplate}
                            readOnly
                        />

                        <Button
                            variant="outline-secondary"
                            onClick={handleCopyToClipboard}
                            className="d-flex align-items-center justify-content-center"
                        >
                            <Clipboard className="me-2" />
                            クリップボードにコピー
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* トースト通知 */}
            <div
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 9999,
                }}
            >
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={3000}
                    autohide
                >
                    <Toast.Header>
                        <strong className="me-auto">コピー完了</strong>
                    </Toast.Header>
                    <Toast.Body>
                        LINE用テンプレートをクリップボードにコピーしました
                    </Toast.Body>
                </Toast>
            </div>
        </>
    )
}
