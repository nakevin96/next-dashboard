'use server';

import { sql } from '@vercel/postgres';
import { InvoiceSchema } from './definitions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const CreateInoviceSchema = InvoiceSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  // const rawFormData = Object.fromEntries(formData.entries())
  const { customerId, amount, status } = CreateInoviceSchema.parse({
    customerId: formData.get('customerId'),
    amount: Number(formData.get('amount')),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoiceSchema = InvoiceSchema.omit({ date: true });

export async function updateInvoice(formData: FormData) {
  const { id, customerId, amount, status } = UpdateInvoiceSchema.parse({
    id: formData.get('id'),
    customerId: formData.get('customerId'),
    amount: Number(formData.get('amount')),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const DeleteInvoiceSchema = InvoiceSchema.omit({
  customerId: true,
  amount: true,
  date: true,
  status: true,
});

export async function deleteInvoice(formData: FormData) {
  const { id } = DeleteInvoiceSchema.parse({
    id: formData.get('id'),
  });

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}
