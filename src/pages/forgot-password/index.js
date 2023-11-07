// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Image from 'next/image'
import screen from '../../../public/images/pages/logo.jpeg'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { Auth, Amplify} from 'aws-amplify'
import awsExports from 'src/aws-exports'
import { useRouter } from 'next/router'

const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 680,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize
}))

const ForgotPasswordV2 = () => {
  // ** Hooks
  const theme = useTheme()
  const MySwal = withReactContent(Swal)
  const router = useRouter();
Amplify.configure(awsExports)

const schema = yup.object().shape({
  email: yup.string().email().required()
})

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {
    try {
      await Auth.forgotPassword(data.email)
      router.push('/new-password')
  } catch (error) {  
      MySwal.fire({
        title: 'Error!',
        text:error.message,
        icon: 'error',
        customClass: {
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
      })
  }
  }

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const newimageSource = 'auth-v2-login-illustration'

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',

            // margin: theme => theme.spacing(8, 0, 8, 8)
            width: '40%', // Adjust the width of the image container as needed
            margin: theme => theme.spacing(-30),
            maxHeight: '119vh',
            overflow: 'hidden'
          }}
        >
         <LoginIllustration
          alt='login-illustration'
          src={`/images/pages/${newimageSource}-${theme.palette.mode}.png`}
          sx={{
            backgroundColor: 'customColors.bodyBg !important',
            maxWidth: '100%', // Use available width
            marginLeft: '200px',
            marginTop: '190px'
          }}
        />
         <Image
          src={screen}
          alt='noimg'
          style={{
            position: 'absolute',
            top: '21%', // Adjust the vertical position as needed
            left: '17%', // Adjust the horizontal position as needed
            cursor: 'pointer'
          }}
        />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
     
          <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '70%', // Adjust the width of the image container as needed
            marginLeft: theme => theme.spacing(35)
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
           
            <Box sx={{ my: 6 }}>
              <Typography variant='h3' sx={{ mb: 1.5 }}>
                Forgot Password? 🔒
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Enter your email and we&prime;ll send you instructions to reset your password
              </Typography>
            </Box>
            <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label='Email'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder='john.doe@gmail.com'
                      error={Boolean(errors.email)}
                      {...(errors.email && { helperText: errors.email.message })}
                    />
                  )}
                />
              <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                Send reset link
              </Button>
              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}>
                <LinkStyled href='/pages/auth/login-v2'>
                  <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                  <span>Back to login</span>
                </LinkStyled>
              </Typography>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}
ForgotPasswordV2.getLayout = page => <BlankLayout>{page}</BlankLayout>
ForgotPasswordV2.guestGuard = true

export default ForgotPasswordV2



