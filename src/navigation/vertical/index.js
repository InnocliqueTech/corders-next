
const navigation = () => {
  const userData = JSON.parse(localStorage.getItem('userData'))
const data = userData && userData.userValidation.permissionList.map(data => data.permissionName)
if (userData && data.includes('Scheduling _access') && userData && data.includes("Provider") && userData && data.includes("Dashboard") && userData && data.includes("Advanced_search")) {
  return [{
    title: 'Calendar',
    icon: 'tabler:calendar',
    path: '/apps/calendar'
  },
  {
    title: 'Schedule',
    icon: 'tabler:users',
    path: '/apps/schedule'
  },
  
  // {
  //   title: 'Documents',
  //   icon: 'tabler:table',
  //   path: '/storage/documents'
  // }
]
} else if (userData && data.includes('Scheduling _access') && data.includes('Provider')) {
  return [   {
    title: 'Calendar',
    icon: 'tabler:calendar',
    path: '/apps/calendar'
  },
  {
    title: 'Schedule',
    icon: 'tabler:users',
    path: '/apps/schedule'
  },

  // {
  //   title: 'Documents',
  //   icon: 'tabler:table',
  //   path: '/storage/documents'
  // }
]
} else if (userData && data.includes('Scheduling _access') && data.includes('Provider') && data.includes('Advanced_search')) {
  return [   {
    title: 'Calendar',
    icon: 'tabler:calendar',
    path: '/apps/calendar'
  },
  {
    title: 'Schedule',
    icon: 'tabler:users',
    path: '/apps/schedule'
  },

  // {
  //   title: 'Documents',
  //   icon: 'tabler:table',
  //   path: '/storage/documents'
  // }
]
}  else if (userData && data.includes('Provider') && data.includes('Dashboard') && data.includes('Advanced_search')) {
  return [   {
    title: 'Calendar',
    icon: 'tabler:calendar',
    path: '/apps/calendar'
  },
  {
      title: 'Leave Check',
      icon: 'tabler:eye',
      path: '/apps/ui_leave'
  },

  // {
  //   title: 'Documents',
  //   icon: 'tabler:table',
  //   path: '/storage/documents'
  // }
]
} else if (userData && data.includes('Provider') && data.includes('Dashboard')) {
  return [   {
    title: 'Calendar',
    icon: 'tabler:calendar',
    path: '/apps/calendar'
  },
  {
      title: 'Leave Check',
      icon: 'tabler:eye',
      path: '/apps/ui_leave'
  },

  // {
  //   title: 'Documents',
  //   icon: 'tabler:table',
  //   path: '/storage/documents'
  // }
]
} else if (userData && data.includes('Provider')) {
  return [   {
    title: 'Calendar',
    icon: 'tabler:calendar',
    path: '/apps/calendar'
  },
  {
      title: 'Leave Check',
      icon: 'tabler:eye',
      path: '/apps/ui_leave'
  },

  // {
  //   title: 'Documents',
  //   icon: 'tabler:table',
  //   path: '/storage/documents'
  // }
]
} else {
  return [  

  // {
  //   title: 'Documents',
  //   icon: 'tabler:table',
  //   path: '/storage/documents'
  // }
]
}
}


export default navigation
