import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Doctors = () => {

  const { speciality } = useParams()

  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [sortBy, setSortBy] = useState('') // 'experience', 'rating', 'fee'
  const [sortOrder, setSortOrder] = useState('desc') // 'asc' or 'desc'
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    let filtered = speciality ? doctors.filter(doc => doc.speciality === speciality) : doctors;
    
    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'experience':
            // Extract years from experience string (e.g., "5 years" -> 5)
            const expA = parseInt(a.experience) || 0;
            const expB = parseInt(b.experience) || 0;
            comparison = expA - expB;
            break;
            
          case 'rating':
            const ratingA = a.averageRating || 0;
            const ratingB = b.averageRating || 0;
            comparison = ratingA - ratingB;
            break;
            
          case 'fee':
            comparison = a.fees - b.fees;
            break;
            
          default:
            break;
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }
    
    setFilterDoc(filtered);
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality, sortBy, sortOrder])

  const handleSort = (type) => {
    if (sortBy === type) {
      // Toggle sort order if clicking the same sort type
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort type and default to descending order
      setSortBy(type);
      setSortOrder('desc');
    }
  }

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button onClick={() => setShowFilter(!showFilter)} className={`py-1 px-3 border rounded text-sm  transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'General physician' ? 'bg-[#E2E5FF] text-black ' : ''}`}>General physician</p>
          <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gynecologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Gynecologist</p>
          <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Dermatologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Dermatologist</p>
          <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Pediatricians' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Pediatricians</p>
          <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Neurologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Neurologist</p>
          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gastroenterologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Gastroenterologist</p>
        </div>
        <div className='w-full'>
          <div className='flex gap-2 mb-4 flex-wrap'>
            <button 
              onClick={() => handleSort('experience')}
              className={`px-3 py-1 rounded-full text-sm border ${
                sortBy === 'experience' ? 'bg-primary text-white' : 'border-gray-300'
              }`}
            >
              Experience {sortBy === 'experience' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              onClick={() => handleSort('rating')}
              className={`px-3 py-1 rounded-full text-sm border ${
                sortBy === 'rating' ? 'bg-primary text-white' : 'border-gray-300'
              }`}
            >
              Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              onClick={() => handleSort('fee')}
              className={`px-3 py-1 rounded-full text-sm border ${
                sortBy === 'fee' ? 'bg-primary text-white' : 'border-gray-300'
              }`}
            >
              Fee {sortBy === 'fee' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
          <div className='grid grid-cols-auto gap-4 gap-y-6'>
            {filterDoc.map((item, index) => (
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
        </div>
      </div>
    </div>
  )
}

export default Doctors