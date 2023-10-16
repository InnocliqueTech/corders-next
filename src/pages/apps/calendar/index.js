// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'


// ** FullCalendar & App Components Imports
import Calendar from 'src/views/apps/calendar/Calendar'
import SidebarLeft from 'src/views/apps/calendar/SidebarLeft'
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'
import AddEventSidebar from 'src/views/apps/calendar/AddEventSidebar'




// ** Actions
import {
  addEvent,
  fetchEvents,
  deleteEvent,
  updateEvent,
  selectEvent,
  removeEvent,
   updateFilter, updateAllFilterTitle, updateFiltertitle, updateAllFilters

} from 'src/store/apps/calendar'

// const blankEvent = {
//   title: '',
//   start: '',
//   end: '',
//   allDay: true,
//   url: '',
//   extendedProps: {
//     calendar: '',
//     title: ''
//   }
// }
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


// ** CalendarColors
// const calendarsColor = {
//   Personal: 'error',
//   Business: 'primary',
//   Family: 'warning',
//   Holiday: 'success',
//   ETC: 'info'
// }

const getAvatarStyles = (skinColor) => {
  let avatarStyles
  avatarStyles = {
    color: `${skinColor} !important`,
    backgroundColor: `rgba(${skinColor}, 0.12) !important`
  }

  return avatarStyles
}

// ** CalendarColors
const calendarsColor = {
  Valley: 'primary',
  'Quail Run': 'info',
  'Copper Springs': 'success',
  Oasis: 'error',
  'Destiny Springs': 'warning',
  Zenith: 'info',
  'Via Linda': 'primary',
  'Copper East': 'primary'
}


const AppCalendar = () => {
  // ** States
  const [calendarApi, setCalendarApi] = useState(null)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [addEventSidebarOpen, setAddEventSidebarOpen] = useState(false)
  const [monthChange, setMonthChange] = useState()
  const [addSidebarOpen, setAddSidebarOpen] = useState(false)

  // ** Hooks
  const { settings } = useSettings()
  const dispatch = useDispatch()
  const store = useSelector(state => state.calendar)
  console.log('STORE', store)

  // ** Vars
  const leftSidebarWidth = 300
  const addEventSidebarWidth = 400
  const { skin, direction } = settings
  const mdAbove = useMediaQuery(theme => theme.breakpoints.up('md'))
  useEffect(() => {
    dispatch(fetchEvents(store.selectedCalendars))
  }, [dispatch, store.selectedCalendars])
  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
  const handleAddEventSidebarToggle = () => setAddEventSidebarOpen(!addEventSidebarOpen)

  useEffect(() => {
    dispatch(fetchEvents(store.selectedCalendars))
  }, [monthChange])

   // ** refetchEvents
   const refetchEvents = () => {
    if (calendarApi !== null) {
      calendarApi.refetchEvents()
    }
  }

  // ** AddEventSidebar Toggle Function
  const handleAddEventSidebar = () => setAddSidebarOpen(!addSidebarOpen)

  return (
    <CalendarWrapper
      className='app-calendar'
      sx={{
        boxShadow: skin === 'bordered' ? 0 : 6,
        ...(skin === 'bordered' && { border: theme => `1px solid ${theme.palette.divider}` })
      }}
    >
      <SidebarLeft
        store={store}
        mdAbove={mdAbove}
        dispatch={dispatch}
        calendarApi={calendarApi}
        leftSidebarOpen={leftSidebarOpen}
        leftSidebarWidth={leftSidebarWidth}
        selectEvent={selectEvent}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        handleAddEventSidebarToggle={handleAddEventSidebarToggle}
        handleAddEventSidebar={handleAddEventSidebar}
        updateFilter={updateFilter}
        updateFiltertitle={updateFiltertitle}
        updateAllFilters={updateAllFilters}
        updateAllFilterTitle={updateAllFilterTitle}
      />
      
      <Box
        sx={{
          p: 6,
          pb: 0,
          flexGrow: 1,
          borderRadius: 1,
          boxShadow: 'none',
          backgroundColor: 'background.paper',
          ...(mdAbove ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {})
        }}
      >
        <Calendar
          store={store}
          dispatch={dispatch}
          direction={direction}
          updateEvent={updateEvent}
          blankEvent={blankEvent}
          calendarApi={calendarApi}
          calendarsColor={calendarsColor}
          setCalendarApi={setCalendarApi}
          selectEvent={selectEvent}
          handleLeftSidebarToggle={handleLeftSidebarToggle}
          handleAddEventSidebarToggle={handleAddEventSidebarToggle}
          setMonthChange={setMonthChange}
          handleAddEventSidebar={handleAddEventSidebar}
        />
      </Box>
      <AddEventSidebar
        store={store}
        dispatch={dispatch}
        addEvent={addEvent}
        updateEvent={updateEvent}
        removeEvent={removeEvent}
        open={addSidebarOpen}
        calendarApi={calendarApi}
        drawerWidth={addEventSidebarWidth}
        selectEvent={selectEvent}
        addEventSidebarOpen={addEventSidebarOpen}
        handleAddEventSidebarToggle={handleAddEventSidebarToggle}
        handleAddEventSidebar={handleAddEventSidebar}
        refetchEvents={refetchEvents}
        calendarsColor={calendarsColor}
        fetchEvents = { fetchEvents }
      />
    </CalendarWrapper>
  )
}

export default AppCalendar