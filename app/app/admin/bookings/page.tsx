'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  RefreshCw
} from 'lucide-react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface Booking {
  id: string
  bookingNumber: string
  receiptNumber?: string
  userName: string
  userPhone: string
  userEmail?: string
  nakshatra?: string
  poojaName: string
  poojaPrice: number
  preferredDate?: string
  preferredTime?: string
  specialInstructions?: string
  bookingStatus: string
  paymentStatus: string
  createdAt: string
  user?: {
    id: string
    name: string
    phone: string
    email?: string
  }
}

interface BookingsResponse {
  bookings: Booking[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  statusCounts: Record<string, number>
}

export default function AdminBookings() {
  const { logout } = useAdminAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({})
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showActionModal, setShowActionModal] = useState(false)

  const itemsPerPage = 10

  useEffect(() => {
    fetchBookings()
  }, [currentPage, statusFilter, search])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        status: statusFilter,
        search: search,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })

      const response = await fetch(`/api/admin/bookings?${params}`)
      if (response.ok) {
        const data: BookingsResponse = await response.json()
        setBookings(data.bookings)
        setTotalPages(data.pagination.totalPages)
        setStatusCounts(data.statusCounts)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (bookingId: string, action: string, reason?: string) => {
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          action,
          reason
        })
      })

      if (response.ok) {
        fetchBookings() // Refresh the list
        setShowActionModal(false)
        setSelectedBooking(null)
      }
    } catch (error) {
      console.error('Error updating booking:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4" />
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />
      case 'PENDING':
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-temple-cream via-white to-orange-50">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <header className="py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 text-temple-maroon hover:text-temple-gold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <span className="text-gray-400">/</span>
              <h1 className="text-lg sm:text-xl font-bold text-temple-maroon">Pooja Bookings</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchBookings}
                className="p-2 text-temple-maroon hover:text-temple-gold transition-colors border border-temple-maroon/30 hover:border-temple-gold/50 rounded-md"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-1 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded transition-colors border border-red-300/30"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-temple-gold"></div>
          <div className="text-base sm:text-xl text-temple-gold">✦</div>
          <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-temple-gold"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-temple-gold/20 hover:border-temple-gold transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-temple-gold/20 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-temple-maroon" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-1">Total Bookings</p>
            <p className="text-lg sm:text-xl font-bold text-temple-maroon">
              {Object.values(statusCounts).reduce((sum, count) => sum + count, 0)}
            </p>
          </div>

          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-temple-gold/20 hover:border-temple-gold transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                  status === 'CONFIRMED' ? 'bg-green-100' :
                  status === 'COMPLETED' ? 'bg-blue-100' :
                  status === 'CANCELLED' ? 'bg-red-100' :
                  'bg-amber-100'
                }`}>
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    status === 'CONFIRMED' ? 'text-green-600' :
                    status === 'COMPLETED' ? 'text-blue-600' :
                    status === 'CANCELLED' ? 'text-red-600' :
                    'text-amber-600'
                  }`}>
                    {getStatusIcon(status)}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1 capitalize">{status}</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{count}</p>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-temple-gold/20 hover:border-temple-gold transition-all duration-300 hover:shadow-lg mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search devotee name, phone, booking number..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-10 pr-4 py-2 text-sm border border-temple-gold/20 rounded-xl focus:ring-2 focus:ring-temple-gold focus:border-temple-gold transition-all duration-200"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-4 py-2 text-sm border border-temple-gold/20 rounded-xl focus:ring-2 focus:ring-temple-gold focus:border-temple-gold transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-temple-gold/20 hover:border-temple-gold transition-all duration-300 hover:shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-temple-cream to-orange-50 border-b border-temple-gold/20">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-temple-maroon uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-temple-maroon uppercase tracking-wider">
                    Devotee
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-temple-maroon uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-temple-maroon uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-temple-maroon uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center">
                      <div className="flex justify-center">
                        <div className="w-4 h-4 border-2 border-temple-maroon border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Loading...</p>
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      <p className="text-sm font-medium">No bookings found</p>
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-temple-cream/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.poojaName}
                          </p>
                          <p className="text-xs text-gray-500">
                            #{booking.bookingNumber}
                          </p>
                          {booking.receiptNumber && (
                            <p className="text-xs text-gray-400">
                              {booking.receiptNumber}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.userName}
                          </p>
                          <p className="text-xs text-gray-500">{booking.userPhone}</p>
                          {booking.nakshatra && (
                            <p className="text-xs text-gray-400">
                              {booking.nakshatra}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.bookingStatus)}`}>
                          {getStatusIcon(booking.bookingStatus)}
                          <span className="capitalize">{booking.bookingStatus}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-600">
                          <div>{formatDate(booking.createdAt)}</div>
                          {booking.preferredDate && (
                            <div className="text-gray-400">
                              {formatDate(booking.preferredDate)}
                            </div>
                          )}
                          {booking.preferredTime && (
                            <div className="text-gray-400">
                              {booking.preferredTime}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking)
                            setShowActionModal(true)
                          }}
                          className="p-1 text-gray-600 hover:text-temple-maroon transition-colors"
                          title="Actions"
                        >
                          <MoreVertical className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, bookings.length)} of{' '}
              {Object.values(statusCounts).reduce((sum, count) => sum + count, 0)} bookings
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-xs border border-temple-gold/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-temple-cream transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 text-xs rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-temple-maroon text-white'
                      : 'border border-temple-gold/20 hover:bg-temple-cream'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-xs border border-temple-gold/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-temple-cream transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-sm w-full border border-temple-gold/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-temple-maroon">Booking Actions</h3>
              <button
                onClick={() => setShowActionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-temple-cream/30 rounded-lg p-3 mb-4">
              <div className="text-xs space-y-1">
                <p><span className="font-medium">Booking:</span> #{selectedBooking.bookingNumber}</p>
                <p><span className="font-medium">Pooja:</span> {selectedBooking.poojaName}</p>
                <p><span className="font-medium">Devotee:</span> {selectedBooking.userName}</p>
                <p><span className="font-medium">Status:</span>
                  <span className="capitalize ml-1">{selectedBooking.bookingStatus}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {selectedBooking.bookingStatus === 'PENDING' && (
                <button
                  onClick={() => handleAction(selectedBooking.id, 'confirm')}
                  className="w-full px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirm Booking
                </button>
              )}
              {(selectedBooking.bookingStatus === 'CONFIRMED' || selectedBooking.bookingStatus === 'PENDING') && (
                <button
                  onClick={() => handleAction(selectedBooking.id, 'complete')}
                  className="w-full px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mark Completed
                </button>
              )}
              {selectedBooking.bookingStatus !== 'CANCELLED' && (
                <button
                  onClick={() => handleAction(selectedBooking.id, 'cancel')}
                  className="w-full px-3 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel Booking
                </button>
              )}
              <button
                onClick={() => setShowActionModal(false)}
                className="w-full px-3 py-2 text-xs border border-temple-gold/20 text-temple-maroon rounded-lg hover:bg-temple-cream transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}