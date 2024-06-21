import { useState, useEffect } from 'react';
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import * as fcl from '@onflow/fcl';
import "../../../../flow/config"

const FlowLogin = props => {
    
    const [user, setUser] = useState({ loggedIn: null })
    const { settings, saveSettings } = props

    settings.user = user.addr

    useEffect(() => {
        fcl.currentUser.subscribe(setUser)
        saveSettings({ ...settings, user: user.addr })
        console.info(settings)

    }, []);

    if (user.loggedIn) {
        return (
            <Box>
                <Box sx={{ paddingRight: '10px' }} component="span">{user?.addr ?? 'No Address'}</Box>
                <Button
                    color="secondary"
                    variant="outlined"
                    size="small"
                    onClick={fcl.unauthenticate}>Log Out
                </Button> {/* once logged out in setUser(user) will be called */}
            </Box>
        );
    } else {
        return (
            <Box>
                <Button
                    color="secondary"
                    variant="outlined"
                    size="small"
                    onClick={fcl.logIn}>Log In
                </Button>{' '}
            </Box>
        );
    }
}

export default FlowLogin