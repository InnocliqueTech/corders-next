// ** React Import
import { useEffect, useRef, useState } from 'react'

// ** Full Calendar & its Plugins
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import interactionPlugin from '@fullcalendar/interaction'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

// import Paper from '@mui/material/Paper';
import DatePicker from 'react-multi-date-picker'

import MuiAlert from '@mui/material/Alert'

// ** Third Party Style Import
import { CheckCircle } from 'react-bootstrap-icons'
import { Question } from 'react-bootstrap-icons'
import { ExclamationCircle } from 'react-bootstrap-icons'
import { Info } from 'react-bootstrap-icons'
import { XLg } from 'react-bootstrap-icons'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MultiDatePicker from 'react-multi-date-picker'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'

import {
  Modal,
  Tab,
  Tabs,
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'

// import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios'
import { width } from '@mui/system'

//API calls
const ProviderCalendarView = process.env.NEXT_PUBLIC_FETCH_EVENTS_PROVIDERS
const LeaveStatusCheck = process.env.NEXT_PUBLIC_LEAVE_DETAILS
const AdminManagement = process.env.NEXT_PUBLIC_PHYSICIAN_SCHEDULING

const blankEvent = {
  title: '',
  start: '',
  end: '',
  allDay: false,
  url: '',
  extendedProps: {
    calendar: '',
    guests: [],
    location: '',
    description: ''
  }
}

const Calendar = props => {
  // ** Props
  const {
    store,
    dispatch,
    direction,
    updateEvent,
    calendarApi,
    calendarsColor,
    setCalendarApi,
    selectEvent,
    handleLeftSidebarToggle,
    handleAddEventSidebarToggle,
    setMonthChange,
    handleAddEventSidebar
  } = props
  function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />
  }

  // ** Refs
  const calendarRef = useRef()
  const MySwal = withReactContent(Swal)
  const datePickerRef = useRef()

  // const [monthChange, setMonthChange] = useState()
  const [month, setMonth] = useState()
  const [selectedPreviousMonth, setSelectedPreviousMonth] = useState()
  const [selectedMonth, setSelectedMonth] = useState()
  const [formModal, setFormModal] = useState(false)

  const [metricsModalOpen, setMetricsModalOpen] = useState(false)
  const [oneClickScheduleModalOpen, setOneClickScheduleModalOpen] = useState(false)
  const [oneClickScheduleData, setOneClickScheduleData] = useState()
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [nestedModal, setNestedModal] = useState(false)
  const [modalVisible, setModalVisible] = useState(true)

  const [responseData, setResponseData] = useState({
    data: {
      providersDetails: []
    },
    loading: true
  })
  const [openResultDialog, setOpenResultDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resultDialogText, setResultDialogText] = useState('')
  const [leaveDialogOpen, setLeaveDialogOPen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedDates, setSelectedDates] = useState([])
  const [halfDayLeave, setHalfDayLeave] = useState(false)
  const userRole = JSON.parse(localStorage.getItem('userData'))
  const [openModal, setOpenModal] = useState(false)
  const [nextMonth, setNextMonth] = useState(false)
  const [modalIcon, setModalICon] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [active, setActive] = useState('1')
  const [divVisible, setDivVisible] = useState(true)

  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current?.getApi())
    }
  }, [calendarApi, setCalendarApi])

  const fetchProvider = async () => {
    await axios
      .post(ProviderCalendarView, {
        requestType: 'Provider',
        accountId: '1'
      })
      .then(res => {
        localStorage.setItem('provider', JSON.stringify(res.data.providersList))

        return res
      })
  }

  // fetch Facility
  const fetchFacility = async () => {
    await axios
      .post(ProviderCalendarView, {
        requestType: 'Facility',
        accountId: '1'
      })
      .then(res => {
        localStorage.setItem('facility', JSON.stringify(res.data.facilityList))

        return res
      })
  }
  useEffect(() => {
    fetchFacility()
    fetchProvider()
  }, [])

  const handleClick = info => {
    if (userRole.userValidation.rolesList.map((dat) => dat.roleName).includes('Admin')) {
      if (
        new Date(info.date) > new Date() ||
        new Date(info.date).getDate() === new Date().getDate()
      ) {
        const ev = { ...blankEvent }
        ev.start = info.date
        ev.end = info.date
        ev.allDay = true

        // @ts-ignore
        dispatch(selectEvent(ev))
        handleAddEventSidebarToggle()
      }  else {
        return MySwal.fire({
          title: `Not Accessible`,
          text: `Date before current date is not been Changed`,
          icon: 'info',
          customClass: {
            confirmButton: 'btn btn-success'
          },
          buttonsStyling: false
        })
      }
    }
  }

  const handleClickedEvent = clickedEvent => {
    if (userRole.userValidation.rolesList.map(dat => dat.roleName).includes('Admin')) {
      if (
        new Date(clickedEvent.start) > new Date() ||
        new Date(clickedEvent.start).getDate() === new Date().getDate()
      ) {
        dispatch(selectEvent(clickedEvent))
        handleAddEventSidebarToggle()
      } else {
        return MySwal.fire({
          title: `Not Accessible`,
          text: `Date before current date is not been Changed`,
          icon: 'info',
          customClass: {
            confirmButton: 'btn btn-success'
          },
          buttonsStyling: false
        })
      }
    }
  }

  const handleMonthChange = async payload => {
    const today = new Date()
    const date = new Date(payload.endStr)
    if (today.getMonth() + 1 !== date.getMonth()) {
      localStorage.setItem(
        'monthChange',
        `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}`.includes('00')
          ? `${date.getFullYear() - 1}-12`
          : `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}`
      )
      setMonthChange(
        `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}`.includes('00')
          ? `${date.getFullYear() - 1}-12`
          : `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}`
      )
      setMonth(
        `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}`.includes('00')
          ? `${date.getFullYear() - 1}-12`
          : `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}`
      )

      const res = await axios.post(AdminManagement, {
        requestType: 'CheckScheduledForMonth',
        fromDateOfPreviousMonth: `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}`.includes('00')
          ? `${date.getFullYear() - 1}-12-01`
          : `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}-01`,
        toDateOfPreviousMonth: `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}`.includes('00')
          ? `${date.getFullYear() - 1}-12-30`
          : `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}-30`
      })
      if (res.data.scheduleResponse.status === null) {
        setNextMonth(true)
      } else {
        setNextMonth(false)
      }
    } else {
      localStorage.setItem(
        'monthChange',
        `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`
      )
      setMonthChange(`${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`)
      setMonth(`${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`)

      const res = await axios.post(AdminManagement, {
        requestType: 'CheckScheduledForMonth',
        fromDateOfPreviousMonth: `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-01`,
        toDateOfPreviousMonth: `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-30`
      })
      console.log(res)
      if (res.data.scheduleResponse.status === null) {
        setNextMonth(true)
      } else {
        setNextMonth(false)
      }
    }
    setSelectedPreviousMonth(
      `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}`.includes('00') ||
        `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}`.includes('01')
        ? `${date.getFullYear() - 1}-${(date.getMonth() + 11).toString().padStart(2, '0')}`
        : `${date.getFullYear()}-${(date.getMonth() - 1).toString().padStart(2, '0')}`
    )
    setSelectedMonth(
      `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}`.includes('00')
        ? `${date.getFullYear() - 1}-12`
        : `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}`
    )
  }

  const newArr = store.events.map(obj => {
    return {
      ...obj,
      title: obj.Leave === '' || obj.title === '' ? `${obj.title}` || `${obj.Leave}` : `${obj.title}-${obj.Leave}`
    }
  })

  const AdminArrr = store.events.map(obj => {
    return { ...obj, title: `${obj.extendedProps.calendar} : ${obj.title}` }
  })

  // ** calendarOptions(Props)

  const calendarOptions = {
    // events: store.events.length ? store.events : [],
    events: userRole.userValidation.rolesList.map(dat => dat.roleName).includes('Admin')
      ? AdminArrr.length
        ? AdminArrr
        : []
      : newArr.length
      ? newArr
      : [],
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin],
    initialView: 'dayGridMonth',
    timeZone: 'false',
    style: { backgroundColor: 'red !important' },
    headerToolbar: {
      start: 'sidebarToggle, prev, title, next',
      end: 'dayGridMonth,listMonth'
    },
    selectable: true,
    displayEventTime: false,
    views: {
      week: {
        titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
      }
    },
    editable: true,
    eventResizableFromStart: true,
    dragScroll: true,
    dayMaxEvents: 6,
    navLinks: true,
    height: 1495,
    eventClassNames({ event: calendarEvent }) {
      // @ts-ignore
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

      return [
        // Background Color
        `bg-${colorName}`
      ]
    },

    // },
    eventClick({ event: clickedEvent }) {
      dispatch(selectEvent(clickedEvent))
      handleAddEventSidebarToggle()
    },
    datesSet: handleMonthChange,
    eventClick({ event: clickedEvent }) {
      handleClickedEvent(clickedEvent)
    },
    dateClick(info) {
      handleClick(info)
    },
    eventDrop({ event: droppedEvent }) {
      dispatch(updateEvent(droppedEvent))
    },
    eventResize({ event: resizedEvent }) {
      dispatch(updateEvent(resizedEvent))
    },
    ref: calendarRef,
    direction
  }

  const BtnStyle = () => {
    return {
      padding: '8px',
      fontsize: '14px',
      textAlign: 'center',
      margin: '10px',
      backgroundColor: '#7367f0',
      border: 'none',
      color: 'white',
      borderRadius: '4px',
      cursor: 'pointer'
    }
  }

  const getTextColorStyle = (value, color) => {
    return {
      color,
      borderRight: '1px solid #A9A9A9', // Vertical line separator
      height: '10', // Adjust height as needed
      // display: 'inline-block',
      margin: '5px', // Adjust margin as needed
      width: '2px solid black',
      marginLeft: '10px',
      padding: '3px'
    }
  }

  const info = () => {
    return {
      display: 'flex',
      justifyContent: 'center',
      fontSize: '70px',
      backgroundColor: 'transparent',
      color: '#9de0f6',
      borderRadius: '100%',
      margin: 'auto',
      width: '70px',
      border: '2px solid #9de0f6'
    }
  }

  const scroolHide = () => {
    return {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      padding: '7px',
      fontsize: '8px',
      textAlign: 'center'
    }
  }

  const questionMark = () => {
    return {
      display: 'flex',
      justifyContent: 'center',
      fontSize: '70px',
      backgroundColor: 'transparent',
      color: '#87adbd',
      borderRadius: '100%',
      margin: 'auto',
      width: '70px',
      border: '2px solid #c9dae1'
    }
  }

  const handleOneClickSchedule = async () => {
    try {
      // Step 1: Check if data is scheduled for the previous month
      const checkScheduledResponse = await axios.post(AdminManagement, {
        requestType: 'CheckScheduledForMonth',
        fromDateOfPreviousMonth: `${selectedPreviousMonth}-01`,
        toDateOfPreviousMonth: `${selectedPreviousMonth}-30`
      })

      // Step 2: Handle the response
      if (checkScheduledResponse.data.scheduleResponse.status === null) {
        // No data for the previous month, show a message
        MySwal.fire({
          icon: 'info',
          title: 'Data is Not Present',
          text: 'No data is scheduled for the previous month.'
        })
      } else if (checkScheduledResponse.data.scheduleResponse.status === 'Success') {
        // Data is present, confirm scheduling
        const monthNameAndYear = getCurrentMonthNameAndYear()

        const confirmSchedule = await MySwal.fire({
          icon: 'question',
          title: 'Are you sure?',
          text: `You want to Schedule for ${monthNameAndYear}`,
          showCancelButton: true,
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel'
        })

        // Step 3: Handle the user's choice
        if (confirmSchedule.isConfirmed) {
          // Step 4: Perform auto-scheduling
          const autoScheduleResponse = await axios.post(AdminManagement, {
            requestType: 'AutoSchedule',
            fromDateOfPreviousMonth: `${selectedPreviousMonth}-01`,
            toDateOfPreviousMonth: `${selectedPreviousMonth}-30`
          })

          // Step 5: Display the result of auto-scheduling
          if (autoScheduleResponse.data.scheduleResponse.status === 'Success') {
            MySwal.fire({
              icon: 'success',
              title: 'Scheduling Successfully Done',
              text: 'Scheduling has been successfully completed.'
            })
            window.location.reload()
          } else {
            MySwal.fire({
              icon: 'error',
              title: 'Scheduling Error',
              text: 'An error occurred while scheduling.'
            })
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const isOneClickScheduleDisabled = () => {
    if (!selectedMonth) {
      return true // Disable if selectedMonth is not set
    }

    // Check if the selected month is the same as or after the current month
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1 // January is 0 in JavaScript
    const [year, month] = selectedMonth.split('-').map(Number)

    if (year < currentYear) {
      return true // Disable for previous years
    }

    if (year === currentYear && month < currentMonth) {
      return true // Disable for previous months in the current year
    }

    return false // Enable for current and future months
  }

  //-----------------Metric popup----------------------------
  const handleOpenMetricsModal = () => {
    setMetricsModalOpen(true)
  }

  const handleCloseMetricsModal = () => {
    setMetricsModalOpen(false)
  }
  useEffect(() => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1

    // Format the date as "YYYY-MM"
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}`
    axios
      .post(AdminManagement, {
        requestType: 'ProviderWorkingDaysInMonth',
        date: selectedMonth === undefined ? formattedDate : selectedMonth
      })
      .then(response => {
        // setResponseData(response.data)
        setResponseData({ data: response.data, loading: false })
      })
  }, [selectedMonth])

  const getCurrentMonthNameAndYear = () => {
    // Parse the selectedMonth string to create a Date object
    const date = new Date(selectedMonth)

    // Get the full month name
    const monthName = date.toLocaleString('default', { month: 'long' })

    // Get the year
    const year = date.getFullYear()

    // Combine the month name and year
    const result = `${monthName} ${year}`

    return result
  }

  //------------Leave------------------

  const [halfDay, setHalfDay] = useState(0)
  const [picker, setPicker] = useState([])
  const [leaves, setLeaves] = useState([])

  const handleSelection = dates => {
    axios
      .post(LeaveStatusCheck, {
        requestType: 'LeaveStatusCheck',
        date: dates.toString(),
        providerId: userRole.userId
      })
      .then(res => {
        if (
          res.data.leaveStatusCheckResponse.leaveStatusCheck === null ||
          res.data.leaveStatusCheckResponse.leaveStatusCheck.status === 3 ||
          res.data.leaveStatusCheckResponse.leaveStatusCheck.status === 2
        ) {
          setPicker(dates)
        } else {
          setNestedModal(true)
        }
      })
  }

  const handleSuccess = () => {
    axios
      .post(LeaveStatusCheck, {
        requestType: 'LeaveApply',
        isHalfday: halfDay,
        date: picker.map(dat => dat.format('YYYY-MM-DD')).toString(),
        providerId: userRole.userId
      })

      // .then(res => console.log(res, 'res from handlesuccess'))
      // .catch(err => console.log(err, 'err from handlesuccess'))
      
      .then(res => {
        console.log(res, 'res from handlesuccess');
        toast.success('Leave applied successfully'); // Show success toast
        setPicker([])
      })
      .catch(err => {
        console.error(err, 'err from handlesuccess');
        toast.error('Something went wrong while applying the leave'); // Show error toast
      });


    //added here
    setTimeout(() => {
      setModalVisible(false)
      setFormModal(!formModal)
    }, 1000)

    //fetchLeaveDetails()
  }

  const fetchLeaveDetails = async () => {
    setLoading(true);
    const currentDate = new Date().toISOString().split('T')[0];
   
    await axios
      .post(LeaveStatusCheck, {
        requestType: 'FetchLeaveDetails',
        providerId: userRole.userId
      })
      .then(res => {
        console.log(res, 'res for leaves')
        const data = []
        res.data.fetchLeaveResponse.fetchLeaveDetails.map(dat => {
          if (dat.status === 0) {
            //data.push(dat.dates)
            if (dat.dates >= currentDate) {
              data.push(dat.dates)
            }
          }

        })
        console.log(data, 'from current dates')
        setLeaves(data)
      })
  }
  useEffect(() => {
    fetchLeaveDetails()
  }, [active])

  const removeLeave = data => {
    // Set the z-index for .swal2-container
    // const swal2Container = document.querySelector('.swal2')
    // if (swal2Container) {
    //   swal2Container.style.zIndex = ' 20000 !important'
    // }
    setTimeout(() => {
      setFormModal(false)
    }, 500)

    return MySwal.fire({
      title: `Leave Cancel`,
      text: `Are you sure you want to cancel Leave on ${data}`,
      icon: 'info',
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-outline-danger ms-1',
        swal2: 'z-index-20000'
      }
    }).then(function (result) {
      if (result.value) {
        axios
          .post(LeaveStatusCheck, {
            requestType: 'LeaveCancel',
            date: data,
            providerId: userRole.userId
          })
          .then(res => {
            if (res.status === 200) {
              MySwal.fire({
                icon: 'success',
                title: 'Thank you',
                text: `Your request is sent for cancelling Leave on ${data} `,
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              })
            }
            window.location.reload()
          })
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
        MySwal.fire({
          title: 'Cancelled',
          text: 'Your Leave is not Cancelled',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }
    })
  }

  function formatDate(date) {
    const year = date.getFullYear()
    let month = (date.getMonth() + 1).toString()
    if (month.length === 1) {
      month = '0' + month // Add leading zero if month is a single digit
    }
    let day = date.getDate().toString()
    if (day.length === 1) {
      day = '0' + day // Add leading zero if day is a single digit
    }

    return `${year}-${month}-${day}`
  }

  // set Half day
  const onChange = e => {
    // Toggle between 0 and 1
    const newHalfDay = halfDay === 0 ? 1 : 0
    setHalfDay(newHalfDay)
  }

  const handleLeaveOpenDialog = () => {
    setLeaveDialogOPen(true)
  }

  const handleLeaveCloseDialog = () => {
    setLeaveDialogOPen(false)
  }

  const handleApplyLeave = () => {
    // Handle applying leave logic here
    setLeaveDialogOPen(false)
  }

  const handleCancelLeave = () => {
    // Handle canceling leave logic here
    setLeaveDialogOPen(false)
  }

  const handleAddDate = () => {
    if (selectedDate) {
      setSelectedDates([...selectedDates, selectedDate])
      setSelectedDate('')
    }
  }

  const handleRemoveDate = index => {
    const newPicker = [...picker]
    newPicker.splice(index, 1)
    setPicker(newPicker)
  }

  function leaveChildModal() {
    const handleChildClose = () => {
      setOpen(false)
    }

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 600,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      pt: 2,
      px: 4,
      pb: 3
    }

    return (
      <div>
        {/* <Button variant='contained' color='primary' style={{ marginRight: '5px' }} onClick={handleChildOpen}>
          Proceed
        </Button>
        <Modal
          open={childOpen}
          onClose={handleChildClose}
          aria-labelledby='child-modal-title'
          aria-describedby='child-modal-description'
        >
          <Box
            sx={{ ...style, width: 450 }}
            style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ marginTop: '13px' }}>
              <Info style={info()} />
            </div>
            <div>
              <h2 id='child-modal-title'>Leave Cancel </h2>
              <p style={{ fontWeight: 'lighter' }}>`Are you sure you want to cancel Leave on ${data}`</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
              <Button color='primary' variant='contained' onClick={() => handleSuccess()}>
                Ok
              </Button>
              <Button variant='outlined' color='error' onClick={handleChildClose}>
                Cancle
              </Button>
            </div>
          </Box>
        </Modal> */}
        {modalVisible && (
          <Box
            sx={{ ...style, width: 450 }}
            style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ marginTop: '13px' }}>
              <Info style={info()} />
            </div>
            <div>
              <h2 id='child-modal-title'>Are you Sure ? </h2>
              <p style={{ fontWeight: 'lighter' }}> You want to take leave!</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
              {picker.length > 0 ? (
                <Button color='primary' variant='contained' onClick={handleSuccess}>
                  Proceed
                </Button>
              ) : (
                <Button color='primary' disabled>
                  Proceed
                </Button>
              )}
              <Button variant='outlined' color='error' onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </Box>
        )}
      </div>
    )
  }

  function ChildModal() {
    const [open, setOpen] = useState(false)

    const handleOpen = () => {
      setOpen(true)
    }

    const handleClose = () => {
      setOpen(false)
    }

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 600,
      bgcolor: 'background.paper',

      //border: '2px solid #000',
      boxShadow: 24,
      pt: 2,
      px: 4,
      pb: 3
    }

    return (
      <div>
        <Button variant='contained' color='primary' style={{ marginRight: '5px' }} onClick={handleOpen}>
          Proceed
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='child-modal-title'
          aria-describedby='child-modal-description'
        >
          <Box
            sx={{ ...style, width: 450 }}
            style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ marginTop: '13px' }}>
              <Info style={info()} />
            </div>
            <div>
              <h2 id='child-modal-title'>Are you Sure ? </h2>
              <p style={{ fontWeight: 'lighter' }}> You want to take leave!</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
              {picker.length > 0 ? (
                <Button color='primary' variant='contained' onClick={() => handleSuccess()}>
                  Confirm
                </Button>
              ) : (
                <Button color='primary' disabled>
                  Confirm
                </Button>
              )}
              <Button variant='outlined' color='error' onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    )
  }

  const handleButtonClick = (value) => {
    setActive(value);
  };
  const monthNameAndYear = getCurrentMonthNameAndYear()
  function CustomMultipleInput({onFocus, value}) {
    return (
      <input
      id="datePickerInput"
        onFocus={onFocus}
        value={value}
        placeholder='Select Date'
        readOnly
        style={{ display: "block",
        marginTop:"20px",
        marginBottom:"15px",           
         width: "480px",
          border: "1px solid gray",
          height: "40px",
          color: "black",
        alignContent:"center",
        boxSizing: "border-box",
        fontSize:"15px"
       
      }}
      />
    )
  }
  if (store) {
    return (
      <>
        <div className='d-flex justify-content-between'>
          <div>
            <button className='btn btn-primary mr-2' style={BtnStyle()} onClick={() => setFormModal(true)}>
              <span> + </span>Leave
            </button>

            <Dialog
              open={formModal}
              onClose={() => setFormModal(false)}
              aria-labelledby='modal-title'
              aria-describedby='modal-description'

              maxWidth="sm"
            >
              <div style={{ width: '550px', height:"350px" }}>
              <DialogTitle>
           
                <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
                  <Button
                    variant={active === '1' ? 'contained' : 'text'}
                    color="primary"
                    onClick={() => handleButtonClick('1')}
                    style={{ color: active === '1' ? 'white' : 'gray' }}

                  >
                    Apply Leave
                  </Button>
                  <Button
                    variant={active === '2' ? 'contained' : 'text'}
                    color="primary"
                    onClick={() => handleButtonClick('2')}
                    style={{ color: active === '2' ? 'white' : 'gray' }}

                  >
                    Cancel Leave
                  </Button>
                </div>
              </DialogTitle>
              <DialogContent>
                {active === '1' && (
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item sm={12}>
                        <DatePicker
                          value={picker}
                          onChange={handleSelection}
                          multiple
                          format='YYYY-MM-DD'
                          minDate={new Date()}
                          calendarPosition='top-center'
                          ref={datePickerRef}
                          shouldCloseOnSelect={() => datePickerRef.current.closeCalendar()}
                        
                          style={{
                            width: "500px",
                            height: "300px", 
                          }}
                        
                          placeholder='Select Date'
                          render={<CustomMultipleInput 
                          />}
                        >
                          <div
                            type='button'
                            className='rounded-circle mb-1 border-danger'
                            onClick={() => datePickerRef.current.closeCalendar()}
                            size={18}
                            style={{ cursor: "pointer" }}
                          >
                            Close
                          </div>
                        </DatePicker>
                      </Grid>
                      <Grid item sm={12}>
                        {/* <FormControlLabel
                          control={<Switch checked={halfDay} onChange={onChange} name='customSwitch' color='primary' />}
                          label='Half Day'
                        /> */}
                        <FormControlLabel
                          control={<Switch checked={halfDay === 1} onChange={onChange} name='customSwitch' color='primary' />}
                          label='Half Day'
                        />
                      </Grid>
                    </Grid>

                    <Typography variant='h6' gutterBottom mt={2}>
                      Selected Dates
                    </Typography>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {picker.map((date, index) => (
                        <div key={date} style={{ flexBasis: '50%', padding: '8px', boxSizing: 'border-box' }}>
                          <div
                            style={{
                              display: 'flex',
                              backgroundColor: '#ccf5fa',
                              justifyContent: 'space-between',
                              padding: '8px',
                              border: '1px solid #b6dbe1'
                            }}
                          >
                            <span>{date.format('YYYY-MM-DD')}</span>
                            <button
                              type='button'
                              className='btn btn-close'
                              aria-label='Close'
                              onClick={() => handleRemoveDate(index)}
                              style={{
                                borderRadius: '10px',
                                border: 'none',
                                backgroundColor: '#7367f0',
                                color: 'white'
                              }}
                            >
                              ⨉
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* <hr className='container-fluid' style={{width:"100%", backgroundColor:"1px solid #b6dbe1", height:"1px", marginTop:"10px"}}/> */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '20px' }}>
                      <ChildModal />
                      <Button variant='contained' color='primary' onClick={() => setFormModal(!formModal)}>
                        Close
                      </Button>
                    </div>
                  </Box>
                )}
               {active === '2' && (
                  <Box>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {leaves &&
                        leaves.map((dt, index) => (
                          <div key={dt} style={{ flexBasis: '50%', padding: '8px', boxSizing: 'border-box' }}>
                            <div
                              style={{
                                display: 'flex',
                                backgroundColor: '#ccf5fa',
                                justifyContent: 'space-between',
                                padding: '8px',
                                border: '1px solid #b6dbe1'
                              }}
                            >
                              <span key={index}>{dt}</span>
                              <button
                                type='button'
                                className='btn btn-close'
                                aria-label='Close'
                                onClick={() => removeLeave(dt)}
                                style={{
                                  borderRadius: '10px',
                                  border: 'none',
                                  backgroundColor: '#7367f0',
                                  color: 'white',
                                  cursor: 'pointer'
                                }}
                              >
                                ⨉
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                    <Button
                      variant='contained'
                      style={{ float: 'right' }}
                      color='primary'
                      onClick={() => setFormModal(!formModal)}
                    >
                      Close
                    </Button>
                  </Box>
                )
                }
              </DialogContent>
              <div>
                <Modal
                  open={nestedModal}
                  onClose={() => setNestedModal(false)}
                  aria-labelledby='modal-title'
                  aria-describedby='modal-description'
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 550,
                    height: 250,
                    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                    borderRadius: '15px'
                  }}
                >
                  <div
                    className='modal-content'
                    style={{
                      backgroundColor: '#ffff',
                      height: '250px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <div
                      style={{
                        borderRadius: '50%',
                        border: '2px solid red',
                        padding: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon icon='tabler:x' fontSize={40} color='red' />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <h1>Already Applied!</h1>
                      <div className='modal-body'>Your already applied for leaves on these days!</div>
                    </div>
                    <div className='modal-footer ' style={{ marginTop: '10px' }}>
                      <Button variant='contained' color='success' onClick={() => setNestedModal(false)}>
                        OK
                      </Button>
                    </div>
                  </div>
                </Modal>
              </div>
              </div>
            </Dialog>
            <button className='btn btn-primary mr-2' style={BtnStyle()} onClick={handleOpenMetricsModal}>
              Metrics
            </button>
            <Modal
              className='container'
              open={metricsModalOpen} // Conditionally render based on metricsModalOpen state
              onClose={handleCloseMetricsModal}
              aria-labelledby='metrics-modal-title'
              aria-describedby='metrics-modal-description'
            >
              <Box className='container'>
                <div style={{ display: 'flex', float: 'right', padding: '3px' }}>
                  <button
                    type='button'
                    className='close'
                    onClick={handleCloseMetricsModal}
                    style={{ cursor: 'pointer' }}
                  >
                    &times;
                  </button>
                </div>
                <div className='container'>
                  <TableContainer component={Paper} style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                    <Table aria-label='simple table'>
                      <TableHead>
                        <TableRow style={{ backgroundColor: '#f3f2f7' }}>
                          <TableCell style={scroolHide()}>PROVIDER NAME</TableCell>
                          <TableCell style={scroolHide()}>QUAIL RUN</TableCell>
                          <TableCell style={scroolHide()}>DESTINY SPRINGS</TableCell>
                          <TableCell style={scroolHide()}>VALLEY</TableCell>
                          <TableCell style={scroolHide()}>COPPER SPRINGS</TableCell>
                          <TableCell style={scroolHide()}>OASIS</TableCell>
                          <TableCell style={scroolHide()}>VIA LINDA</TableCell>
                          <TableCell style={scroolHide()}>COPPER EAST</TableCell>
                          <TableCell style={scroolHide()}>ZENITH</TableCell>
                          <TableCell style={scroolHide()}>TOTAL</TableCell>
                          <TableCell style={scroolHide()}>WEEKDAYS</TableCell>
                          <TableCell style={scroolHide()}>WEEKENDS</TableCell>
                          <TableCell style={scroolHide()}>RATIO</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {responseData.data && responseData.data.providersDetails ? (
                          responseData.data.providersDetails.map((provider, index) => (
                            <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell style={scroolHide()}>{provider.providerName}</TableCell>
                              {/* Quail Run */}
                              <TableCell style={scroolHide()}>
                                <span style={getTextColorStyle(provider.hospitalMap['Quail Run'].weekdays, 'red')}>
                                  {provider.hospitalMap['Quail Run'].weekdays}
                                </span>
                                <span style={getTextColorStyle(provider.hospitalMap['Quail Run'].weekends, 'blue')}>
                                  {provider.hospitalMap['Quail Run'].weekends}
                                </span>
                              </TableCell>
                              {/* Destiny Springs */}
                              <TableCell style={scroolHide()}>
                                <span
                                  style={getTextColorStyle(provider.hospitalMap['Destiny Springs'].weekdays, 'red')}
                                >
                                  {provider.hospitalMap['Destiny Springs'].weekdays}
                                </span>
                                <span
                                  style={getTextColorStyle(provider.hospitalMap['Destiny Springs'].weekends, 'blue')}
                                >
                                  {provider.hospitalMap['Destiny Springs'].weekends}
                                </span>
                              </TableCell>
                              {/* Valley */}
                              <TableCell style={scroolHide()}>
                                <span style={getTextColorStyle(provider.hospitalMap['Valley'].weekdays, 'red')}>
                                  {provider.hospitalMap['Valley'].weekdays}
                                </span>
                                <span style={getTextColorStyle(provider.hospitalMap['Valley'].weekends, 'blue')}>
                                  {provider.hospitalMap['Valley'].weekends}
                                </span>
                              </TableCell>
                              {/* Copper Springs */}
                              <TableCell style={scroolHide()}>
                                <span style={getTextColorStyle(provider.hospitalMap['Copper Springs'].weekdays, 'red')}>
                                  {provider.hospitalMap['Copper Springs'].weekdays}
                                </span>
                                <span
                                  style={getTextColorStyle(provider.hospitalMap['Copper Springs'].weekends, 'blue')}
                                >
                                  {provider.hospitalMap['Copper Springs'].weekends}
                                </span>
                              </TableCell>
                              {/* Oasis */}
                              <TableCell style={scroolHide()}>
                                <span style={getTextColorStyle(provider.hospitalMap['Oasis'].weekdays, 'red')}>
                                  {provider.hospitalMap['Oasis'].weekdays}
                                </span>
                                <span style={getTextColorStyle(provider.hospitalMap['Oasis'].weekends, 'blue')}>
                                  {provider.hospitalMap['Oasis'].weekends}
                                </span>
                              </TableCell>
                              {/* Via Linda */}
                              <TableCell style={scroolHide()}>
                                <span style={getTextColorStyle(provider.hospitalMap['Via Linda'].weekdays, 'red')}>
                                  {provider.hospitalMap['Via Linda'].weekdays}
                                </span>
                                <span style={getTextColorStyle(provider.hospitalMap['Via Linda'].weekends, 'blue')}>
                                  {provider.hospitalMap['Via Linda'].weekends}
                                </span>
                              </TableCell>
                              {/* Copper East */}
                              <TableCell style={scroolHide()}>
                                <span style={getTextColorStyle(provider.hospitalMap['Copper East'].weekdays, 'red')}>
                                  {provider.hospitalMap['Copper East'].weekdays}
                                </span>
                                <span style={getTextColorStyle(provider.hospitalMap['Copper East'].weekends, 'blue')}>
                                  {provider.hospitalMap['Copper East'].weekends}
                                </span>
                              </TableCell>
                              {/* Zenith */}
                              <TableCell style={scroolHide()}>
                                <span style={getTextColorStyle(provider.hospitalMap['Zenith'].weekdays, 'red')}>
                                  {provider.hospitalMap['Zenith'].weekdays}
                                </span>
                                <span style={getTextColorStyle(provider.hospitalMap['Zenith'].weekends, 'blue')}>
                                  {provider.hospitalMap['Zenith'].weekends}
                                </span>
                              </TableCell>
                              <TableCell style={scroolHide()}>{provider.totalDays}</TableCell>
                              <TableCell style={scroolHide()}>{provider.totalWeekdays}</TableCell>
                              <TableCell style={scroolHide()}>{provider.totalWeekends}</TableCell>
                              <TableCell style={scroolHide()}>{provider.ratio}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan='13'>Loading...</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '10px',
                          height: '10px',
                          backgroundColor: 'red',
                          marginRight: '5px'
                        }}
                      ></span>
                      <span>Weekdays</span>
                      <span style={{ marginLeft: '10px', marginRight: '10px' }}></span>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '10px',
                          height: '10px',
                          backgroundColor: 'blue',
                          marginRight: '5px'
                        }}
                      ></span>
                      <span>Weekends</span>
                    </div>
                  </TableContainer>
                </div>
              </Box>
            </Modal>
            {userRole.userValidation.rolesList.map(dat => dat.roleName).includes('Admin') ? isOneClickScheduleDisabled() === false ? nextMonth === true ? <Button color='warning' size='sm' onClick={handleOneClickSchedule} variant='contained' >One Click Schedule</Button> : <Button size='sm' disabled variant='contained' >One Click Schedule</Button> : null : null}    
          </div>
          <FullCalendar {...calendarOptions} />
        </div>
      </>
    )
  } else {
    return null
  }
}

export default Calendar

// import { Menu, Plus, X, Filter } from 'react-feather'

// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Switch from '@mui/material/Switch';
// import Snackbar from '@mui/material/Snackbar';

// import Box from '@mui/material/Box';
// import Modal from '@mui/material/Modal';
// import Button from '@mui/material/Button';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Tabs,
//   Tab,
//   Box,
//   TextField,
//   FormControlLabel,
//   Switch,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   IconButton,
// } from "@mui/material";

// const [halfDay, setHalfDay] = useState("1")
// const [leaves, setLeaves] = useState([])
// const [picker, setPicker] = useState([])

// if (date.getMonth() === today.getMonth() + 1) {
//   setCurrentMonth(false)
// } else {
//   setCurrentMonth(true)
// }

// const [active, setActive] = useState("1");
// const [selectedDate, setSelectedDate] = useState("");

// eventClassNames({ event: calendarEvent }) {
//   // eslint-disable-next-line no-underscore-dangle
//   const colorName =
//     calendarsColor[calendarEvent._def.extendedProps.calendar]
//   //  background: rgba($color_value, 0.12) !important;
//   // color: $color_value !important;
//   // if(colorName)
//   // `back-${colorName}`
//   if (colorName == 'primary') {
//     return ['back-info']
//   } else {

//     return [
//       // Background Color
//       'back-error'
//     ]
//   }
// },
// eventClassNames({ event: calendarEvent }) {
//   // const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

//   // return [`bg-${colorName}`]
//   // eslint-disable-next-line no-underscore-dangle
//   const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]
//   console.log('COLORNAME', colorName)
//   //  background: rgba($color_value, 0.12) !important;
//   // color: $color_value !important;
//   // if(colorName)
//   // `back-${colorName}`
//   if (colorName == 'primary') {
//     return ['back-info']
//   } else {
//     return [
//       // Background Color
//       'back-error'
//     ]
//   }

// * Only grab required field otherwise it goes in infinity loop
// ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
// event.value = grabEventDataFromEventApi(clickedEvent)

// eslint-disable-next-line no-use-before-define
// isAddNewEventSidebarActive.value = true

// const onChange = (e) => {
//   setHalfDay(e.target.checked);
// };

// const onChange = () => {
//   setHalfDay(!halfDay)
// }
// Check Leave status
// const handleSelection = (dates) => {
//   // console.log(datePickerRef, dates)
//   // setDatePicker(dates.target.value);
//   axios
//     .post(LeaveStatusCheck, {
//       requestType: "LeaveStatusCheck",
//       date: dates.toString(),
//       providerId: userRole.id
//     })
//     .then((res) => {
//       console.log(res,"res from handle selection")
//       if (
//         res.data.leaveStatusCheckResponse.leaveStatusCheck === null ||
//         res.data.leaveStatusCheckResponse.leaveStatusCheck.status === 3 ||
//         res.data.leaveStatusCheckResponse.leaveStatusCheck.status === 2
//       ) {
//         setPicker(dates)
//         console.log(setPicker(dates), "setPicker(dates)")
//       } else {
//         MySwal.fire({
//           icon: "error",
//           title: "Already Applied!",
//           text: "Your already applied for leaves this days!",
//           customClass: {
//             confirmButton: "btn btn-success"
//           }
//         })
//       }
//     })
// }

// const handleSelection = dates => {
//   axios
//     .post(LeaveStatusCheck, {
//       requestType: 'LeaveStatusCheck',
//       date: dates.toString(),
//       providerId: userRole.userId
//     })
//     .then(res => {
//       if (
//         res.data.leaveStatusCheckResponse.leaveStatusCheck === null ||
//         res.data.leaveStatusCheckResponse.leaveStatusCheck.status === 3 ||
//         res.data.leaveStatusCheckResponse.leaveStatusCheck.status === 2
//       ) {
//         setPicker(dates)
//         console.log(setPicker(dates), 'setPicker(dates)')
//       } else {
//         MySwal.fire({
//           icon: 'error',
//           title: 'Already Applied!',
//           text: 'Your already applied for leaves this days!',
//           customClass: {
//             confirmButton: 'btn btn-success'
//           }
//         })
//       }
//     })
// }

// Open SweetAlert dialog here, after the existing Dialog is closed.
// setFormModal(false) // Close the existing Dialog first
// setTimeout(() => {
//   MySwal.fire({
//     icon: 'error',
//     title: 'Already Applied!',
//     text: 'You have already applied for leaves on these days!',
//     customClass: {
//       confirmButton: 'btn btn-success'
//     }
//   })
// }, 100)

// Leave Apply
// const handleSuccess = () => {
//   axios.post(LeaveStatusCheck, {
//     requestType: 'LeaveApply',
//     isHalfday: halfDay,
//     date: picker.map(dat => dat.format('YYYY-MM-DD')).toString(),
//     providerId: userRole.userId
//   })
//   return MySwal.fire({
//     title: 'Are you Sure ?',
//     text: 'You want to take leave!',
//     icon: 'info',
//     confirmButtonText: 'Confirm',
//     showCancelButton: true,
//     customClass: {
//       confirmButton: 'btn btn-primary',
//       cancelButton: 'btn btn-outline-danger ms-1'
//     },
//     buttonsStyling: false
//   }).then(function (result) {
//     if (result.value) {
//       setFormModal(!formModal)
//     }
//   })
// }

// const handleRemoveDate = (dateToRemove) => {
//   setSelectedDates(selectedDates.filter((date) => date !== dateToRemove));
// };
// const handleRemoveDate = (index) => {
//   const updatedPicker = [...picker];
//   updatedPicker.splice(index, 1);
//   setPicker(updatedPicker);
// };

{
  /* <List style={{display:"flex", justifyContent:"space-evenly"}}>
                      {picker.map((date, index) => (
                        <ListItem key={index} style={{border:"contain", backgroundColor:"red"}}>
                          <span >{date.format('YYYY-MM-DD')}</span>
                          <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            onClick={() => handleRemoveDate(index)}
                            style={{ marginLeft: '8px' }}
                          >
                            ⨉
                          </Button>
                        </ListItem>
                      ))}
                    </List> */
}

{
  /* <Button
                        variant='contained'
                        color='primary'
                        onClick={() => handleSuccess()}
                        disabled={picker.length === 0}
                      >
                        Proceed
                      </Button> */
}

{
  /* <Dialog
              className='container'
              open={oneClickScheduleModalOpen} // Conditionally render based on oneClickScheduleModalOpen state
              onClose={handleCloseOneClickScheduleModal}
              aria-labelledby="one-click-schedule-modal-title"
              aria-describedby="one-click-schedule-modal-description"
              style={{ padding: "20px" }}
            >
              <DialogTitle id="alert-dialog-title">
                <i class="bi bi-question-lg" style={questionMark()}></i>
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <h1 style={{ display: "flex", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>Are you sure?</h1>
                  <h3 style={{ fontWeight: "lighter" }}>You want to Schedule for {monthNameAndYear}</h3>
                </DialogContentText>
              </DialogContent>
              <DialogActions style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
                <Button onClick={handleClose} style={{ border: "content", backgroundColor: "#7066e0", color: "white" }}>
                  Confirm
                </Button>
                <Button style={{ border: "content", backgroundColor: "#6e7881", color: "white" }} onClick={handleCloseOneClickScheduleModal}>Cancel</Button>
              </DialogActions>
            </Dialog> */
}
{
  /* Dialog for confirming scheduling */
}

{
  /* <Dialog open={openDialog} onClose={handleDialogClose}>
              <DialogTitle>
                <Question style={questionMark()} />
              </DialogTitle>
              <DialogContent>
                <h1 style={{ display: "flex", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>Are you sure?</h1>
                <h3 style={{ fontWeight: "lighter" }}>You want to Schedule for {getCurrentMonthNameAndYear()}</h3>
              </DialogContent>
              <DialogActions style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
                <Button onClick={handleAutoSchedule} style={{ border: "content", backgroundColor: "#7066e0", color: "white" }}>
                  Confirm
                </Button>
                <Button style={{ border: "content", backgroundColor: "#6e7881", color: "white" }} onClick={handleDialogClose}>Cancel</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openModal} onClose={handleModalClose}>
              <DialogTitle>{modalIcon}</DialogTitle>
              <DialogContent>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <h1>{modalTitle}</h1>
                  <h3 style={{ fontWeight: "lighter" }}>{subTitle}</h3>
                </div>
              </DialogContent>
              <DialogActions style={{ display: "flex", justifyContent: "center" }}>
                <Button onClick={handleModalClose} style={{ border: "content", backgroundColor: "#7066e0", color: "white", }}>
                  Ok
                </Button>
              </DialogActions>
            </Dialog> */
}
