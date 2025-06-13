// components/PageHeader.tsx
import { Icons } from './icons';
import { Button } from './ui/button';

interface PageHeaderProps {
  title: string;
  description?: string;
  showLogout?: boolean;
  onLogout?: () => void;
  children?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  showLogout = false,
  onLogout,
  children 
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl break-words">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-sm sm:text-base">
            {description}
          </p>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        {children}
        {showLogout && onLogout && (
       <Button
          variant="ghost"
           onClick={onLogout}
           className="text-destructive hover:text-destructive"
    >
          <Icons.LogOut className="mr-2 h-4 w-4" /> {/* Corrigido para LogOut */}
           Sair
      </Button>
        )}
      </div>
    </div>
  );
}