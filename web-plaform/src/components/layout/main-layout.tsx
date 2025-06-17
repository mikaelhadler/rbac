import { ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { LanguageSelector } from "@/components/language-selector"
import {
  LayoutDashboard,
  Users,
  UserCircle,
  MessageSquare,
  LogOut,
  Shield
} from "lucide-react"

interface MainLayoutProps {
  children: ReactNode
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Residents", href: "/residents", icon: UserCircle },
  { name: "Complaints", href: "/complaints", icon: MessageSquare },
  { name: "Roles", href: "/roles", icon: Shield },
]

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { t } = useTranslation()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r">
        <div className="flex h-16 items-center px-6 border-b">
          <h1 className="text-xl font-semibold">{t('navigation.title')}</h1>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {t(`navigation.${item.name.toLowerCase()}`)}
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-accent-foreground"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            {t('auth.logout')}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <header className="h-16 border-b bg-card">
          <div className="flex h-full items-center justify-between px-6">
            <h2 className="text-lg font-semibold">
              {t(`navigation.${navigation.find((item) => item.href === location.pathname)?.name.toLowerCase() || 'dashboard'}`)}
            </h2>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}