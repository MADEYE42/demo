import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/db';
import {Project} from '@/models/Project'; // Adjust path based on your folder structure

export async function GET() {
  try {
    await connectDB();

    const statusCounts = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    return NextResponse.json({ success: true, data: statusCounts });
  } catch (error) {
    console.error('Project Chart API Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch project chart data' }, { status: 500 });
  }
}
