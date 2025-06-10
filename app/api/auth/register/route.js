import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, surname, phone_number, email, password } = await request.json();
    
    // Input validation
    if (!name || !surname || !phone_number || !email || !password) {
      return NextResponse.json({ error: 'Bütün Alanlar Gerekli' }, { status: 400 });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    
    // Validate phone number (simple validation for 11 digits)
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(phone_number)) {
      return NextResponse.json({ error: 'Telefon numarası 11 karakter olucak' }, { status: 400 });
    }
    
    // Check if the email is already registered
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        name,
        surname,
        phone_number,
        email,
        password: hashedPassword,
        is_admin: false // Default value for new users
      }
    });
    
    // Remove password from the response
    const { password: _, ...userData } = newUser;
    
    return NextResponse.json({ 
      message: 'User registered successfully',
      user: userData 
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'An error occurred during registration' }, { status: 500 });
  }
}