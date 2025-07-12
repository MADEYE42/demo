import { connectDB } from '@/lib/db';
import { Project } from '@/models/Project';
import ExcelJS from 'exceljs';
import mongoose from 'mongoose';

export async function GET(_req: Request) {
  console.log(_req);
  await connectDB();

  const workbook = new ExcelJS.Workbook();
  const wsUsers = workbook.addWorksheet('Users');
  wsUsers.columns = [
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
    { header: 'Role', key: 'role' },
  ];
  const wsProjects = workbook.addWorksheet('Projects');
  wsProjects.columns = [
    { header: 'Title', key: 'title' },
    { header: 'Description', key: 'description' },
    { header: 'Status', key: 'status' },
  ];

  const wsInventory = workbook.addWorksheet('Inventory');
  wsInventory.columns = [
    { header: 'Material', key: 'material' },
    { header: 'Qty', key: 'quantity' },
    { header: 'Type', key: 'type' },
    { header: 'Manufacturer', key: 'manufacturer' },
  ];

  const UserModel = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ name: String, email: String, role: String }));
  const InventoryModel = mongoose.models.Inventory || mongoose.model('Inventory', new mongoose.Schema({ material: String, quantity: Number, type: String, manufacturerId: mongoose.Types.ObjectId }));
  
  const users = await UserModel.find();
  users.forEach(u => wsUsers.addRow(u));
  
  const projects = await Project.find();
  projects.forEach(p => wsProjects.addRow(p));
  
  const invs = await InventoryModel.find().populate('manufacturerId', 'name');
  invs.forEach(i =>
    wsInventory.addRow({
      material: i.material,
      quantity: i.quantity,
      type: i.type,
      manufacturer: i.manufacturerId?.name || '',
    }),
  );

  const buffer = await workbook.xlsx.writeBuffer();
  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=dashboard_data.xlsx',
    },
  });
}
