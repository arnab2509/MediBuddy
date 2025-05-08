import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    let filtered = speciality ? doctors.filter(doc => doc.speciality === speciality) : doctors;
    
    // Apply availability filter
    if (showAvailableOnly) {
      filtered = filtered.filter(doc => doc.available);
    }
    
    if (sortBy) {
      filtered.sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'experience':
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
  }, [doctors, speciality, sortBy, sortOrder, showAvailableOnly])

  const handleSort = (type) => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Doctor</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse through our extensive list of trusted doctors and specialists. Filter by specialty, experience, ratings, and more.
        </p>
      </div>

      <div className='flex flex-col sm:flex-row items-start gap-8'>
        {/* Mobile Filter Button */}
        <button 
          onClick={() => setShowFilter(!showFilter)} 
          className={`py-2 px-4 rounded-lg text-sm font-medium transition-all sm:hidden w-full ${
            showFilter ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          {showFilter ? 'Hide Filters' : 'Show Filters'}
        </button>
        
        {/* Speciality Filters */}
        <div className={`flex-col gap-3 text-sm ${showFilter ? 'flex' : 'hidden sm:flex'} w-full sm:w-64`}>
          <h3 className="font-semibold text-gray-900 mb-2">Specialties</h3>
          <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} 
             className={`pl-4 py-2.5 pr-4 rounded-lg transition-all cursor-pointer hover:bg-gray-50 ${
               speciality === 'General physician' ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white text-gray-700 border border-gray-200'
             }`}>
            General physician
          </p>
          <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} 
             className={`pl-4 py-2.5 pr-4 rounded-lg transition-all cursor-pointer hover:bg-gray-50 ${
               speciality === 'Gynecologist' ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white text-gray-700 border border-gray-200'
             }`}>
            Gynecologist
          </p>
          <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} 
             className={`pl-4 py-2.5 pr-4 rounded-lg transition-all cursor-pointer hover:bg-gray-50 ${
               speciality === 'Dermatologist' ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white text-gray-700 border border-gray-200'
             }`}>
            Dermatologist
          </p>
          <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} 
             className={`pl-4 py-2.5 pr-4 rounded-lg transition-all cursor-pointer hover:bg-gray-50 ${
               speciality === 'Pediatricians' ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white text-gray-700 border border-gray-200'
             }`}>
            Pediatricians
          </p>
          <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} 
             className={`pl-4 py-2.5 pr-4 rounded-lg transition-all cursor-pointer hover:bg-gray-50 ${
               speciality === 'Neurologist' ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white text-gray-700 border border-gray-200'
             }`}>
            Neurologist
          </p>
          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} 
             className={`pl-4 py-2.5 pr-4 rounded-lg transition-all cursor-pointer hover:bg-gray-50 ${
               speciality === 'Gastroenterologist' ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white text-gray-700 border border-gray-200'
             }`}>
            Gastroenterologist
          </p>
        </div>

        {/* Main Content */}
        <div className='w-full'>
          {/* Sort Filters */}
          <div className='flex gap-3 mb-6 flex-wrap'>
            <button 
              onClick={() => handleSort('experience')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'experience' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Experience {sortBy === 'experience' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              onClick={() => handleSort('rating')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'rating' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              onClick={() => handleSort('fee')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'fee' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Fee {sortBy === 'fee' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              onClick={() => setShowAvailableOnly(!showAvailableOnly)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                showAvailableOnly 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current"></span>
              Available Only
            </button>
          </div>

          {/* Doctor Cards Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filterDoc.map((item, index) => (
              <div 
                onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} 
                className='bg-white rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100' 
                key={index}
              >
                <div className="relative">
                  <img className='w-full h-48 object-cover' src={item.image} alt={item.name} />
                </div>
                
                <div className='p-6'>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className='text-xl font-semibold text-gray-900'>{item.name}</h3>
                    <span className={`w-2 h-2 rounded-full ${
                      item.available ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                    }`}></span>
                  </div>
                  <p className='text-gray-600 mb-3'>{item.speciality}</p>
                  
                  {/* Rating Display */}
                  {item.averageRating && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const rating = Math.round(item.averageRating);
                          let starColor = 'text-gray-300';
                          
                          if (star <= rating) {
                            if (rating <= 2) {
                              starColor = 'text-red-500';
                            } else if (rating <= 3) {
                              starColor = 'text-orange-500';
                            } else if (rating <= 4) {
                              starColor = 'text-yellow-400';
                            } else {
                              starColor = 'text-green-500';
                            }
                          }
                          
                          return (
                            <span
                              key={star}
                              className={`text-lg ${starColor}`}
                            >
                              ★
                            </span>
                          );
                        })}
                      </div>
                      <span className="text-sm text-gray-600">
                        {item.averageRating} ({item.totalRatings} reviews)
                      </span>
                    </div>
                  )}

                  {/* Experience and Fee */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{item.experience}</span> experience
                    </div>
                    <div className="text-sm font-medium text-primary">
                      Rs.{item.fees}
                    </div>
                  </div>
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