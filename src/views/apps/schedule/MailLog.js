// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Input from '@mui/material/Input'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import Backdrop from '@mui/material/Backdrop'
import Checkbox from '@mui/material/Checkbox'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import ListItem from '@mui/material/ListItem'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import FormControlLabel from '@mui/material/FormControlLabel'
import Modal from '@mui/material/Modal'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import axios from 'axios'
import Badge from '@mui/material/Badge'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'
import { Check, X } from 'react-feather'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

import { useForm, Controller } from 'react-hook-form'
import { date } from 'yup'

const MailLog = props => {
  // ** Props
  const {
    store,
    query,
    hidden,
    lgAbove,
    dispatch,
    setQuery,
    direction,
    updateMail,
    routeParams,
    labelColors,
    paginateMail,
    getCurrentMail,
    mailDetailsOpen,
    updateMailLabel,
    handleSelectMail,
    setMailDetailsOpen,
    handleSelectAllMail,
    handleLeftSidebarToggle
  } = props

  const { errors, control, getValues } = useForm()

  // ** State
  const [refresh, setRefresh] = useState(false)
  const [isExpand, setIsExpand] = useState(false)
  const [hide, setHide] = useState(false)
  const [showScheduleButton, setShowScheduleButton] = useState(true)
  const [startDate, setStartDate] = useState(null) //new Date()
  const [endDate, setEndDate] = useState(null) //new Date()
  //modal dates
  const [startDateModal, setStartDateModal] = useState(null) //new Date()
  const [endDateModal, setEndDateModal] = useState(null) //new Date()
  const [open, setOpen] = useState(false)
  const params = {}
  const [providerData, setProviderData] = useState([])
  const [providerOptions, setProviderOptions] = useState([])
  const [selectedProviderId, setselectedProviderId] = useState(null)
  const [providerDataModel, setProviderDataModal] = useState(null)
  const [hospitalDataModal, setHospitalDataModal] = useState(null)
  const [selectedUserId, setSelectedUserId] = useState(null)

  const [hospitalData, setHospitalData] = useState(null)
  const [hospitalOptios, setHospitalOptions] = useState([])
  const [selectedHospitalId, setSelectedHospitalId] = useState(null)
  const [isSearched, setIsSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchData, setSearchData] = useState([])
  const [leaves, setLeaves] = useState(false)
  const [leaveData, setLeaveData] = useState([])
  const [scheduleData, setScheduleData] = useState({})
  const MySwal = withReactContent(Swal)
  const [leaveDeniedModal, setLeaveDeniedModal] = useState(false)
  const [leaveApprovalModal, setLeaveApprovalModal] = useState('')
  const [searchButtonClicked, setSearchButtonClicked] = useState(false)
  const [isScheduleButtonEnabled, setIsScheduleButtonEnabled] = useState(false)
  const [showProgress, setShowProgress] = useState(false)

  const [isClicked, setIsClicked] = useState(false)

  const handleIconClick = () => {
    setIsClicked(true)
    //onClear()
    setTimeout(() => {
      setIsClicked(false)
    }, 1000)
    setShowProgress(true)
    setTimeout(() => {
      setShowProgress(false)
    }, 1000)
  }

  const userRole = JSON.parse(localStorage.getItem('userData'))

  const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : ''
  const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : ''

  const formattedStartDateModal = startDateModal ? format(startDateModal, 'yyyy-MM-dd') : ''
  const formattedEndDateModal = endDateModal ? format(endDateModal, 'yyyy-MM-dd') : ''
  const today = new Date()

  const firstDayOfCurrentMonth = startOfMonth(today)
  const lastDayOfCurrentMonth = endOfMonth(today)

  //API
  const ProviderApi = process.env.NEXT_PUBLIC_FETCH_EVENTS_PROVIDERS
  const ScheduleApi = process.env.NEXT_PUBLIC_PHYSICIAN_SCHEDULING
  const LeaveApprovalApi = process.env.NEXT_PUBLIC_LEAVE_DETAILS

  const handleClick = () => {
    setIsExpand(!isExpand)
    if (isExpand) {
      setShowScheduleButton(true) // Show the Schedule button when expanding
    } else {
      setShowScheduleButton(false) // Hide the Schedule button when collapsing
    }
  }

  const hideToClick = () => {
    setHide(true)
    setShowScheduleButton(false)
  }

  const handleSearchButtonClick = () => {
    setSearchButtonClicked(true)
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const style = {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 20,
    borderRadius: '5px'
  }

  const onClear = () => {
    setProviderData([])
    setHospitalData(null)
    setStartDate(null)
    setEndDate(null)
    setLeaves(false)
    setSearchData('')
    setLeaveData('')
    setIsSearched(false)
  }

  //api for Provider
  useEffect(() => {
    const ProviderFetch = async () => {
      setLoading(true)
      try {
        const resp = await axios({
          method: 'POST',
          url: ProviderApi,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: JSON.stringify({
            requestType: 'Provider',
            accountId: '1'
          })
        })
        console.log(resp, 'welcome')

        if ((Object.values(resp.data)[0] !== undefined || []) && resp.data.providersList.length !== 0) {
          // Extract the provider data and set it in the state
          const providers = resp.data.providersList.map(pro => ({
            userId: pro.userId,
            firstName: pro.firstName
          }))
          setProviderOptions(providers)
        }
      } catch (err) {
        console.error(err)
      }
    }
    ProviderFetch()
  }, [])

  //api for hospital
  useEffect(() => {
    const HospitalFetch = async () => {
      setLoading(true)
      try {
        const resp = await axios({
          method: 'POST',
          url: ProviderApi,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: JSON.stringify({
            requestType: 'Facility',
            accountId: '1'
          })
        })
        setLoading(false)
        if ((Object.values(resp.data)[0] !== undefined || []) && resp.data.facilityList.length !== 0) {
          // Extract the provider data and set it in the state
          const hospitals = resp.data.facilityList.map(hos => ({
            hospitalName: hos.hospitalName,
            hospitalId: hos.hospitalId
          }))
          setHospitalOptions(hospitals)
        }
      } catch (err) {
        setLoading(false)
        console.error(err)
      }
    }

    HospitalFetch()
  }, [])

  const ScheduleFetch = async () => {
    try {
      const resp = await axios({
        method: 'POST',
        url: ScheduleApi,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: JSON.stringify({
          requestType: 'Scheduling',
          providerId: selectedUserId,
          hospitalId: selectedHospitalId,
          fromDate: formattedStartDateModal,
          toDate: formattedEndDateModal,
          scheduledBy: 1,
          accountId: 1
        })
      })
      console.log(selectedUserId)
      if (resp.data.leaveDatesApproved.length !== 0) {
        MySwal.fire({
          title: `Provider is on Leave on`,
          text: resp.data.leaveDatesApproved,
          icon: 'info',
          footer: 'On Other dates Provider is Scheduled',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }
      {
        toast.success(resp.data.scheduleResponse.message, {
          position: 'bottom-right'
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  //search data api
  const SearchFetch = async () => {
    setLoading(true)
    try {
      const resp = await axios({
        method: 'POST',
        url: ScheduleApi,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: JSON.stringify({
          requestType: 'search',
          searchProviderId: selectedProviderId,
          hospitalId: selectedHospitalId,
          fromDate: formattedStartDate,
          toDate: formattedEndDate
        })
      })
      console.log(resp, 'resp')
      console.log(selectedProviderId, 'userID')

      setIsSearched(true)
      setLoading(false)

      {
        setSearchData(resp.data.providerLeavesView)
      }
    } catch (err) {
      setIsSearched(true)
      setLoading(false)
      console.error(err)
    }
  }

  //show only leaves
  const OnlyLeavesFetch = async () => {
    setLoading(true)
    try {
      const resp = await axios({
        method: 'POST',
        url: ScheduleApi,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: JSON.stringify({
          requestType: 'onlyleaves',
          searchProviderId: selectedProviderId,
          hospitalId: selectedHospitalId,
          fromDate: formattedStartDate,
          toDate: formattedEndDate
        })
      })
      console.log(selectedProviderId)
      setIsSearched(true)
      setLoading(false)
      {
        setLeaveData(resp.data.providerLeavesView)
      }
    } catch (err) {
      setIsSearched(true)
      setLoading(false)
      console.error(err)
    }
  }

  const handleApproval = async () => {
    setLoading(false)
    const data = []
    if (leaveData === undefined) {
      leaveData.forEach(dt => {
        dt.onlyLeaves.forEach(dat => {
          if (dat.leaveStatus === 0) {
            data.push({
              date: dat.scheduledDate,
              isHalfday: 1,
              providerId: dat.providerId,
              alteredBy: 1
            })
          }
        })
      })
    } else {
      searchData.forEach(dt => {
        dt.providerInfo.forEach(dat => {
          if (dat.leaveStatus === '0') {
            data.push({
              date: dat.scheduledDate,
              isHalfday: 1,
              providerId: dat.providerId,
              alteredBy: 1
            })
          }
        })
      })
    }
    MySwal.fire({
      title: 'Are you Sure?',
      text: `You want to approve all leaves`,
      icon: 'Info',
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        axios({
          method: 'POST',
          url: LeaveApprovalApi,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: JSON.stringify({
            requestType: 'BulkLeaveApprovals',
            bulkLeaveList: data
          })
        }).then(res => {
          if (res.data.bulkLeaveApprovalResponse.message === 'Successfully Approved') {
            toast.success('Successfully Approved')
            setLoading(false)
            SearchFetch()
            OnlyLeavesFetch()
          }
        })
      }
    })
  }

  // Leave Approval

  const LeaveApprovalFetch = async leaveStatus => {
    setLoading(true)
    try {
      await axios({
        method: 'POST',
        url: LeaveApprovalApi,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: JSON.stringify({
          requestType: 'LeaveApprovals',
          isHalfday: 0,

          //alteredBy: 9, //after we need to change
          alteredBy: userRole.userId,
          providerId: scheduleData.providerId,
          date: scheduleData.scheduledDate,
          status: leaveStatus
        })
      })
      setLoading(false)
      SearchFetch()
      OnlyLeavesFetch()
    } catch (err) {
      setLoading(false)
      console.error(err)
    }
  }

  const handleDenial = async item => {
    MySwal.fire({
      title: 'Are you Sure?',
      text: `You want to deny the leave on ${item.scheduledDate} for ${
        item.firstName === undefined ? item.providerName : item.firstName
      }`,
      icon: 'error',
      confirmButtonText: 'Deny',
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        setLoading(true)
        axios({
          method: 'POST',
          url: LeaveApprovalApi,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: JSON.stringify({
            requestType: 'LeaveApprovals',
            isHalfday: 0,

            //alteredBy: 9,
            alteredBy: userRole.userId,
            providerId: item.providerId,
            date: item.scheduledDate,
            status: 2
          })
        })
        setLoading(false)
        SearchFetch()
        OnlyLeavesFetch()
      }
    })
  }

  const areAllFieldsFilled = () => {
    return providerData.length > 0 && hospitalData !== null && startDate !== null && endDate !== null
  }

  useEffect(() => {
    const allInputsFilled =
      providerDataModel !== null && hospitalDataModal !== null && startDateModal !== null && endDateModal !== null
    setIsScheduleButtonEnabled(allInputsFilled)
  }, [providerDataModel, hospitalDataModal, startDateModal, endDateModal])

  return (
    <>
      {hide ? (
        ''
      ) : (
        <div
          style={{
            // overflowY: 'scroll',
            overflowX: 'visible',
            backgroundColor: '#ffffff',
            width: isExpand ? '100%' : '100%',
            // height: isExpand ? '20%' : 'auto',
            height: isExpand ? '20%' : searchButtonClicked ? 'auto' : '70%',
            padding: '16px',
            //overflowY: isExpand ? '' : 'scroll'
            overflowY: searchButtonClicked ? 'scroll' : '',
            backgroundColor: isClicked ? '#b1b3b1' : '#ffffff'
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ marginTop: '10px' }}>
                <h5>Physician Scheduling</h5>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ marginTop: '12px', cursor: 'pointer' }} onClick={handleClick}>
                  <Icon icon='tabler:chevron-down' fontSize={18} />
                </div>
                <div style={{ marginTop: '12px', marginLeft: '18px', cursor: 'pointer' }}>
                  <Icon icon='tabler:refresh' fontSize={18} onClick={handleIconClick} />
                </div>
                <div style={{ marginTop: '12px', marginLeft: '18px', cursor: 'pointer' }}>
                  <Icon icon='tabler:x' fontSize={18} onClick={hideToClick} />
                </div>
                {showProgress && (
                  <div
                    style={{
                      position: 'fixed',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <CircularProgress />
                  </div>
                )}
              </div>
            </div>
            {showScheduleButton && (
              <div style={{ float: 'right', marginTop: '12px' }}>
                <Button variant='contained' size='small' onClick={handleOpen}>
                  Schedule
                </Button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby='modal-modal-title'
                  aria-describedby='modal-modal-description'
                >
                  <Box sx={style}>
                    <div>
                      <Typography
                        id='modal-modal-title'
                        style={{ backgroundColor: '#F8F8F8', padding: '2px', borderRadius: '5px' }}
                      >
                        <h5 style={{ margin: '6px', color: '#7367F0' }}> Scheduling</h5>
                      </Typography>
                      <div
                        style={{
                          position: 'absolute',
                          left: '96%',
                          bottom: '94%',
                          boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                          borderRadius: '20%',
                          padding: '5px',
                          backgroundColor: '#fff',
                          cursor: 'pointer',
                          height: '30px',
                          width: '30px'
                        }}
                        onClick={handleClose}
                      >
                        <Icon icon='tabler:x' fontSize={20} style={{ color: '#7367F0' }} />
                      </div>
                    </div>
                    <div style={{ margin: '20px', padding: '10px' }}>
                      <Autocomplete
                        id='Provider'
                        getOptionLabel={option => option.firstName}
                        options={providerOptions}
                        value={providerDataModel}
                        onChange={(event, newValue) => {
                          setProviderDataModal(newValue)

                          // console.log('Selected Providers:', newValue)
                          // // Update the selected provider IDs as a comma-separated string
                          // if (Array.isArray(newValue)) {
                          //   const selectedIds = newValue.map(provider => provider.userId)
                          //   const idString = selectedIds.join(',') // Join the array with commas
                          //   console.log(idString)
                          //   setselectedProviderId(idString)
                          // } else {
                          //   setselectedProviderId(null) // Set it to null if no providers are selected
                          // }
                          // Extract userId from newValue
                          const userId = newValue ? newValue.userId : null

                          // Store the userId in state
                          setSelectedUserId(userId)
                        }}
                        size='small'
                        style={{ marginTop: '23px' }}
                        renderInput={params => <TextField {...params} label='Provider' placeholder='Select Provider' />}
                      />
                      <Autocomplete
                        disablePortal
                        id='Hospital'
                        options={hospitalOptios}
                        getOptionLabel={option => option.hospitalName} // Specify the property to display
                        value={hospitalDataModal}
                        size='small'
                        onChange={(event, newValue) => {
                          setHospitalDataModal(newValue)
                          console.log('Selected his:', newValue)

                          // Update the selected hospital's hospitalId
                          if (newValue) {
                            setSelectedHospitalId(newValue.hospitalId)
                          } else {
                            setSelectedHospitalId(null)
                          }
                        }}
                        style={{ marginTop: '23px' }}
                        renderInput={params => <TextField {...params} label='Hospital' placeholder='Select Hospital' />}
                      />
                      <DatePicker
                        selected={startDateModal}
                        onChange={date => setStartDateModal(date)}
                        customInput={
                          <TextField
                            {...params}
                            label='Start Date'
                            placeholder='Select Start Date'
                            size='small'
                            style={{ marginTop: '23px', width: '440px' }}
                            InputProps={{
                              readOnly: true // Make the input field read-only
                            }}
                          />
                        }
                        popperPlacement='top'
                        dateFormat='dd MMMM, yyyy' // Set the custom date format
                        renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <button onClick={decreaseMonth}>{'<'}</button>
                            <span>{format(date, 'MMMM yyyy')}</span>
                            <button onClick={increaseMonth}>{'>'}</button>
                          </div>
                        )}
                        minDate={today}
                      />
                      <DatePicker
                        selected={endDateModal}
                        onChange={date => setEndDateModal(date)}
                        customInput={
                          <TextField
                            {...params}
                            label='End Date'
                            placeholder='Select End Date'
                            size='small'
                            style={{ marginTop: '23px', width: '440px' }}
                            InputProps={{
                              readOnly: true // Make the input field read-only
                            }}
                          />
                        }
                        popperPlacement='top'
                        dateFormat='dd MMMM, yyyy' // Set the custom date format
                        renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <button onClick={decreaseMonth}>{'<'}</button>
                            <span>{format(date, 'MMMM yyyy')}</span>
                            <button onClick={increaseMonth}>{'>'}</button>
                          </div>
                        )}
                        //minDate={today}
                        minDate={startDateModal}
                      />
                    </div>
                    <div style={{ borderTop: '1px solid #ebeae8' }}></div>
                    <div style={{ float: 'right', padding: '23px' }}>
                      <Button
                        variant='contained'
                        size='small'
                        onClick={() => {
                          ScheduleFetch(), handleClose()
                          setProviderDataModal(null)
                          setHospitalDataModal(null)
                          setStartDateModal(null)
                          setEndDateModal(null)
                        }}
                        disabled={!isScheduleButtonEnabled}
                      >
                        Proceed
                      </Button>
                      <Button
                        size='small'
                        style={{ marginLeft: '15px', backgroundColor: '#82868B', color: 'white' }}
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Box>
                </Modal>
              </div>
            )}
            {showScheduleButton && (
              <Grid container rowSpacing={6} columnSpacing={{ xs: 3, sm: 5, md: 6 }}>
                <Grid item xs={6}>
                  <Autocomplete
                    multiple
                    id='Provider'
                    getOptionLabel={option => option.firstName}
                    options={providerOptions}
                    value={providerData}
                    onChange={(event, newValue) => {
                      setProviderData(newValue)
                      console.log('Selected Providers:', newValue)

                      // Update the selected provider IDs as a comma-separated string
                      if (newValue) {
                        const selectedIds = newValue.map(provider => provider.userId)
                        const idString = selectedIds.join(',') // Join the array with commas
                        setselectedProviderId(idString)
                      } else {
                        setselectedProviderId(null) // Set it to null if no providers are selected
                      }
                    }}
                    size='small'
                    style={{ marginTop: '5px' }}
                    renderInput={params => <TextField {...params} label='Provider' placeholder='Select Provider' />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    disablePortal
                    id='Hospital'
                    options={hospitalOptios}
                    getOptionLabel={option => option.hospitalName} // Specify the property to display
                    value={hospitalData}
                    size='small'
                    onChange={(event, newValue) => {
                      setHospitalData(newValue)
                      console.log('Selected his:', newValue)

                      // Update the selected hospital's hospitalId
                      if (newValue) {
                        setSelectedHospitalId(newValue.hospitalId)
                      } else {
                        setSelectedHospitalId(null)
                      }
                    }}
                    style={{ marginTop: '5px' }}
                    renderInput={params => <TextField {...params} label='Hospital' placeholder='Select Hospital' />}
                  />
                </Grid>
                <Grid item xs={6} style={{ display: 'flex' }}>
                  <DatePicker
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                    customInput={
                      <TextField
                        {...params}
                        label='Select Start Date'
                        placeholder='Select Start Date'
                        size='small'
                        style={{ width: '90%' }}
                        InputProps={{
                          readOnly: true // Make the input field read-only
                        }}
                      />
                    }
                    popperPlacement='bottom'
                    dateFormat='dd MMMM, yyyy' // Set the custom date format
                    //minDate={firstDayOfCurrentMonth} // Disable dates before the first day of the current month
                    //maxDate={lastDayOfCurrentMonth} // Disable dates after the last day of the current month

                    renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button onClick={decreaseMonth}>{'<'}</button>
                        {/* <span>{format(date, 'MMMM yyyy')}</span> */}
                        <span>{date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        <button onClick={increaseMonth}>{'>'}</button>
                      </div>
                    )}
                  />
                  <DatePicker
                    selected={endDate}
                    onChange={date => setEndDate(date)}
                    customInput={
                      <TextField
                        {...params}
                        label='Select End Date'
                        placeholder='Select End Date'
                        size='small'
                        style={{ float: 'right', width: '90%' }}
                        InputProps={{
                          readOnly: true // Make the input field read-only
                        }}
                      />
                    }
                    popperPlacement='bottom'
                    dateFormat='dd MMMM, yyyy' // Set the custom date format
                    renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button onClick={decreaseMonth}>{'<'}</button>
                        <span>{format(date, 'MMMM yyyy')}</span>
                        <button onClick={increaseMonth}>{'>'}</button>
                      </div>
                    )}
                    minDate={startDate}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControlLabel
                    control={<Checkbox checked={leaves} onClick={() => setLeaves(!leaves)} />}
                    label='Show only leaves'
                  />
                  <Button
                    variant='contained'
                    size='small'
                    onClick={() => {
                      if (leaves) {
                        OnlyLeavesFetch()
                      } else {
                        SearchFetch()
                      }
                      handleSearchButtonClick()
                    }}
                    disabled={!areAllFieldsFilled()}
                  >
                    Search
                  </Button>
                  <Button
                    size='small'
                    style={{ marginLeft: '20px', backgroundColor: '#82868B', color: 'white' }}
                    onClick={onClear}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid
                  container
                  rowSpacing={6}
                  //columnSpacing={{ xs: 3, sm: 5, md: 6 }}
                  style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
                >
                  <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {leaveData.length > 0 || searchData.length > 0 ? (
                      <div style={{ padding: '30px' }}>
                        <Button
                          style={{ backgroundColor: '#00CFE8', color: '#fff', padding: '10px' }}
                          onClick={() => handleApproval()}
                        >
                          Approve All Leaves
                        </Button>
                      </div>
                    ) : null}
                  </Grid>
                </Grid>
                {leaves === true ? (
                  leaveData?.length && !loading ? (
                    <Grid
                      container
                      spacing={2}
                      style={{ paddingLeft: '20px', paddingRight: '20px', backgroundColor: '#E7EAEC' }}
                    >
                      {leaveData?.map((i, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          {i.onlyLeaves.length > 0 ? (
                            <Card style={{ borderTop: '3px solid #3BAFDA', margin: '10px ' }}>
                              <CardContent>
                                <Typography>
                                  <span
                                    style={{
                                      backgroundColor: '#7367F0',
                                      color: '#fff',
                                      padding: '3px',
                                      borderRadius: '10px',
                                      fontSize: '12px'
                                    }}
                                  >
                                    {i.date}
                                  </span>
                                </Typography>
                                {i.onlyLeaves.map((item, subIndex) => (
                                  <div key={subIndex}>
                                    <div
                                      style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}
                                    >
                                      <span>{item.firstName} -</span>
                                      {item.leaveDescription ? (
                                        <div>
                                          <span>
                                            <span style={{ color: 'orange' }}>
                                              {item.leaveDescription === 'Leave Applied' ? (
                                                <>
                                                  {item.leaveDescription}
                                                  <Check
                                                    onClick={() => {
                                                      setScheduleData(item)
                                                      setLeaveApprovalModal(!leaveApprovalModal)
                                                    }}
                                                    size={20}
                                                    style={{ color: '#79e577', cursor: 'pointer' }}
                                                  />
                                                  <X
                                                    onClick={() => {
                                                      setScheduleData(item)
                                                      setLeaveDeniedModal(!leaveDeniedModal)
                                                    }}
                                                    size={20}
                                                    style={{ color: '#FF9F43', cursor: 'pointer' }}
                                                  />
                                                </>
                                              ) : item.leaveDescription === 'Leave Approved' ? (
                                                <Button
                                                  size='sm'
                                                  style={{ backgroundColor: '#FF9F43', color: '#ffffff' }}
                                                  onClick={() => handleDenial(item)}
                                                >
                                                  {item.leaveDescription}
                                                </Button>
                                              ) : (
                                                item.leaveDescription
                                              )}
                                            </span>
                                          </span>
                                        </div>
                                      ) : (
                                        <span
                                          style={{
                                            background: 'rgba(255, 159, 67, 0.2)',
                                            color: '#5E50EE',
                                            padding: '3px',
                                            fontSize: '15px'
                                          }}
                                        >
                                          Not Applied
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </CardContent>
                            </Card>
                          ) : null}
                        </Grid>
                      ))}
                    </Grid>
                  ) : isSearched && !loading ? (
                    <span
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '20px' }}
                    >
                      No Search Data Found
                    </span>
                  ) : null
                ) : (
                  <div style={{ backgroundColor: '#E7EAEC', width: '100%', marginLeft: '2px' }}>
                    {searchData?.length && !loading ? (
                      <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                        style={{ paddingLeft: '20px', paddingRight: '20px' }}
                      >
                        {searchData.map((i, index) => (
                          <Grid item xs={4} key={index}>
                            <Card className='miui-card' style={{ marginTop: '20px ', borderTop: '3px solid #3BAFDA' }}>
                              {i.providerInfo.length > 0 ? (
                                <CardContent className='miui-card-content' style={{ marginTop: '-10px' }}>
                                  <span
                                    className='miui-badge'
                                    style={{
                                      backgroundColor: '#7367F0',
                                      color: '#fff',
                                      padding: '3px',
                                      borderRadius: '10px',
                                      fontSize: '13px'
                                    }}
                                  >
                                    {i.date}
                                  </span>
                                  {i.providerInfo.map((item, subIndex) => (
                                    <div className='miui-card-text' key={subIndex}>
                                      <div
                                        style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}
                                      >
                                        <Typography className='miui-provider-name' variant='h6'>
                                          <span> {item.providerName} - </span>
                                        </Typography>
                                        {item.leaveDescription || item.hospitalName ? (
                                          <div>
                                            <Typography className='miui-hospital-name' variant='h6'>
                                              {item.hospitalName
                                                ? `${item.hospitalName}${item.leaveDescription ? ', ' : ''}`
                                                : ''}
                                              <span className='miui-leave-description' style={{ color: 'orange' }}>
                                                {item.leaveDescription === 'Leave Applied' ? (
                                                  <>
                                                    {item.leaveDescription}
                                                    <span
                                                      className='miui-check-icon'
                                                      onClick={() => {
                                                        setScheduleData(item)
                                                        setLeaveApprovalModal(!leaveApprovalModal)
                                                      }}
                                                      style={{
                                                        color: '#79E577',
                                                        fontSize: '20px',
                                                        marginLeft: '1px',
                                                        cursor: 'pointer'
                                                      }}
                                                    >
                                                      ✓
                                                    </span>
                                                    <span
                                                      className='miui-x-icon'
                                                      onClick={() => {
                                                        setScheduleData(item)
                                                        setLeaveDeniedModal(!leaveDeniedModal)
                                                      }}
                                                      style={{ color: '#FFB6BD', fontSize: '20px', cursor: 'pointer' }}
                                                    >
                                                      ✗
                                                    </span>
                                                  </>
                                                ) : item.leaveDescription === 'Leave Approved' ? (
                                                  <Button
                                                    size='small'
                                                    //color='warning'
                                                    style={{ backgroundColor: '#FF9F43', color: '#ffffff' }}
                                                    onClick={() => {
                                                      setScheduleData(item)
                                                      handleDenial(item)
                                                    }}
                                                  >
                                                    {item.leaveDescription}
                                                  </Button>
                                                ) : (
                                                  item.leaveDescription
                                                )}
                                              </span>
                                            </Typography>
                                          </div>
                                        ) : (
                                          <span
                                            style={{
                                              backgroundColor: '#82868B',
                                              color: '#fff',
                                              borderRadius: '0.70rem',
                                              fontSize: '0.82rem',
                                              padding: '0.24rem',
                                              backgroundColor: new Date(i.date) > new Date() ? '#7367F0' : '#808080'
                                            }}
                                            // className={`miui-schedule-badge ${
                                            //   new Date(i.date) > new Date() ? ' bg-primary' : 'miui-secondary'
                                            // }`}

                                            // onClick={() => {
                                            //   if (new Date(i.date) > new Date()) {
                                            //     setModalSuccess(!modalSuccess)
                                            //   }
                                            // }}
                                            onClick={() => {
                                              if (new Date(i.date) > new Date()) {
                                                handleOpen()
                                              }
                                            }}
                                          >
                                            Schedule
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </CardContent>
                              ) : null}
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    ) : isSearched && !loading ? (
                      <div className='miui-no-data'>No Search Data Found...</div>
                    ) : null}
                  </div>
                )}
              </Grid>
            )}
          </div>
        </div>
      )}
      <Modal
        open={leaveApprovalModal}
        onClose={() => setLeaveApprovalModal(false)}
        toggle={() => setLeaveApprovalModal(!leaveApprovalModal)}
        aria-labelledby='leave-approval-modal-title'
        aria-describedby='leave-approval-modal-description'
        style={{
          // display: 'flex',
          // justifyContent: 'center',
          // alignItems: 'center',
          position: 'absolute',
          top: '35%',
          left: '35%',
          width: '500px',
          height: '200px',
          boxShadow: 24
        }}
      >
        <div style={{ backgroundColor: 'white' }}>
          <div
            style={{
              backgroundColor: '#f8f8f8',
              color: '#7367F0',
              padding: '0.80rem'
            }}
          >
            <span id='leave-approval-modal-title' toggle={() => setLeaveApprovalModal(!leaveApprovalModal)}>
              Leave Approval
            </span>
            <Icon
              icon='tabler:x'
              style={{
                position: 'absolute',
                left: '96%',
                bottom: '88%',
                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                borderRadius: '20%',
                padding: '5px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                height: '30px',
                width: '30px'
              }}
              onClick={() => setLeaveApprovalModal(false)}
            />
          </div>
          <p id='leave-approval-modal-description' style={{ margin: '10px' }}>
            Are You Sure you want to Approve Leave?
          </p>
          <div style={{ borderTop: '1px solid #ebeae8' }}></div>
          <div style={{ marginTop: '5px', marginLeft: '350px', padding: '5px' }}>
            <Button
              size='medium'
              variant='contained'
              onClick={() => {
                LeaveApprovalFetch(1), setLeaveApprovalModal(false)
              }}
            >
              Yes
            </Button>
            <Button
              size='medium'
              variant='info'
              onClick={() => {
                toast.error('You Are Requested Cancelled', {
                  position: 'bottom-right'
                })
                setLeaveApprovalModal(false)
              }}
            >
              No
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={leaveDeniedModal}
        toggle={() => setLeaveDeniedModal(!leaveDeniedModal)}
        onClose={() => setLeaveDeniedModal(false)}
        aria-labelledby='leave-denied-modal-title'
        aria-describedby='leave-denied-modal-description'
        style={{
          position: 'absolute',
          top: '35%',
          left: '35%',
          width: '500px',
          height: '200px',
          boxShadow: 24
        }}
      >
        <div style={{ backgroundColor: 'white' }}>
          <div
            style={{
              backgroundColor: '#f8f8f8',
              color: '#7367F0',
              padding: '0.80rem'
            }}
          >
            <span id='leave-denied-modal-title' toggle={() => setLeaveDeniedModal(!leaveDeniedModal)}>
              Leave Denied
            </span>
            <Icon
              icon='tabler:x'
              style={{
                position: 'absolute',
                left: '96%',
                bottom: '88%',
                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                borderRadius: '20%',
                padding: '5px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                height: '30px',
                width: '30px'
              }}
              onClick={() => setLeaveDeniedModal(false)}
            />
          </div>
          <p id='leave-denied-modal-description' style={{ margin: '10px' }}>
            Are You Sure you want to Deny Leave?
          </p>
          <div style={{ borderTop: '1px solid #ebeae8' }}></div>
          <div style={{ marginTop: '5px', marginLeft: '350px', padding: '5px' }}>
            <Button
              variant='contained'
              color='primary'
              size='medium'
              onClick={() => {
                LeaveApprovalFetch(2), setLeaveDeniedModal(!leaveDeniedModal)
              }}
            >
              Yes
            </Button>
            <Button
              size='medium'
              onClick={() => {
                toast.error('You Are Requested Cancelled', {
                  position: 'bottom-right'
                })
                setLeaveDeniedModal(!leaveDeniedModal)
              }}
            >
              No
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default MailLog
