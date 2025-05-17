import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem, User } from "@/types";
import { Head } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tài khoản',
        href: '/users',
    },
    {
        title: 'Người dùng',
        href: '/users',
    },
    {
        title: 'Chỉnh sửa',
        href: '/users/{id}/edit',
    },
];

const Edited = ({ data }: { data: User[] }) => {
    console.log('user data:', data);

  return (
      <AppLayout breadcrumbs={breadcrumbs}>
          <Head title="Chỉnh sửa" />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Chỉnh sửa người dùng</h1>
                {/* Form or content for editing user goes here */}
                <p>Form chỉnh sửa người dùng sẽ được hiển thị ở đây.</p>
            </div>
      </AppLayout>
  );
}

export default Edited;
