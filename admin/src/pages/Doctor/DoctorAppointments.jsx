import React, { useState } from 'react'
import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import DoctorChat from '../../components/DoctorChat'

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment, profileData, getProfileData } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency, backendUrl } = useContext(AppContext)
  const [activeChatId, setActiveChatId] = useState(null)

  useEffect(() => {
    if (dToken) {
      getAppointments()
      getProfileData()
    }
  }, [dToken])

  // Function to toggle chat window
  const toggleChat = (appointmentId) => {
    if (activeChatId === appointmentId) {
      setActiveChatId(null);
    } else {
      setActiveChatId(appointmentId);
    }
  };

  return (
    <div className='w-full max-w-6xl m-5 '>

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-auto'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_2fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.map((item, index) => (
          <div key={index} className="border-b">
            <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_2fr] gap-1 items-center text-gray-500 py-3 px-6 hover:bg-gray-50'>
              <p className='max-sm:hidden'>{index}</p>
              <div className='flex items-center gap-2'>
                <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
              </div>
              <div>
                <p className='text-xs inline border border-primary px-2 rounded-full'>
                  {item.payment?'Online':'CASH'}
                </p>
              </div>
              <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              <p>{currency}{item.amount}</p>
              <div className='flex items-center gap-2'>
                {item.cancelled
                  ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                  : item.isCompleted
                    ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                    : <div className='flex'>
                      <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                      <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                    </div>
                }
                {/* Chat button */}
                {!item.cancelled && (
                  <button 
                    onClick={() => toggleChat(item._id)} 
                    className={`px-4 py-2 text-xs border rounded transition-all duration-300 ${
                      activeChatId === item._id 
                        ? 'bg-primary text-white' 
                        : 'text-[#696969] hover:bg-primary hover:text-white'
                    }`}
                  >
                    {activeChatId === item._id ? 'Close Chat' : 'Chat'}
                  </button>
                )}
              </div>
            </div>
            
            {/* Chat component */}
            {activeChatId === item._id && !item.cancelled && profileData && (
              <div className="p-4 border-t bg-gray-50">
                <DoctorChat 
                  appointmentId={item._id}
                  userId={item.userId}
                  docId={profileData._id}
                  backendUrl={backendUrl}
                  dToken={dToken}
                  patientName={item.userData.name}
                  patientImage={item.userData.image}
                />
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}

export default DoctorAppointments