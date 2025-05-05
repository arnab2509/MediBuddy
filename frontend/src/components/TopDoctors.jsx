import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
const TopDoctors = () => {

    const navigate = useNavigate()

    const { doctors } = useContext(AppContext)

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-[#262626] md:mx-10'>
            <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {doctors.slice(0, 10).map((item, index) => (
                    <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                        <img className='bg-[#EAEFFF]' src={item.image} alt="" />
                        <div className='p-4'>
                            <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                                <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p><p>{item.available ? 'Available' : "Not Available"}</p>
                            </div>
                            <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                            <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
                            
                            {/* Rating Display */}
                            {item.averageRating && (
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const rating = Math.round(item.averageRating);
                                            let starColor = 'text-gray-300'; // Default gray
                                            
                                            if (star <= rating) {
                                                if (rating <= 2) {
                                                    starColor = 'text-red-500'; // Red for 1-2 stars
                                                } else if (rating <= 3) {
                                                    starColor = 'text-orange-500'; // Orange for 3 stars
                                                } else if (rating <= 4) {
                                                    starColor = 'text-yellow-400'; // Yellow for 4 stars
                                                } else {
                                                    starColor = 'text-green-500'; // Green for 5 stars
                                                }
                                            }
                                            
                                            return (
                                                <span
                                                    key={star}
                                                    className={`text-sm ${starColor}`}
                                                >
                                                    ★
                                                </span>
                                            );
                                        })}
                                    </div>
                                    <span className="text-xs text-gray-600">
                                        {item.averageRating} ({item.totalRatings})
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className='bg-[#EAEFFF] text-gray-600 px-12 py-3 rounded-full mt-10'>more</button>
        </div>

    )
}

export default TopDoctors