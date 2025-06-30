import jwt from 'jsonwebtoken'
import { useSearchParams } from 'next/navigation'

export default async function Callback() {
    const searchParams = useSearchParams()
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code || !state) {
        return <div>認証コードがありません</div>
    }

    /*const response = await fetch(`https://api.line.me/oauth2/v2.1/token`, {
        method: 'POST',
        body: JSON.stringify({
            grant_type: 'authorization_code',
            code,
            client_id: process.env.LINE_CLIENT_ID,
        }),
    })*/

    const payload = {
        iss: 'https://access.line.me',
        sub: 'U1234567890abcdef1234567890abcdef',
        name: 'すずきたろう',
        picture: 'http://localhost:3000/images/boy.png',
        email: 'suzuki@example.com',
        aud: '1234567890',
        exp: 1234567890,
        iat: 1234567890,
    }
    const secretKey = 'secret'

    const token = jwt.sign(payload, secretKey, {
        algorithm: 'HS256',
    })

    const response = await fetch('http://localhost:5248/auth/line', {
        method: 'POST',
        body: JSON.stringify({ jwt_token: token }),
    })

    return <div>{JSON.stringify(response)}</div>
}
