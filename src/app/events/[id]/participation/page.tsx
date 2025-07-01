'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { Event } from '../types/Event'

// 参加申請の型定義
interface ParticipationForm {
    name: string
    email: string
    participationType: 'general' | 'staff'
    adults: number
    children: number
    notes: string
    volunteerCertificate: boolean
    phone: string
    companions: string[] // 同行者の名前の配列を追加
}

// Cookie管理のユーティリティ関数
const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null
    return null
}

const setCookie = (name: string, value: string, days: number = 365): void => {
    if (typeof document === 'undefined') return
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

// サンプルイベントデータ（実際の実装ではAPIから取得）
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
        category: '観察会',
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
        category: '観察会',
        currentParticipants: 8,
        currentStaffs: 1,
        organizer: '新玉',
        contactEmail: 'education@children-support.jp',
        requirements: ['動きやすい服装', '帽子', '水分補給用の飲み物'],
    },
]

export default function ParticipationPage() {
    const params = useParams()
    const router = useRouter()
    const eventId = params.id as string

    // イベントデータを取得
    const event = sampleEvents.find((e) => e.id === eventId)

    // フォームの状態管理
    const [formData, setFormData] = useState<ParticipationForm>({
        name: '',
        email: '',
        participationType: 'general',
        adults: 1,
        children: 0,
        notes: '',
        volunteerCertificate: false,
        phone: '',
        companions: [], // 同行者の配列を初期化
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [errors, setErrors] = useState<{
        name?: string
        email?: string
        adults?: string
        children?: string
        notes?: string
        phone?: string
    }>({})

    // コンポーネントマウント時にCookieから前回の入力内容を読み込み
    useEffect(() => {
        const savedName = getCookie('participation_name')
        const savedType = getCookie('participation_type')

        if (savedName) {
            setFormData((prev) => ({ ...prev, name: savedName }))
        }

        if (savedType && (savedType === 'general' || savedType === 'staff')) {
            setFormData((prev) => ({
                ...prev,
                participationType: savedType as 'general' | 'staff',
            }))
        }
    }, [])

    // フォームの入力値を更新
    const handleNameChange = (value: string) => {
        setFormData((prev) => ({ ...prev, name: value }))
        if (errors.name) {
            setErrors((prev) => ({ ...prev, name: undefined }))
        }
    }

    const handleEmailChange = (value: string) => {
        setFormData((prev) => ({ ...prev, email: value }))
        if (errors.email) {
            setErrors((prev) => ({ ...prev, email: undefined }))
        }
    }

    const handleAdultsChange = (value: number) => {
        setFormData((prev) => ({ ...prev, adults: value }))
        if (errors.adults) {
            setErrors((prev) => ({ ...prev, adults: undefined }))
        }
    }

    const handleChildrenChange = (value: number) => {
        setFormData((prev) => ({ ...prev, children: value }))
        if (errors.children) {
            setErrors((prev) => ({ ...prev, children: undefined }))
        }
    }

    const handleNotesChange = (value: string) => {
        setFormData((prev) => ({ ...prev, notes: value }))
    }

    const handlePhoneChange = (value: string) => {
        setFormData((prev) => ({ ...prev, phone: value }))
    }

    // 参加種別の変更を処理
    const handleParticipationTypeChange = (value: string) => {
        if (value === 'general' || value === 'staff') {
            setFormData((prev) => ({
                ...prev,
                participationType: value as 'general' | 'staff',
                // 一般参加に変更した場合はボランティア証明書を無効化
                volunteerCertificate:
                    value === 'staff' ? prev.volunteerCertificate : false,
            }))
        }
    }

    // ボランティア証明書の変更を処理
    const handleVolunteerCertificateChange = (checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            volunteerCertificate: checked,
        }))
    }

    // 同行者の追加
    const handleAddCompanion = () => {
        if (formData.companions.length < 4) {
            setFormData((prev) => ({
                ...prev,
                companions: [...prev.companions, ''],
            }))
        }
    }

    // 同行者の削除
    const handleRemoveCompanion = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            companions: prev.companions.filter((_, i) => i !== index),
        }))
    }

    // 同行者の名前変更
    const handleCompanionChange = (index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            companions: prev.companions.map((companion, i) =>
                i === index ? value : companion
            ),
        }))
    }

    // バリデーション
    const validateForm = (): boolean => {
        const newErrors: {
            name?: string
            email?: string
            adults?: string
            children?: string
            notes?: string
            phone?: string
        } = {}

        if (!formData.name.trim()) {
            newErrors.name = '名前を入力してください'
        }

        if (formData.adults < 1) {
            newErrors.adults = '大人は1名以上で入力してください'
        }

        if (formData.children < 0) {
            newErrors.children = '子供の人数は0以上で入力してください'
        }

        if (formData.adults + formData.children < 1) {
            newErrors.adults = '参加人数は1名以上で入力してください'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // フォーム送信
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            // 実際の実装ではAPIに送信
            console.log('送信データ:', formData)

            // Cookieに名前と参加種別を保存
            setCookie('participation_name', formData.name)
            setCookie('participation_email', formData.email)
            setCookie('participation_phone', formData.phone)
            setCookie('participation_type', formData.participationType)

            // 送信成功
            setSubmitSuccess(true)

            // 3秒後にイベント詳細ページに戻る
            setTimeout(() => {
                router.push(`/events/${eventId}`)
            }, 3000)
        } catch (error) {
            console.error('送信エラー:', error)
            setErrors({ notes: '送信に失敗しました。再度お試しください。' })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!event) {
        return (
            <Container className="py-5 mt-5">
                <Row>
                    <Col className="text-center">
                        <h2>イベントが見つかりません</h2>
                        <p className="text-muted">
                            指定されたイベントは存在しないか、削除された可能性があります。
                        </p>
                        <Button variant="primary" onClick={() => router.back()}>
                            ← 戻る
                        </Button>
                    </Col>
                </Row>
            </Container>
        )
    }

    if (submitSuccess) {
        return (
            <Container className="py-5 mt-5">
                <Row>
                    <Col className="text-center">
                        <Alert variant="success">
                            <h4>参加申請を受け付けました！</h4>
                            <p>ご参加ありがとうございます。</p>
                            <p>3秒後にイベント詳細ページに戻ります...</p>
                        </Alert>
                    </Col>
                </Row>
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
                        onClick={() => router.back()}
                        className="mb-3"
                    >
                        ← 戻る
                    </Button>
                </Col>
            </Row>

            {/* イベント情報 */}
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <h4>{event.title}</h4>
                            <p className="text-muted mb-0">
                                {new Date(event.date).toLocaleDateString(
                                    'ja-JP',
                                    {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        weekday: 'long',
                                    }
                                )}{' '}
                                {event.startTime} - {event.endTime}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* 参加申請フォーム */}
            <Row>
                <Col lg={8} className="mx-auto">
                    <Card>
                        <Card.Body>
                            <h4 className="card-title mb-4">
                                参加申請フォーム
                            </h4>

                            <Form onSubmit={handleSubmit}>
                                {/* 名前 */}
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        名前{' '}
                                        <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            handleNameChange(e.target.value)
                                        }
                                        placeholder="例: 田中太郎"
                                        isInvalid={!!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                {/* メールアドレス */}
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        メールアドレス{' '}
                                        <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.email}
                                        onChange={(e) =>
                                            handleEmailChange(e.target.value)
                                        }
                                        placeholder="例: example@example.com"
                                        isInvalid={!!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                {/* 電話番号 */}
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        電話番号{' '}
                                        <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            handlePhoneChange(e.target.value)
                                        }
                                        placeholder="例: 090-1234-5678"
                                        isInvalid={!!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                {/* 参加種別 */}
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        参加種別{' '}
                                        <span className="text-danger">*</span>
                                    </Form.Label>
                                    <div>
                                        <Form.Check
                                            inline
                                            type="radio"
                                            id="type-general"
                                            name="participationType"
                                            label="一般参加"
                                            value="general"
                                            checked={
                                                formData.participationType ===
                                                'general'
                                            }
                                            onChange={(e) =>
                                                handleParticipationTypeChange(
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Form.Check
                                            inline
                                            type="radio"
                                            id="type-staff"
                                            name="participationType"
                                            label="スタッフ参加"
                                            value="staff"
                                            checked={
                                                formData.participationType ===
                                                'staff'
                                            }
                                            onChange={(e) =>
                                                handleParticipationTypeChange(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </Form.Group>

                                {/* 人数 */}
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>
                                                大人 (中学生以上){' '}
                                                <span className="text-danger">
                                                    *
                                                </span>
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                min="1"
                                                value={formData.adults}
                                                onChange={(e) =>
                                                    handleAdultsChange(
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                                isInvalid={!!errors.adults}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.adults}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>
                                                子供 (小学生未満)
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                min="0"
                                                value={formData.children}
                                                onChange={(e) =>
                                                    handleChildrenChange(
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                                isInvalid={!!errors.children}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.children}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* 備考 */}
                                <Form.Group className="mb-4">
                                    <Form.Label>備考</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formData.notes}
                                        onChange={(e) =>
                                            handleNotesChange(e.target.value)
                                        }
                                        placeholder="アレルギー、特別な配慮が必要な場合などがあればご記入ください"
                                    />
                                </Form.Group>

                                {/* ボランティア証明書 */}
                                <Form.Group className="mb-4">
                                    <Form.Check
                                        type="checkbox"
                                        id="volunteer-certificate"
                                        label="ボランティア証明書を希望する(スタッフ参加が必要です)"
                                        checked={formData.volunteerCertificate}
                                        onChange={(e) =>
                                            handleVolunteerCertificateChange(
                                                e.target.checked
                                            )
                                        }
                                        disabled={
                                            formData.participationType !==
                                            'staff'
                                        }
                                        className={
                                            formData.participationType !==
                                            'staff'
                                                ? 'text-muted'
                                                : ''
                                        }
                                    />
                                    {formData.volunteerCertificate && (
                                        <div className="mt-2 p-3 bg-light rounded">
                                            <small className="text-muted">
                                                就職活動や単位認定などでご利用いただける、ボランティア活動に参加した証明書（参加証）の発行を申請します。
                                            </small>
                                            <div className="mt-2">
                                                <small className="text-muted">
                                                    同行者も証明書が必要な場合は、下記の同行者欄に名前を入力してください。
                                                </small>
                                            </div>
                                        </div>
                                    )}
                                </Form.Group>

                                {/* 同行者の追加 */}
                                {formData.volunteerCertificate && (
                                    <Form.Group className="mb-4">
                                        <Form.Label>
                                            同行者（証明書が必要な場合）
                                        </Form.Label>
                                        <div>
                                            {formData.companions.map(
                                                (companion, index) => (
                                                    <div
                                                        key={index}
                                                        className="d-flex align-items-center mb-2"
                                                    >
                                                        <Form.Control
                                                            type="text"
                                                            value={companion}
                                                            onChange={(e) =>
                                                                handleCompanionChange(
                                                                    index,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="同行者の名前"
                                                            className="me-2"
                                                        />
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleRemoveCompanion(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            削除
                                                        </Button>
                                                    </div>
                                                )
                                            )}
                                            {formData.companions.length < 4 && (
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={handleAddCompanion}
                                                    className="mt-2"
                                                >
                                                    同行者を追加
                                                </Button>
                                            )}
                                            <div className="mt-2">
                                                <small className="text-muted">
                                                    同行者は最大4名まで追加できます。
                                                </small>
                                            </div>
                                        </div>
                                    </Form.Group>
                                )}

                                {/* 送信ボタン */}
                                <div className="d-grid">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? '送信中...'
                                            : '参加申請を送信'}
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
