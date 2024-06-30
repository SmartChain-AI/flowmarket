import { useState, useEffect } from 'react';
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import * as fcl from '@onflow/fcl';
import "../../../../flow/config"

const FlowLogin = props => {

    const [user, setUser] = useState({ loggedIn: null })
    const { settings, saveSettings } = props

const dbadduser = '/api/dbx/ausr'

    useEffect(() => {
        fcl.currentUser.subscribe(setUser)
      
      /*  const post_data = {
            "address": input,
          };
      
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(post_data),
          };
      
          fetch(dbadduser, options)
*/
    }, []);

    useEffect(() => {
        saveSettings({ ...settings, ...user })

        const post_data = {
            "address": user.addr,
          };
      
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(post_data),
          };
      
          fetch(dbadduser, options)

    }, [user.loggedIn]);

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
                    color="info"
                    variant="outlined"
                    size="small"
                    onClick={fcl.logIn}>Log In
                </Button>{' '}
            </Box>
        );
    }
}

export default FlowLogin
