import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

interface InvoiceEditParams {
  params: {
    id: string;
  };
}

export default async function Page({ params }: InvoiceEditParams) {
  const id = params.id;
  const invoice = await fetchInvoiceById(id);
  const customers = await fetchCustomers();

  if(!invoice){
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      {invoice && <Form invoice={invoice} customers={customers} />}
    </main>
  );
}
