'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { Event } from '../[id]/types/Event'

export default function CreateEventPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertVariant, setAlertVariant] = useState<'success' | 'danger'>(
        'success'
    )

    // フォームの初期値
    const [formData, setFormData] = useState<Partial<Event>>({
        title: '',
        description: '',
        date: '',
        spareDate: '',
        startTime: '',
        endTime: '',
        staffStartTime: '',
        location: '',
        address: '',
        category: '',
        organizer: '',
        contactEmail: '',
        requirements: [''],
    })

    // カテゴリの選択肢
    const categories = ['環境', '福祉', '教育', '防災', '観察会', 'その他']

    // 入力フィールドの変更を処理
    const handleInputChange = (field: keyof Event, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    // 持ち物の追加
    const addRequirement = () => {
        setFormData((prev) => ({
            ...prev,
            requirements: [...(prev.requirements || []), ''],
        }))
    }

    // 持ち物の削除
    const removeRequirement = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            requirements:
                prev.requirements?.filter((_, i) => i !== index) || [],
        }))
    }

    // 持ち物の更新
    const updateRequirement = (index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            requirements:
                prev.requirements?.map((req, i) =>
                    i === index ? value : req
                ) || [],
        }))
    }

    // フォーム送信
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // バリデーション
            if (
                !formData.title ||
                !formData.description ||
                !formData.date ||
                !formData.startTime ||
                !formData.endTime ||
                !formData.location ||
                !formData.address ||
                !formData.category ||
                !formData.organizer ||
                !formData.contactEmail
            ) {
                throw new Error('必須項目をすべて入力してください')
            }

            // 持ち物の空文字を除去
            const filteredRequirements =
                formData.requirements?.filter((req) => req.trim() !== '') || []

            const eventData = {
                ...formData,
                requirements: filteredRequirements,
                currentParticipants: 0,
                currentStaffs: 0,
                id: Date.now().toString(), // 仮のID生成
            }

            // ここでAPIに送信する処理を実装
            console.log('送信データ:', eventData)

            // 成功時の処理
            setAlertMessage('イベントが正常に作成されました')
            setAlertVariant('success')
            setShowAlert(true)

            // 少し待ってからイベント一覧に遷移
            setTimeout(() => {
                router.push('/events')
            }, 2000)
        } catch (error) {
            setAlertMessage(
                error instanceof Error ? error.message : 'エラーが発生しました'
            )
            setAlertVariant('danger')
            setShowAlert(true)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Container className="py-4 mt-5">
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

            <Row>
                <Col lg={8} className="mx-auto">
                    <Card>
                        <Card.Header>
                            <h2 className="mb-0">イベント作成</h2>
                        </Card.Header>
                        <Card.Body>
                            {showAlert && (
                                <Alert
                                    variant={alertVariant}
                                    dismissible
                                    onClose={() => setShowAlert(false)}
                                >
                                    {alertMessage}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                {/* 基本情報 */}
                                <h4 className="mb-3">基本情報</h4>

                                <Form.Group className="mb-3">
                                    <Form.Label>イベントタイトル *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.title || ''}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'title',
                                                e.target.value
                                            )
                                        }
                                        placeholder="イベントのタイトルを入力してください"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>カテゴリ *</Form.Label>
                                    <Form.Select
                                        value={formData.category || ''}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'category',
                                                e.target.value
                                            )
                                        }
                                        required
                                    >
                                        <option value="">
                                            カテゴリを選択してください
                                        </option>
                                        {categories.map((category) => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>イベント詳細 *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        value={formData.description || ''}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'description',
                                                e.target.value
                                            )
                                        }
                                        placeholder="イベントの詳細な説明を入力してください"
                                        required
                                    />
                                </Form.Group>

                                {/* 日時情報 */}
                                <h4 className="mb-3 mt-4">日時情報</h4>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>開催日 *</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={formData.date || ''}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        'date',
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>予備日</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={formData.spareDate || ''}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        'spareDate',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>開始時間 *</Form.Label>
                                            <Form.Control
                                                type="time"
                                                value={formData.startTime || ''}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        'startTime',
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>終了時間 *</Form.Label>
                                            <Form.Control
                                                type="time"
                                                value={formData.endTime || ''}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        'endTime',
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                スタッフ集合時間 *
                                            </Form.Label>
                                            <Form.Control
                                                type="time"
                                                value={
                                                    formData.staffStartTime ||
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        'staffStartTime',
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* 場所情報 */}
                                <h4 className="mb-3 mt-4">場所情報</h4>

                                <Form.Group className="mb-3">
                                    <Form.Label>場所名 *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.location || ''}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'location',
                                                e.target.value
                                            )
                                        }
                                        placeholder="例: 米洗川・羽津北小学校"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>住所 *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.address || ''}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'address',
                                                e.target.value
                                            )
                                        }
                                        placeholder="例: 四日市市羽津500"
                                        required
                                    />
                                </Form.Group>

                                {/* 主催者情報 */}
                                <h4 className="mb-3 mt-4">主催者情報</h4>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>主催者名 *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={formData.organizer || ''}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        'organizer',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="主催者の名前"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                連絡先メール *
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={
                                                    formData.contactEmail || ''
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        'contactEmail',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="example@email.com"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* 持ち物 */}
                                <h4 className="mb-3 mt-4">持ち物</h4>

                                {formData.requirements?.map(
                                    (requirement, index) => (
                                        <div
                                            key={index}
                                            className="d-flex mb-2"
                                        >
                                            <Form.Control
                                                type="text"
                                                value={requirement}
                                                onChange={(e) =>
                                                    updateRequirement(
                                                        index,
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="例: 動きやすい服装"
                                                className="me-2"
                                            />
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() =>
                                                    removeRequirement(index)
                                                }
                                                disabled={
                                                    formData.requirements
                                                        ?.length === 1
                                                }
                                            >
                                                削除
                                            </Button>
                                        </div>
                                    )
                                )}

                                <Button
                                    type="button"
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={addRequirement}
                                    className="mb-3"
                                >
                                    + 持ち物を追加
                                </Button>

                                {/* 送信ボタン */}
                                <div className="d-grid gap-2 mt-4">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? '作成中...'
                                            : 'イベントを作成'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
