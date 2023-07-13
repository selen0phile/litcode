import React from 'react'
import { signInWithGoogle, auth } from "../firebase"
import { Redirect } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'
import { Button, Box } from '@mui/material'
import '../App.css'

function Login() {
    const { currentUser } = useAuth();
    return (
        <div>
            <center>
                <Box>
                    <br/>
                    <br/>
                    <span className='litcode'>LitCode</span>
                    <br/>
                    <br/>
                    <Button style={{fontSize: '20px'}} size='large' variant='contained' onClick={signInWithGoogle}>Sign In with Google</Button>
                </Box>
                
            </center>
            { !currentUser ? <p/> : <Redirect to="/problemset"/> }
        </div>
    )
}

export default Login