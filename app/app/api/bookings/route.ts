import { NextResponse } from 'next/server'

// Declare globalThis type for our storage
declare global {
  var bookingsStorage: Booking[] | undefined
}

interface BookingRequest {
  serviceId: number
  name: string
  phone: string
  email?: string
  nakshatra?: string
  date: string
  timeSlot: string
  specialInstructions?: string
}

interface Booking {
  id: string
  serviceId: number
  poojaName: string
  name: string
  phone: string
  email?: string
  nakshatra?: string
  date: string
  timeSlot: string
  specialInstructions?: string
  totalAmount: number
  status: 'confirmed' | 'pending' | 'cancelled'
  createdAt: string
  bookingId: string
}

// In a real application, this would be stored in a database
// For now, we'll use a simple file-based storage to persist between requests
let bookings: Booking[] = []

// Load existing bookings from file system (simplified approach)
function loadBookings(): Booking[] {
  try {
    // In production, this would load from a proper database
    // For now, we'll keep in-memory but ensure it persists by using a global variable
    if (typeof globalThis.bookingsStorage === 'undefined') {
      globalThis.bookingsStorage = []
    }
    return globalThis.bookingsStorage
  } catch (error) {
    console.error('Error loading bookings:', error)
    return []
  }
}

// Save bookings to persistent storage
function saveBookings(bookingsToSave: Booking[]) {
  try {
    // Store in global variable to persist between requests
    globalThis.bookingsStorage = bookingsToSave
    console.log('Bookings saved to persistent storage:', bookingsToSave.length)
  } catch (error) {
    console.error('Error saving bookings:', error)
  }
}

// Helper function to get and save bookings
function getBookings(): Booking[] {
  if (typeof globalThis.bookingsStorage === 'undefined') {
    globalThis.bookingsStorage = []
  }
  return globalThis.bookingsStorage
}

function addBooking(booking: Booking) {
  const currentBookings = getBookings()
  currentBookings.push(booking)
  saveBookings(currentBookings)
}

// Generate unique booking ID with format TMP-YYYY-ABCDE
function generateBookingId(): string {
  const year = new Date().getFullYear()
  const timestamp = Date.now().toString(36).toUpperCase()
  const randomStr = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `TMP-${year}-${timestamp}${randomStr}`
}

// Get service details (in real app, this would come from database)
async function getServiceDetails(serviceId: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3010'}/api/pooja-services`)
  const services = await response.json()
  return services.find((s: any) => s.id === serviceId)
}

// Send WhatsApp notifications (mock implementation - in production, integrate with actual WhatsApp API)
async function sendWhatsAppNotifications(booking: Booking) {
  try {
    // Temple admin phone number (in real app, get from environment variables)
    const templeAdminPhone = process.env.TEMPLE_ADMIN_PHONE || '+919876543210'

    // Format date for display
    const bookingDate = new Date(booking.date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Message to user
    const userMessage = `🙏 श्री क्षेत्र धाम - Booking Confirmed 🙏

Booking ID: ${booking.bookingId}
Service: ${booking.poojaName}
Date: ${bookingDate}
Time: ${booking.timeSlot}
Name: ${booking.name}

✅ Please arrive 15 minutes before scheduled time
📱 Carry this message for verification
💰 Amount: ₹${booking.totalAmount} (Payable at temple)

📞 Temple Contact: +919876543210
📍 Temple Address: Sri Temple, Main Road, City

Thank you for choosing our temple services! 🌺`

    // Message to temple admin
    const adminMessage = `🔔 New Pooja Booking Alert

Booking ID: ${booking.bookingId}
Service: ${booking.poojaName}
Date/Time: ${bookingDate} at ${booking.timeSlot}

Devotee Details:
• Name: ${booking.name}
• Phone: ${booking.phone}
• Email: ${booking.email || 'Not provided'}
• Nakshatra: ${booking.nakshatra || 'Not provided'}

💰 Expected Amount: ₹${booking.totalAmount}
💳 Payment: At temple
📅 Status: Confirmed

⏰ Please prepare for this pooja service.`

    // Log WhatsApp messages (in production, use actual WhatsApp API)
    console.log('=== WHATSAPP NOTIFICATIONS ===')
    console.log('TO USER (+91' + booking.phone + '):')
    console.log(userMessage)
    console.log('\nTO ADMIN (+91' + templeAdminPhone + '):')
    console.log(adminMessage)
    console.log('===============================')

    // In production, integrate with WhatsApp Business API
    // Example: await sendWhatsAppMessage(booking.phone, userMessage)
    // Example: await sendWhatsAppMessage(templeAdminPhone, adminMessage)

  } catch (error) {
    console.error('Error sending WhatsApp notifications:', error)
    // Continue with booking even if WhatsApp fails
  }
}

export async function POST(request: Request) {
  try {
    const body: BookingRequest = await request.json()

    // Validate required fields
    const { serviceId, name, phone, date, timeSlot } = body

    if (!serviceId || !name || !phone || !date || !timeSlot) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate phone number
    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length === 10 && /^[6-9]/.test(cleanPhone)) {
      // Valid 10-digit number starting with 6-9
    } else if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      // Valid 12-digit number starting with 91 (country code)
    } else if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
      // Valid 11-digit number starting with 0
    } else {
      return NextResponse.json(
        { error: 'Invalid phone number format. Use 10-digit number or +91 prefix.' },
        { status: 400 }
      )
    }

    // Validate date (not in the past)
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate < today) {
      return NextResponse.json(
        { error: 'Cannot book for past dates' },
        { status: 400 }
      )
    }

    // Get service details
    const service = await getServiceDetails(serviceId)
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Check for existing booking at the same date and time
    const existingBooking = bookings.find(
      b => b.date === date && b.timeSlot === timeSlot && b.status !== 'cancelled'
    )

    if (existingBooking) {
      return NextResponse.json(
        { error: 'This time slot is already booked. Please select a different time.' },
        { status: 409 }
      )
    }

    // Create new booking
    const bookingId = generateBookingId()
    const booking: Booking = {
      id: bookingId,
      bookingId,
      serviceId,
      poojaName: service.poojaName,
      name: name.trim(),
      phone: phone.trim(),
      email: body.email?.trim() || undefined,
      nakshatra: body.nakshatra?.trim() || undefined,
      date,
      timeSlot,
      specialInstructions: body.specialInstructions?.trim() || undefined,
      totalAmount: service.price,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }

    // Save booking to persistent storage
    addBooking(booking)

    // Send WhatsApp notifications (in real app, integrate with WhatsApp API)
    await sendWhatsAppNotifications(booking)

    // Log booking for temple management
    console.log('New Booking Created:', {
      bookingId: booking.bookingId,
      service: booking.poojaName,
      date: booking.date,
      time: booking.timeSlot,
      name: booking.name,
      phone: booking.phone,
      nakshatra: booking.nakshatra,
    })

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        bookingId: booking.bookingId,
        serviceId: booking.serviceId,
        poojaName: booking.poojaName,
        date: booking.date,
        timeSlot: booking.timeSlot,
        totalAmount: booking.totalAmount,
        status: booking.status,
      },
      message: 'Booking confirmed successfully!',
    })

  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('bookingId')
    const phone = searchParams.get('phone')

    // Get current bookings from persistent storage
    const currentBookings = getBookings()
    console.log('📚 Fetching bookings from storage. Total bookings:', currentBookings.length)

    if (bookingId) {
      // Get specific booking by ID
      const booking = currentBookings.find(b => b.bookingId === bookingId)
      if (!booking) {
        console.log('❌ Booking not found for ID:', bookingId)
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        )
      }
      console.log('✅ Found booking:', booking.bookingId)
      return NextResponse.json({ booking })
    }

    if (phone) {
      // Get all bookings for a phone number
      const userBookings = currentBookings.filter(b => b.phone === phone)
      return NextResponse.json({ bookings: userBookings })
    }

    // Get all bookings (admin access - in real app, add authentication)
    console.log('📋 Returning all bookings:', currentBookings.length)
    return NextResponse.json({ bookings: currentBookings })

  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}