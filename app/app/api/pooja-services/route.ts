import { NextResponse } from 'next/server'

// Mock data based on reference image - Special Pooja Booking
const mockServices = [
  {
    id: 1,
    poojaName: "Nithya Pooja",
    description: "Daily pooja performed regularly with all rituals",
    price: 201,
    displayOrder: 1,
  },
  {
    id: 2,
    poojaName: "Padha Pooja",
    description: "Special padha pooja for divine blessings",
    price: 201,
    displayOrder: 2,
  },
  {
    id: 3,
    poojaName: "Panchmrutha Abhisheka",
    description: "Panchmrutha abhisheka with five sacred ingredients",
    price: 201,
    displayOrder: 3,
  },
  {
    id: 4,
    poojaName: "Madhu Abhisheka",
    description: "Madhu (honey) abhisheka for divine blessings",
    price: 251,
    displayOrder: 4,
  },
  {
    id: 5,
    poojaName: "Sarva Seva",
    description: "Complete service with all rituals and offerings",
    price: 501,
    displayOrder: 5,
  },
  {
    id: 6,
    poojaName: "Vishesha Alankara Seva",
    description: "Special decoration service with elaborate arrangements",
    price: 1001,
    displayOrder: 6,
  },
  {
    id: 7,
    poojaName: "Belli Kavachadharane",
    description: "Silver armor decoration for divine protection",
    price: 1001,
    displayOrder: 7,
  },
  {
    id: 8,
    poojaName: "Sahasranama Archane",
    description: "Archana with thousand names for divine blessings",
    price: 251,
    displayOrder: 8,
  },
  {
    id: 9,
    poojaName: "Vayusthuthi Punashcharne",
    description: "Vayusthuthi recitation and repetition for prosperity",
    price: 501,
    displayOrder: 9,
  },
  {
    id: 10,
    poojaName: "Kanakabhisheka",
    description: "Golden abhisheka for prosperity and wealth",
    price: 501,
    displayOrder: 10,
  },
  {
    id: 11,
    poojaName: "Vastra Arpane Seva",
    description: "Offering of divine garments and clothing",
    price: 2001,
    displayOrder: 11,
  },
]

export async function GET() {
  try {
    // Return mock data for now
    return NextResponse.json(mockServices)
  } catch (error) {
    console.error('Error fetching pooja services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}
