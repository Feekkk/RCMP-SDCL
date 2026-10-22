import { Link, useLocation } from '@tanstack/react-router'
import { LayoutDashboard, LogOut, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import uniklLogo from '@/assets/unikl-official.png'

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Manage Users', icon: Users },
]

export default function NavBar({ user, onLogout }) {
  const location = useLocation()

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <img src={uniklLogo} alt="UniKL" className="size-9 shrink-0 rounded-md object-contain" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">SDCL Admin</p>
          <p className="truncate text-xs text-muted-foreground">System Administrator</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {LINKS.map(({ to, label, icon: ItemIcon }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <ItemIcon className="size-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border px-3 py-4">
        {user && (
          <div className="mb-3 px-2">
            <p className="truncate text-sm font-medium text-foreground">{user.name ?? user.sub}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        )}
        <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={onLogout}>
          <LogOut className="size-4" />
          Log out
        </Button>
      </div>
    </aside>
  )
}
