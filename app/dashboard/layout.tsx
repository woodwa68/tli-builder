import SideNav from '@/app/ui/dashboard/sidenav';
import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense>
            <div className="flex h-screen  flex-col md:flex-row md:overflow-hidden">

                <div className="flex-grow md:overflow-y-auto">{children}</div>
            </div></Suspense>
    );
}