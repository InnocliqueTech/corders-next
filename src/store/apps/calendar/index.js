// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'


//  const userRole = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userData')) : null;




//Api Calls
const ProviderCalendarView = process.env.NEXT_PUBLIC_FETCH_EVENTS_PROVIDERS
const AdminCalendarView = process.env.NEXT_PUBLIC_PHYSICIAN_SCHEDULING

//Date for input
const date = new Date()
const input = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`


const facility = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('facility')) : null
const provider = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('provider')) : null

// fetchEvents for calendar
export const fetchEvents = createAsyncThunk('appCalendar/fetchEvents', async (calendars, { getState }) => {
  const userRole = JSON.parse(localStorage.getItem('userData'))
  const monthChange = localStorage.getItem('monthChange')
  const providerFilter = calendars.a === null ? calendars.b : null
  const hospitalFilter = calendars.b === null ? calendars.a : null
  const providerAllFilter = calendars.c === undefined ? null : calendars.c === 1 ? calendars.d : 1
  const hospitalAllFilter = calendars.e === undefined ? null : calendars.f === 1 ? calendars.e : 1
  console.log(hospitalAllFilter)

  // Admin Filter View
  if (userRole.userValidation.rolesList.map(dat => dat.roleName).includes('Admin')) {
    if (localStorage.getItem('key') === '1') {
      const response = await axios.post(AdminCalendarView, {
          requestType:"adminFilterView",
          inputDate: monthChange === null ? input : monthChange,
          searchProviderId:providerAllFilter === null ? (providerFilter === null ? String(getState().calendar.selectedtitle) : String(getState().calendar.selectedtitle.filter(i => i !== providerFilter))) : String(providerAllFilter),
          searchHospitalId:hospitalAllFilter === null ? (hospitalFilter === null ? String(getState().calendar.selectedCalendars) : String(getState().calendar.selectedCalendars.filter(i => i !== hospitalFilter))) : String(hospitalAllFilter),
          accountId:1
        
      }, { calendars })

      const adminFilterData = response.data.filterViewInfo.map((dat, index) => ({
          id: index,
          url: '',
          title: dat.providerName,
          start: new Date(String(dat.scheduledDate)).toISOString(),
          allDay: true,
          extendedProps: {
            calendar: dat.hospitalName
          },
          backgroundColor: 'white',
          borderColor: 'white'
      })) 

      return adminFilterData
    } else {
      //Admin Calendar
      const response = await axios.post(AdminCalendarView, {
        requestType:"adminCalendarView",
    inputDate:monthChange === null ? input : monthChange,
    accountId:1
      }, { calendars })

      const adminData = response.data.adminCalendarView.map((dat, index) => ({
          id: index,
          url: '',
          title: dat.providerName,
          start: new Date(String(dat.scheduledDate)).toISOString(),
          start_Date:new Date(String(dat.scheduledDate)).toISOString(),
          allDay: true,
          extendedProps: {
            calendar: dat.hospitalName
          },
          backgroundColor: 'white',
          borderColor: 'white'
      })) 

      return adminData
    }
  } else {
    // Provider View
    const response = await axios.post(ProviderCalendarView, {
      requestType:"ProviderCalendarView",
      providerId:userRole.userId,
      inputDate:monthChange === null ? input : monthChange
  }, { calendars })

  const providerData = response.data.providerSchedulerView.map((dat, index) => ({ 
       id: index,
        url: '',
        title: (dat.facilityName !== 'Uassigned') && (dat.facilityName !== null) ? dat.facilityName : '',
        start: new Date(String(dat.date)).toISOString(),
        Leave:  (dat.leaveDescription !== 'Unassigned') && (dat.leaveDescription !== null) ? dat.leaveDescription : '',
        allDay: true,
        extendedProps: {
          calendar: (dat.facilityName !== 'Uassigned') && (dat.facilityName !== null) ? dat.facilityName : ''
        },
        backgroundColor: 'white',
        borderColor: 'white'
  }))

  return providerData
  }
})

export const addEvent = createAsyncThunk('appCalendar/addEvent', async (event, { dispatch, getState }) => {
  await axios.post('/apps/calendar/add-event', { event })
  await dispatch(fetchEvents(getState().calendar.selectedCalendars))

  return event
})

export const updateEvent = createAsyncThunk('appCalendar/updateEvent', async (event, { dispatch, getState }) => {
  await axios.post('/apps/calendar/update-event', { event })
  await dispatch(fetchEvents(getState().calendar.selectedCalendars))

  return event
})

export const updateFilter = createAsyncThunk('appCalendar/updateFilter', async (filter, { dispatch, getState }) => {  
  if (getState().calendar.selectedCalendars.includes(filter)) {
    await dispatch(fetchEvents({a:filter, b:null}))
  } else {
    await dispatch(fetchEvents([...getState().calendar.selectedCalendars, filter]))
  }

  return filter
})

export const updateFiltertitle = createAsyncThunk('appCalendar/updateFiltertitle', async (filter, { dispatch, getState }) => {  
  if (getState().calendar.selectedtitle.includes(filter)) {
    await dispatch(fetchEvents({a:null, b:filter}))
  } else {
    await dispatch(fetchEvents([...getState().calendar.selectedtitle, filter]))
  }

  return filter
})

export const updateAllFilters = createAsyncThunk('appCalendar/updateAllFilters', async (value, { dispatch }) => {
  if (value === true) {
    await dispatch(fetchEvents({e:facility !== null ? facility.map(data => data.hospitalId) : [], f:1}))
  } else {
    await dispatch(fetchEvents({e:[], f:1}))
  }

  return value
})

export const updateAllFilterTitle = createAsyncThunk('appCalendar/updateAllFilterTitle', async (value, { dispatch }) => {
  if (value === true) {
    await dispatch(fetchEvents({c:1, d:provider !== null ? provider.map(data => data.userId) : []}))
  } else {
    await dispatch(fetchEvents({c:1, d:[]}))
  }

  return value
})

export const removeEvent = createAsyncThunk('appCalendar/removeEvent', async id => {
  await axios.delete('/apps/calendar/remove-event', { id })

  return id
})

export const appCalendarSlice = createSlice({
  name: 'appCalendar',
  initialState: {
    events: [],
    selectedEvent: {},
    selectedCalendars: facility !== null ? facility.map(data => data.hospitalId) : [],
    selectedtitle : provider !== null ? provider.map(data => data.userId) : []
  },
  reducers: {
    selectEvent: (state, action) => {
      state.selectedEvent = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload
        console.log('ACTI', action)
      })
      .addCase(updateFilter.fulfilled, (state, action) => {
        if (state.selectedCalendars.includes(action.payload)) {
          state.selectedCalendars.splice(state.selectedCalendars.indexOf(action.payload), 1)
        } else {
          state.selectedCalendars.push(action.payload)
        }
      })
      .addCase(updateFiltertitle.fulfilled, (state, action) => {
        if (state.selectedtitle.includes(action.payload)) {
          state.selectedtitle.splice(state.selectedtitle.indexOf(action.payload), 1)
        } else {
          state.selectedtitle.push(action.payload)
        } 
      })
      .addCase(updateAllFilters.fulfilled, (state, action) => {
        const value = action.payload
        let selectedCalendar = []
        if (value === true) {
          selectedCalendar = facility !== null ? facility.map(data => data.hospitalId) : []
        } else {
          selectedCalendar = []
        }
        state.selectedCalendars = selectedCalendar
      })
      .addCase(updateAllFilterTitle.fulfilled, (state, action) => {
        const value = action.payload
        let selectedTitles = []
        if (value === true) {
          selectedTitles = provider !== null ? provider.map(data => data.userId) : []
        } else {
          selectedTitles = []
        }
        state.selectedtitle = selectedTitles
      })
  }
})

export const { selectEvent } = appCalendarSlice.actions

export default appCalendarSlice.reducer