import Link from 'next/link'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import BlankLayout from 'src/@core/layouts/BlankLayout'

const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(13)
  }
}))

const Error401 = () => {
  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BoxWrapper>
          <Typography variant='h1'>401</Typography>
          <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
            You are not authorized! 🔐
          </Typography>
          <Typography variant='body2'>You don&prime;t have permission to access this page. Go Home!</Typography>
        </BoxWrapper>
        <Button variant='contained' sx={{ px: 5.5, m:4 }}>
          <Link passHref href='/'>
            Back to Home
          </Link>
        </Button>
      </Box>
    </Box>
  )
}
Error401.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Error401
