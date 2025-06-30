import { NavDropdown } from 'react-bootstrap'

export default function UserDropdown() {
    //const loginUser = useAppSelector((state) => state.login.user)
    //const { handleLogout } = useLogin()
    const loginUser = {
        name: '仮太郎',
        role: '一般',
    }
    return (
        <NavDropdown
            title={
                'ユーザー: ' + loginUser!.name + ' (' + loginUser!.role + ')'
            }
            id="user-dropdown"
            align="end"
        >
            <NavDropdown.Item href="#" onClick={() => {}}>
                ログアウト
            </NavDropdown.Item>
        </NavDropdown>
    )
}
