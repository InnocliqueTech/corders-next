// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import { Auth, Amplify} from 'aws-amplify'
import awsExports from '../aws-exports'

// ** Defaults

const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
Amplify.configure(awsExports)

const AuthContext = createContext(defaultProvider)

const ValidateUser = process.env.NEXT_PUBLIC_SESSION_DEATAILS

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
   const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        const users = localStorage.getItem('userCognito')
        const accessToken = users === null ? null : JSON.parse(users).accessToken.jwtToken
      const refreshToken = users === null ? null : JSON.parse(users).refreshToken.token
        setLoading(true)

        const user = await Auth.currentAuthenticatedUser()
        
        const response = await axios.post(ValidateUser, {
          requestType:"ValidateUser",
          userName:user.attributes.email
      })

      const UserData =  Object.assign(response.data, {ability:[
        {
      action :'manage',
      subject : 'all'
    }
    ], 
    role:'admin',accessToken : JSON.stringify(accessToken) , refreshToken : JSON.stringify(refreshToken)})
          if (UserData) { 
            setLoading(false)
            setUser({ ...UserData})
          }
          else {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            Auth.signOut()
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            } 
          }
      } else {
        setLoading(false)
      }
    }
    initAuth()

    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [])

  const handleLogin = (params, errorCallback) => {
    const accessToken = JSON.parse(localStorage.getItem('userCognito')).accessToken.jwtToken
    const refreshToken = JSON.parse(localStorage.getItem('userCognito')).refreshToken.token
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        window.localStorage.setItem(authConfig.onTokenExpiration, refreshToken)

        params.rememberMe
          ? window.localStorage.setItem(authConfig.storageTokenKeyName, accessToken)
          : null

        const returnUrl = router.query.returnUrl


        const UserData =  Object.assign(response.data.data, {ability:[
          {
        action :'manage',
        subject : 'all'
      }
      ], 
      role:'admin',accessToken : JSON.stringify(accessToken) , refreshToken : JSON.stringify(refreshToken)})
        setUser({ ...UserData })
        window.localStorage.setItem('userData', JSON.stringify(UserData))
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem('refresh')
    window.localStorage.removeItem('provider')
    window.localStorage.removeItem('facility')
    window.localStorage.removeItem('monthChange')
    window.localStorage.removeItem('userCognito')
    window.localStorage.removeItem('refreshToken')
    window.localStorage.removeItem('accessToken')
    Auth.signOut()
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }