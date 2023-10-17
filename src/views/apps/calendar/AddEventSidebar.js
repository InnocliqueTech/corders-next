// ** React Imports
import { useState, useEffect, forwardRef, useCallback, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import FormControlLabel from '@mui/material/FormControlLabel'
import Modal from '@mui/material/Modal'
import { format } from 'date-fns'
import axios from 'axios'
import Badge from '@mui/material/Badge'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'
import { Check, X } from 'react-feather'
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

// ** Icon Imports
import Flatpickr from 'react-flatpickr'
import { Label } from 'reactstrap'
import Select, { components } from 'react-select'
import moment from "moment"





// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const capitalize = string => string && string[0].toUpperCase() + string.slice(1)

const defaultState = {
  url: '',
  title: '',
  guests: [],
  allDay: true,
  description: '',
  endDate: new Date(),
  calendar: 'Business',
  startDate: new Date()
}

const AddEventSidebar = props => {
  // ** Props
  const {
    store,
    open,
    dispatch,
    addEvent,
    updateEvent,
    drawerWidth,
    calendarApi,
    removeEvent,
    selectEvent,
    addEventSidebarOpen,
    handleAddEventSidebarToggle,
    calendarsColor,
    refetchEvents,
    fetchEvents
  } = props

  // ** States
  const [values, setValues] = useState(defaultState)

  // ** Vars & Hooks
  const selectedEvent = store.selectedEvent,
    {
      control,
      setError,
      setValue,
      getValues,
      handleSubmit,
      formState: { errors }
    } = useForm({
      defaultValues: { title: '' }
    })

  const handleSidebarClose = async () => {
    setValues(defaultState)

    // clearErrors()
    //dispatch(selectEvent(null))
    handleAddEventSidebarToggle()
  }

  const onSubmit = data => {
    const modifiedEvent = {
      url: values.url,
      display: 'block',
      title: data.title,
      end: values.endDate,
      allDay: values.allDay,
      start: values.startDate,
      extendedProps: {
        calendar: capitalize(values.calendar),
        guests: values.guests && values.guests.length ? values.guests : undefined,
        description: values.description.length ? values.description : undefined
      }
    }
    if (store.selectedEvent === null || (store.selectedEvent !== null && !store.selectedEvent.title.length)) {
      dispatch(addEvent(modifiedEvent))
    } else {
      dispatch(updateEvent({ id: store.selectedEvent.id, ...modifiedEvent }))
    }
    calendarApi.refetchEvents()
    handleSidebarClose()
  }

  // const handleDeleteEvent = () => {
  //   if (store.selectedEvent) {
  //     dispatch(deleteEvent(store.selectedEvent.id))
  //   }

  //   // calendarApi.getEventById(store.selectedEvent.id).remove()
  //   handleSidebarClose()
  // }
  // ** (UI) removeEventInCalendar
  const removeEventInCalendar = eventId => {
    calendarApi.getEventById(eventId).remove()
  }

  const handleStartDate = date => {
    if (date > values.endDate) {
      setValues({ ...values, startDate: new Date(date), endDate: new Date(date) })
    }
  }

  // const resetToStoredValues = useCallback(() => {
  //   if (store.selectedEvent !== null) {
  //     const event = store.selectedEvent
  //     setValue('title', event.title || '')
  //     setValues({
  //       url: event.url || '',
  //       title: event.title || '',
  //       allDay: event.allDay,
  //       guests: event.extendedProps.guests || [],
  //       description: event.extendedProps.description || '',
  //       calendar: event.extendedProps.calendar || 'Business',
  //       endDate: event.end !== null ? event.end : event.start,
  //       startDate: event.start !== null ? event.start : new Date()
  //     })
  //   }
  // }, [setValue, store.selectedEvent])

  // const resetToEmptyValues = useCallback(() => {
  //   setValue('title', '')
  //   setValues(defaultState)
  // }, [setValue])
  // useEffect(() => {
  //   if (store.selectedEvent !== null) {
  //     resetToStoredValues()
  //   } else {
  //     resetToEmptyValues()
  //   }
  // }, [addEventSidebarOpen, resetToStoredValues, resetToEmptyValues, store.selectedEvent])

  const PickersComponent = forwardRef(({ ...props }, ref) => {
    return (
      <CustomTextField
        inputRef={ref}
        fullWidth
        {...props}
        label={props.label || ''}
        sx={{ width: '100%' }}
        error={props.error}
      />
    )
  })

  // const RenderSidebarFooter = () => {
  //   if (store.selectedEvent === null || (store.selectedEvent !== null && !store.selectedEvent.title.length)) {
  //     return (
  //       <Fragment>
  //         <Button type='submit' variant='contained' sx={{ mr: 4 }}>
  //           Add
  //         </Button>
  //         <Button variant='tonal' color='secondary' onClick={resetToEmptyValues}>
  //           Reset
  //         </Button>
  //       </Fragment>
  //     )
  //   } else {
  //     return (
  //       <Fragment>
  //         <Button type='submit' variant='contained' sx={{ mr: 4 }}>
  //           Update
  //         </Button>
  //         <Button variant='tonal' color='secondary' onClick={resetToStoredValues}>
  //           Reset
  //         </Button>
  //       </Fragment>
  //     )
  //   }
  // }







  //--------------------------------------------------------------

  // const [providerData, setProviderData] = useState([])
  const [providerOptions, setProviderOptions] = useState([])
  const [selectedProviderId, setselectedProviderId] = useState(null)

  const [hospitalData, setHospitalData] = useState([])
  const [hospitalOptios, setHospitalOptions] = useState([])
  const [selectedHospitalId, setSelectedHospitalId] = useState(null)
  const [startDateModal, setStartDateModal] = useState(null) //new Date()
  const [endDateModal, setEndDateModal] = useState(null) //new Date()
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null);
  const params = {}
  const [startPicker, setStartPicker] = useState()
  const [calendarLabel, setCalendarLabel] = useState([])
  const [previousCalendarLabel, setPreviousCalendarLabel] = useState()
  const [leaves, setLeaves] = useState([])


  // ** Select Options
  const facility = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('facility')) : null
  const provider = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('provider')) : null
  const userRole = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("userData")) : null
  console.log(facility, "facility")
  const color = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'primary', 'primary']
  const facilityData = facility !== null ? facility.map((v, i) => ({ label: v.hospitalName, id: v.hospitalId, value: v.hospitalName, color: color[i] })) : null
  const providerData = provider !== null ? provider.map((v, i) => ({ label: v.firstName, id: v.userId, value: v.firstName, color: color[i] })) : null
  console.log(providerData, "provider data")
  console.log(facilityData, "facility data")
  
  //API 
  const ProviderApi = process.env.NEXT_PUBLIC_FETCH_EVENTS_PROVIDERS
  const LeaveDetails = process.env.NEXT_PUBLIC_LEAVE_DETAILS
  const ScheduleApi = process.env.NEXT_PUBLIC_PHYSICIAN_SCHEDULING

  // ** Set sidebar fields


  const handleCalendarLabelChange = (data) => {
    setPreviousCalendarLabel(calendarLabel)
    setCalendarLabel(data)
  }

   // ** Reset Input Values on Close
   const handleResetInputValues = () => {
    dispatch(selectEvent({}))
    setValue('title', '')
    setCalendarLabel([{ value: 'Valley', label: 'Valley', color: 'primary' }])
    setStartPicker()
    setLeaves([])
    setPreviousCalendarLabel()
  }

  const handleSelectedEvent = async () => {
    console.log('handleSelectedEvent')
    if (!isObjEmpty(selectedEvent)) {
      console.log(selectedEvent, "selectedEvent")
      const calendar = selectedEvent.extendedProps.calendar

      const resolveLabel = () => {
        if (calendar.length === undefined) {
          return { value: 'Valley', label: 'Valley', color: 'primary' }
        } else {
          return { label: calendar, value: calendar, color: calendarsColor[calendar] }
        }
      }
      setValue('title', { label: selectedEvent.title.split(' : ')[1], value: selectedEvent.title.split(' : ')[1], color: "success" } || { label: getValues('title'), value: getValues('title'), color: "success" })
      if (String(selectedEvent.start).includes('India')) {
        setStartPicker(new Date(String(selectedEvent.start)))
      } else {
        setStartPicker(new Date(String(selectedEvent._instance.range.end)))
      }
      setCalendarLabel([resolveLabel()])
      console.log(String(selectedEvent.start).includes('India'), "String(selectedEvent.start).includes('India')")
      console.log(selectEvent.start, "selected")

     // console.log(new Date(String(selectedEvent._instance.range.end)), "set")
    }

    await showLeaves(selectedEvent.start)
  }

  useEffect(() => {
      console.log('addEventSidebarOpen', addEventSidebarOpen)
      if(addEventSidebarOpen == true) {
        handleSelectedEvent() 
      }

  },[addEventSidebarOpen])

 

  // ** React Select Theme Colors
  const selectThemeColors = theme => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary25: '#7367f01a', // for option hover bg-color
      primary: '#7367f0', // for selected option bg-color
      neutral10: '#7367f0', // for tags bg-color
      neutral20: '#ededed', // for input border-color
      neutral30: '#ededed' // for input hover border-color
    }
  })
  const ScheduleDate = moment(startPicker).format("YYYY-MM-DD")

  const ScheduleCheck = async (item) => {
    const resp = await axios({
      method: "POST",
      url: ScheduleApi,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: JSON.stringify({
        requestType: "ScheduleCheck",
        date: ScheduleDate,
        providerId: item !== undefined ? item.title.id : null
      })
    })
    if (resp.data.scheduleCheck.hospitalName !== null) {
      toast.success(`${getValues('title').label} has been assigned to ${resp.data.scheduleCheck.hospitalName} Hospital`, {
        duration: 3000
      })
    }
  }



  const OptionComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <span className={`bullet bullet-${data.color} bullet-sm me-50`}></span>
        {data.label}
      </components.Option>
    )
  }

  const showLeaves = async (date) => {
    const resp = await axios({
      method: "POST",
      url: LeaveDetails,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: JSON.stringify({
        requestType: "Leaves",
        date: moment(date).format("YYYY-MM-DD"),
        providerId: userRole.userId
      })
    })
    setLeaves(resp.data.providerleavesCheckResponse.providerleaveCheckList)
  }



 

  const style = {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    bgcolor: 'background.paper',
    boxShadow: 20,
    borderRadius: '5px',

    // padding: "10px"
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
  
  const handleDateChange = (date) => {

    setSelectedDate(date);
  };


  // ** Updates Event in Store
  const handleUpdateEvent = () => {
    if (getValues('title').label.length) {
      const eventToUpdate = {
        id: selectedEvent.id,
        title: getValues('title').label,
        start: startPicker,
        extendedProps: {
          calendar: calendarLabel.label === undefined ? selectedEvent.extendedProps.calendar : calendarLabel.label
        }
      }
      const propsToUpdate = ['id', 'title']
      const extendedPropsToUpdate = ['calendar']
      dispatch(updateEvent(eventToUpdate))
      updateEventInCalendar(eventToUpdate, propsToUpdate, extendedPropsToUpdate)
      handleAddEventSidebarToggle()
      ScheduleFetch()
      toast.success('Event Updated')
    } else {
      setError('title', {
        type: 'manual'
      })
    }
  }

  // ** (UI) updateEventInCalendar
  const updateEventInCalendar = (updatedEventData, propsToUpdate, extendedPropsToUpdate) => {
    const existingEvent = calendarApi.getEventById(updatedEventData.id)

    // ** Set event properties except date related
    // ? Docs: https://fullcalendar.io/docs/Event-setProp
    // ** dateRelatedProps => ['start', 'end', 'allDay']
    // ** eslint-disable-next-line no-plusplus
    for (let index = 0; index < propsToUpdate.length; index++) {
      const propName = propsToUpdate[index]
      existingEvent.setProp(propName, updatedEventData[propName])
    }

    // ** Set date related props
    // ? Docs: https://fullcalendar.io/docs/Event-setDates
    existingEvent.setDates(new Date(updatedEventData.start), new Date(updatedEventData.end), {
      allDay: updatedEventData.allDay
    })

    // ** Set event's extendedProps
    // ? Docs: https://fullcalendar.io/docs/Event-setExtendedProp
    // ** eslint-disable-next-line no-plusplus
    for (let index = 0; index < extendedPropsToUpdate.length; index++) {
      const propName = extendedPropsToUpdate[index]
      existingEvent.setExtendedProp(propName, updatedEventData.extendedProps[propName])
    }
  }

  // ** Adds New Event

  const handleAddEvent = () => {
    const obj = {
      title: getValues('title'),
      start: startPicker,
      extendedProps: {
        calendar: calendarLabel.label
      }
    }
    dispatch(addEvent(obj))
    refetchEvents()
    handleAddEventSidebarToggle()
    toast.success('Event Added')
  }

  // Add Event
  const ScheduleFetch = async () => {
    try {
      const resp = await axios({
        method: "POST",
        url: ScheduleApi,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: JSON.stringify({
          requestType: "Scheduling",
          providerId: getValues('title').hasOwnProperty('id') === false ? providerData.find(x => x.label === selectedEvent.title.split(' : ')[1]).id : getValues('title').id,
          hospitalId: calendarLabel.id === undefined ? facilityData.find(x => x.label === selectedEvent.extendedProps.calendar).id : calendarLabel.id,
          fromDate: ScheduleDate,
          toDate: ScheduleDate,
          scheduledBy: 1,
          accountId: 1
        })
      })
      {
        if (resp.data.leaveDatesApproved.length !== 0) {
          MySwal.fire({
            icon: "error",
            title: "Provider is on Leave!",
            text: "Select another provider!",
            customClass: {
              confirmButton: "btn btn-success"
            }
          })
        } else {
          toast.success(resp.data.scheduleResponse.message, {
            position: "bottom-right"
          })
          dispatch(fetchEvents(store.selectedCalendars))
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleEditEvent = async () => {
    if (getValues('title').label.length) {
      const event = {
        providerId: getValues('title').hasOwnProperty('id') === false ? providerData.find(x => x.label === selectedEvent.title.split(' : ')[1]).id : getValues('title').id,
        previousHospitalId: previousCalendarLabel.id === undefined ? facilityData.find(x => x.label === selectedEvent.extendedProps.calendar).id : previousCalendarLabel.id,
        Date: startPicker,
        extendedProps: {
          newHospitalId: calendarLabel.id === undefined ? facilityData.find(x => x.label === selectedEvent.extendedProps.calendar).id : calendarLabel.id
        }
      }

      await axios({
        method: "POST",
        url: ScheduleApi,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: JSON.stringify({
          requestType: "editScheduling",
          inputType:"Update",
          date: moment(event.Date).format("YYYY-MM-DD"),
          providerId: event.providerId,
          newHospitalId: event.extendedProps.newHospitalId,
          previousHospitalId: event.previousHospitalId
        })
      })

      handleAddEventSidebarToggle()
      dispatch(fetchEvents(store.selectedCalendars))
      toast.success('Event Updated')
    } else {
      setError('title', {
        type: 'manual'
      })
    }
  }


  const handleDeleteEvent = async () => {
    if (getValues('title').label.length) {
      const event = {
        providerId: getValues('title').hasOwnProperty('id') === false ? providerData.find(x => x.label === selectedEvent.title.split(' : ')[1]).id : getValues('title').id,
        previousHospitalId: facilityData.find(x => x.label === selectedEvent.extendedProps.calendar).id,
        Date: startPicker,
        extendedProps: {
          newHospitalId: calendarLabel.id === undefined ? facilityData.find(x => x.label === selectedEvent.extendedProps.calendar).id : calendarLabel.id
        }
      }
      await axios({
        method: "POST",
        url: ScheduleApi,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: JSON.stringify({
          requestType: "editScheduling",
          inputType:"Delete",
          date: moment(event.Date).format("YYYY-MM-DD"),
          providerId: event.providerId,
          newHospitalId: event.extendedProps.newHospitalId,
          previousHospitalId: event.previousHospitalId
        })
      })
      handleAddEventSidebarToggle()
      dispatch(fetchEvents(store.selectedCalendars))
      toast.success('Event Deleted')
      removeEventInCalendar(selectedEvent.id)
      } else {
      setError('title', {
        type: 'manual'
      })
    }
  }



  useEffect(() => {
    // This code will run when the component mounts
    // handleSelectedEvent();

    // This code will run when the component unmounts
    return () => {
      handleResetInputValues();
    };
  }, []);
  const isObjEmpty = obj => Object.keys(obj).length === 0

  // ** Event Action buttons

  const EventActions = () => {
    const isProviderUnassigned = getValues('title').label === 'Unassigned'
    
    // Check if an event is selected and the provider was initially "Unassigned"
    const shouldHideUpdateButton = isObjEmpty(selectedEvent) && isProviderUnassigned
      
    if (isObjEmpty(selectedEvent) || (!isObjEmpty(selectedEvent) && !selectedEvent.title.length)) {
      return (
        <Fragment>
          {getValues('title') && calendarLabel && getValues('title').label !== undefined && calendarLabel.label !== undefined
            ?
            <Button variant="contained" color='primary' type='submit'> Add </Button>
            :
            <Button type='submit' disabled> Add </Button>}

          <Button type='reset' onClick={handleAddEventSidebarToggle} variant="outlined" color="error">
            Cancel
          </Button>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          {getValues('title')
            ?
            <Button variant="contained" color='primary' onClick={handleUpdateEvent}>
              Assign
            </Button>
            :
            <Button disabled> Assign </Button>}
          {getValues('title').label !== 'Unassigned' && !shouldHideUpdateButton ? previousCalendarLabel !== undefined && getValues('title').id === undefined
            ?
            <Button variant="contained" color='primary' onClick={handleEditEvent}> Update </Button>
            :
            <Button disabled> Update </Button> : null}
 {calendarLabel.id === undefined &&  getValues().id === undefined
            ?
            <Button variant="outlined" color="error" onClick={handleDeleteEvent}>
            Remove
          </Button>
            :
            <Button disabled> Remove </Button>}
        </Fragment>

      )
    }
  }

  return (
    <Modal
      open={addEventSidebarOpen}

      // onClose={handleSidebarClose}
      className='modal-dialog-centered'
      toggle={handleAddEventSidebarToggle}

    // onClosed={handleResetInputValues}
    >
      <Box sx={style}>
        <div >
          <div
            style={{ padding: "10px", backgroundColor: "#f8f8f8", display: "flex", justifyContent: "space-between", alignContent: "center", alignItems: "center" }}
            id='modal-modal-title'

          // style={{ backgroundColor: '#F8F8F8',  borderRadius: '5px', margin:"4px" }}
          >
            {console.log('store', store, facilityData, calendarLabel[0], store, store)}
            {store.selectedEvent !== null && store.selectedEvent.title && store.selectedEvent.title.length ? 'Update Event' : 'Add Event'}
            <Icon onClick={handleAddEventSidebarToggle} icon='tabler:x' fontSize={20} style={{ color: '#7367F0', cursor: 'pointer' }} />
          </div>
          <div style={{ padding: "20px" }}>
            <form
              className='container'
              sx={{ width: '100%' }}
              onSubmit={handleSubmit(data => {
                if (data.title.label.length) {
                  if (isObjEmpty(errors)) {
                    if (isObjEmpty(selectedEvent) || (!isObjEmpty(selectedEvent) && !selectedEvent.title.length)) {
                    console.log('374')
                      ScheduleFetch()
                      handleAddEvent()
                    } else {
                      handleUpdateEvent()
                    }
                    handleAddEventSidebarToggle()
                  }
                } else {
                  setError('title', {
                    type: 'manual'
                  })
                }
              })}
            >
              <div >
                <div style={{ marginTop: "20px" }}>
                  <Label className='form-label' for='title'>
                    Providers <span className='text-danger'>*</span>
                  </Label>
                  <Controller
                    name='title'
                    id='title'
                    control={control}
                    render={({ field }) => (
                      <Select
                        id='title'
                        value={{ label: getValues('title'), value: getValues('title'), color: "success" }}
                        options={providerData}
                        theme={selectThemeColors}
                        isClearable={false}
                        onInputChange={ScheduleCheck(getValues())}
                        {...field}
                      />
                    )}
                  />
                </div>
                <div style={{ marginTop: "20px" }}>
                  <Label className='form-label' htmlFor='label'>
                    Hospitals
                  </Label>
                  <Select
                    id='label'
                    placeholder='Hospital list'
                    value={calendarLabel[0]}
                    options={facilityData}
                    theme={selectThemeColors}
                    isClearable={false}
                    onChange={(data) => handleCalendarLabelChange(data)}
                    components={{
                      Option: OptionComponent
                    }}
                    isDisabled={getValues('title').label === 'Unassigned'} // Conditionally disable the select
                  />
                  
                </div>
                <div style={{ marginTop: "20px" }}>
                  <Label className='form-label' for='startDate'>
                    Date
                  </Label>
                  <Flatpickr
                    required
                    id='startDate'
                    name='startDate'
                    className='form-control'
                    disabled
                    onChange={date => setStartPicker(date[0])}
                    value={startPicker}
                    placeholder={startPicker === undefined ? null : `${startPicker.getFullYear()}-${(startPicker.getMonth() + 1)}-${startPicker.getDate()}`}
                    options={{
                      enableTime: false,
                      dateFormat: 'Y-m-d',
                      enable: [startPicker]
                    }}
                  />
                  {console.log(startPicker, "startpicker")}
                </div>
              </div>
              <div style={{ marginTop: '10px' }}>
                <EventActions />
              </div>
            </form>
          </div>
          <div >
            <Card >
              {/* <CardContent> */}
              <div style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", margin: "20px" }}>
                <List>
                  <h3 style={{ marginLeft: "12px", marginTop: "-5px" }}>Physician  On Leave</h3>
                  {console.log(leaves, "leave")}
                  {leaves.length > 0 ? (
                    leaves.map((dt) => (
                      <ListItem key={dt.id} >
                        <div color='light-primary' >
                          {/* <ListItemText primary={dt.firstName} /> */}
                          {dt.firstName}
                        </div>
                      </ListItem>
                    ))
                  ) : (
                    <ListItem style={{ marginTop: "-20px" }}>
                      <ListItemText primary='No one on Leave' />
                    </ListItem>
                  )}
                </List>
              </div>

              {/* </CardContent> */}
            </Card>
          </div>
        </div>
      </Box>
    </Modal>
  )
}

export default AddEventSidebar