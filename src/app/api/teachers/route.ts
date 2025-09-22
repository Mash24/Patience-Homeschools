import { NextRequest, NextResponse } from 'next/server'
import { TeacherApplicationSchema } from '@/lib/schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body against our schema
    const validatedData = TeacherApplicationSchema.parse(body)
    
    // Generate a unique application ID
    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // In a real application, you would save this to a database
    // For now, we'll just log it and return success
    console.log('Teacher Application Received:', {
      id: applicationId,
      data: validatedData,
      timestamp: new Date().toISOString()
    })
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return NextResponse.json({
      success: true,
      id: applicationId,
      message: 'Application submitted successfully! We will review your application and get back to you within 48 hours.',
      data: {
        applicationId,
        status: 'submitted',
        submittedAt: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Teacher application submission error:', error)
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid form data. Please check your inputs and try again.',
          details: error.message
        },
        { status: 400 }
      )
    }
    
    // Handle other errors
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save teacher application. Please try again later.' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Teacher application API endpoint',
    methods: ['POST'],
    description: 'Submit teacher applications to Patience Education Collective'
  })
}