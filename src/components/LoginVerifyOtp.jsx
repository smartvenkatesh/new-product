import React, { useState } from 'react'

const LoginVerifyOtp = () => {
    const [otp, setOtp] = useState("")



    return (
        <div>
            <form action="">
                <h1>Verify Otp</h1>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder='Enter your otp' />
            </form>
        </div>
    )
}

export default LoginVerifyOtp