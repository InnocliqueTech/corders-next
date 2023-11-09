// ** React Imports
import { useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import Spinner from 'src/@core/components/spinner'

// ** MUI Imports
import Box from '@mui/material/Box'
import DatePicker from 'react-datepicker'
import Fade from '@mui/material/Fade'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import Backdrop from '@mui/material/Backdrop'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import 'react-datepicker/dist/react-datepicker.css'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { width } from '@mui/system'

const LeaveCheck = ({ popperPlacement }) => {
  // ** States
  const [reload, setReload] = useState(false)
  const [collapsed, setCollapsed] = useState(true)
  const [visibility, setVisibility] = useState(true)
  const [loading, setLoading] = useState(false)
  const [isSearched, setIsSearched] = useState(false)
  const [leaveData, setLeaveData] = useState([])
  const [picker, setPicker] = useState('')
  const [endPicker, setEndPicker] = useState('')
  const [minEndDate, setMinEndDate] = useState(null)
  const [isEndPickerDisabled, setIsEndPickerDisabled] = useState(true)

  const startDate = picker ? moment(picker).format('YYYY-MM-DD') : ''
  const endDate = endPicker ? moment(endPicker).format('YYYY-MM-DD') : ''

  // const startDate = moment(picker[0]).format("YYYY-MM-DD")
  // const endDate = moment(endPicker[0]).format("YYYY-MM-DD")

  const handleBackDrop = () => {
    setReload(true)
    setTimeout(() => {
      setReload(false)
    }, 2000)
  }

  const styles = {
    datePickerContainer: {
      marginBottom: '35px' // Add margin at the bottom of the date picker container
    },
    searchButtonContainer: {
      marginBottom: '20px' // Add margin at the bottom of the search button container
    },
    fetchedDataContainer: {
      marginTop: '20px' // Add margin at the top of the fetched data container
    }
  }

  const OnlyLeavesFetch = async () => {
    setLoading(true)
    try {
      const resp = await axios({
        method: 'POST',
        url: 'https://jsf7ngq6b1.execute-api.us-east-1.amazonaws.com/TEST/LeaveManagementTest', // Define LeaveApprovalApi
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: JSON.stringify({
          requestType: 'LeaveStatus',
          fromDate: startDate,
          toDate: endDate
        })
      })
      setLoading(false)
      setIsSearched(true)
      setLeaveData(resp.data.leaveStatusResponse)
    } catch (err) {
      setIsSearched(true)
      setLoading(false)
      console.error(err)
    }
  }

  const Loading = () => {
    if (loading)
      return (
        <span className='customizer-toggle d-flex align-items-center justify-content-center' style={{ height: '100%' }}>
          <Spinner size='lg' className='spinner' color='primary' />
        </span>
      )
  }

  const handleStartDateChange = date => {
    setPicker(date)
    setMinEndDate(moment(date).toDate())
  }

  const isSearchButtonDisabled = !picker || !endPicker

  // height: 515,

  return (
    <Fade in={visibility} timeout={300}>
      <Card sx={{ position: 'relative', height: 515, overflowY: 'auto' }}>
        <CardHeader
          title='Provider Leave Check'
          // action={
          //   <Box sx={{ display: 'flex', alignItems: 'center' }}>
          //     <IconButton
          //       size='small'
          //       aria-label='collapse'
          //       sx={{ mr: 2, color: 'text.secondary' }}
          //       onClick={() => setCollapsed(!collapsed)}
          //     >
          //       <Icon fontSize={20} icon={!collapsed ? 'tabler:chevron-down' : 'tabler:chevron-up'} />
          //     </IconButton>
          //     <IconButton
          //       size='small'
          //       aria-label='reload'
          //       onClick={() => handleBackDrop()}
          //       sx={{ mr: 2, color: 'text.secondary' }}
          //     >
          //       <Icon icon='tabler:reload' fontSize={20} />
          //     </IconButton>
          //     <IconButton
          //       size='small'
          //       aria-label='close'
          //       sx={{ color: 'text.secondary' }}
          //       onClick={() => setVisibility(false)}
          //     >
          //       <Icon icon='tabler:x' fontSize={20} />
          //     </IconButton>
          //   </Box>
          // }
        />
        <Collapse in={collapsed}>
          <CardContent>
            <div style={styles.datePickerContainer}>
              <Grid container spacing={2} alignItems='center'>
                {' '}
                {/* Adjust spacing as needed and align items */}
                <Grid item xs={12} sm={6} md={4}>
                  {' '}
                  {/* Adjust the grid breakpoints */}
                  <DatePicker
                    selected={picker}
                    popperPlacement={popperPlacement}
                    id='basic-input'
                    style={{ width: '100%' }}
                    placeholderText='Select Start Date'
                    onChange={handleStartDateChange}
                    customInput={
                      <CustomInput
                        label='Start Date'
                        fullWidth
                        InputProps={{
                          readOnly: true // Make the input field read-only
                        }}
                      />
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {' '}
                  {/* Adjust the grid breakpoints */}
                  <DatePicker
                    selected={endPicker}
                    id='basic-input'
                    style={{ width: '100%' }}
                    popperPlacement={popperPlacement}
                    placeholderText='Select End Date'
                    onChange={date => setEndPicker(date)}
                    minDate={minEndDate} // Set the minimum end date
                    customInput={
                      <CustomInput
                        label='End Date'
                        fullWidth
                        InputProps={{
                          readOnly: true // Make the input field read-only
                        }}
                      />
                    }
                    required
                    disabled={!picker}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}
                >
                  {' '}
                  <Button
                    variant='contained'
                    size='medium'
                    sx={{ width: '150px' }}
                    onClick={OnlyLeavesFetch}
                    disabled={isSearchButtonDisabled}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </div>

            <Loading />
            {isSearched ? (
              <div style={styles.fetchedDataContainer}>
                <Grid container spacing={1} style={{ padding: '5px', backgroundColor: '#E7EAEC ' }}>
                  {/* <div style={{ maxHeight: '800px', display: 'flex',margin:'14px', padding: '10px', flexWrap: 'wrap' }}> */}
                  {leaveData?.length && !loading ? (
                    leaveData?.map((i, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <>
                          <Card key={index} style={{ borderTop: '3px solid #3BAFDA', margin: '10px' }}>
                            <CardContent>
                              {/* <Badge color="primary" badgeContent={i.date} overlap="rectangle" sx={{ width: 100 }}>
                                                        </Badge> */}
                              <Typography
                                variant='body2'
                                color='text.primary'
                                sx={{
                                  backgroundColor: 'primary.main',
                                  color: 'primary.contrastText',
                                  borderRadius: '13px',
                                  padding: '1px 3px',
                                  display: 'inline-block',
                                  marginTop: '10px' // Added top margin space
                                }}
                              >
                                {i.date}
                              </Typography>
                              {i.leaveStatusResponse.map((item, subIndex) => (
                                <div key={subIndex}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                                    {/* <h5 > */}
                                    <span style={{ fontSize: '15px', margin: '5px' }}>{item.firstName} - </span>
                                    {/* </h5> */}
                                    {item.leaveStatus === 1 ? (
                                      <div>
                                        {/* <h6 className="ms-175"> */}
                                        <span style={{ color: 'orange', fontSize: '15px', marginTop: '5px' }}>
                                          Leave Approved
                                        </span>
                                        {/* </h6> */}
                                      </div>
                                    ) : (
                                      <div>
                                        {/* <h6 className="ms-75"> */}
                                        {`${item.leaveStatus ? ', ' : ''}`}
                                        <span style={{ color: 'orange', fontSize: '15px', marginTop: '5px' }}>
                                          Leave Applied
                                        </span>
                                        {/* </h6> */}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        </>
                      </Grid>
                    ))
                  ) : isSearched && !loading ? (
                    <span className='d-flex align-items-center justify-content-center mt-3 mb-3 w-100'>
                      No Search Data Found...
                    </span>
                  ) : null}
                  {/* </div> */}
                </Grid>
              </div>
            ) : null}
            {/* className="m-20 p-20" */}
            <Backdrop
              open={reload}
              sx={{
                position: 'absolute',
                color: 'common.white',
                zIndex: theme => theme.zIndex.mobileStepper - 1
              }}
            >
              <CircularProgress color='inherit' />
            </Backdrop>
          </CardContent>
        </Collapse>
      </Card>
    </Fade>
  )
}

export default LeaveCheck
