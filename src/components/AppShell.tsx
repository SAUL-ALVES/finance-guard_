
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { ScrollArea } from '@/components/ui/scroll-area';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Icons.LayoutDashboard },
  { href: '/transactions', label: 'Transações', icon: Icons.ListChecks },
  // Add more items here as needed
  // { href: '/settings', label: 'Configurações', icon: Icons.Settings },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="inset" side="left">
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
            <Icons.FinanceGuardLogo className="h-8 w-8" />
            <span className="group-data-[collapsible=icon]:hidden">FinanceGuard</span>
          </Link>
        </SidebarHeader>
        <SidebarContent asChild>
          <ScrollArea className="h-full">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={{ children: item.label, className: "ml-2" }}
                    >
                      <a>
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
        {/* <SidebarFooter className="p-4">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Icons.LogOut className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden">Sair</span>
          </Button>
        </SidebarFooter> */}
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6 md:hidden">
          {pathname !== '/transactions' && <SidebarTrigger />}
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
            <Icons.FinanceGuardLogo className="h-6 w-6" />
            <span className={pathname === '/transactions' ? '' : 'ml-2'}>FinanceGuard</span>
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
        <footer className="border-t p-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} FinanceGuard. Todos os direitos reservados.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}

    