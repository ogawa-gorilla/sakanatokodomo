'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import UserDropdown from './components/UserDropdown'

export default function AppNavbar() {
    const [expanded, setExpanded] = useState(false)
    const router = useRouter()

    const handleNavLinkClick = (url: string) => {
        setExpanded(false) // ナビゲーションリンククリック時にナビバーを閉じる
        router.push(url)
    }

    return (
        <Navbar
            bg="primary"
            variant="dark"
            expand="lg"
            fixed="top"
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
        >
            <Container>
                <Navbar.Brand href="#">魚と子ども 名簿管理</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-main" />
                <Navbar.Collapse id="navbar-main">
                    <Nav className="me-auto">
                        <Nav.Link
                            href="#"
                            onClick={() => handleNavLinkClick('/')}
                        >
                            ホーム
                        </Nav.Link>
                        <Nav.Link
                            href="#"
                            onClick={() => handleNavLinkClick('/events')}
                        >
                            イベント一覧
                        </Nav.Link>
                        <Nav.Link
                            href="#"
                            onClick={() => handleNavLinkClick('/eventCalendar')}
                        >
                            イベントカレンダー
                        </Nav.Link>
                        <Nav.Link
                            href="#"
                            onClick={() => handleNavLinkClick('/staffs')}
                        >
                            スタッフ一覧
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        <UserDropdown />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
