import connectDB from '@/utils/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();
  const user = await User.findOne({ email });

  if (!user) return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  return new Response(JSON.stringify({ token, user }), { status: 200 });
}
