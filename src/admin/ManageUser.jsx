import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import NavBar from './NavBar.jsx'
import { useAuth, logout } from '@/lib/useAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const ROLES = ['SYSTEM_ADMIN', 'SD_STAFF', 'CL_STAFF', 'SRD_STAFF', 'HOD', 'DD', 'CEO', 'BOARD']
const UNITS = ['SD', 'CL', 'SRD']

const EMPTY_FORM = { staffId: '', email: '', name: '', role: '', unit: '', password: '' }

const formatDate = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function ManageUser() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [staff, setStaff] = useState(null)
  const [error, setError] = useState(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)

  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate({ to: '/login' })
      return
    }
    if (user.role !== 'SYSTEM_ADMIN') {
      navigate({ to: '/dashboard' })
    }
  }, [loading, user, navigate])

  const loadStaff = () => {
    fetch('/api/admin/staff', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setStaff(data.staff))
      .catch(() => setError('Failed to load staff accounts.'))
  }

  useEffect(() => {
    if (user?.role !== 'SYSTEM_ADMIN') return
    loadStaff()
  }, [user])

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/login' })
  }

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError(null)
    setDialogOpen(true)
  }

  const openEdit = (s) => {
    setEditing(s)
    setForm({
      staffId: s.staff_id,
      email: s.email,
      name: s.name ?? '',
      role: s.role,
      unit: s.unit ?? '',
      password: '',
    })
    setFormError(null)
    setDialogOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!form.email || !form.role) {
      setFormError('Email and role are required.')
      return
    }
    if (!editing && (!form.staffId || !form.password)) {
      setFormError('Staff ID and password are required.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(
        editing ? `/api/admin/staff/${editing.staff_id}` : '/api/admin/staff',
        {
          method: editing ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(
            editing
              ? {
                  email: form.email,
                  name: form.name || null,
                  role: form.role,
                  unit: form.unit || null,
                  ...(form.password ? { password: form.password } : {}),
                }
              : {
                  staffId: form.staffId,
                  email: form.email,
                  name: form.name || null,
                  role: form.role,
                  unit: form.unit || null,
                  password: form.password,
                },
          ),
        },
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setFormError(data.error ?? 'Something went wrong.')
        return
      }
      setDialogOpen(false)
      loadStaff()
    } catch {
      setFormError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (s) => {
    await fetch(`/api/admin/staff/${s.staff_id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isActive: !s.is_active }),
    })
    loadStaff()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const res = await fetch(`/api/admin/staff/${deleteTarget.staff_id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (res.ok) {
      setDeleteTarget(null)
      loadStaff()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Failed to delete staff account.')
      setDeleteTarget(null)
    }
  }

  if (loading || !user || user.role !== 'SYSTEM_ADMIN') {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading…</div>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <NavBar user={user} onLogout={handleLogout} />

      <main className="flex-1 px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Manage Users</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Add, edit, or remove staff accounts for the SDCL portal.
            </p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={openCreate}>
            <Plus className="size-4" />
            Add user
          </Button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">ID</th>
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium">Role</th>
                  <th className="py-2 pr-4 font-medium">Unit</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium">Created</th>
                  <th className="py-2 pr-4 font-medium">Last login</th>
                  <th className="py-2 pr-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff?.map((s) => (
                  <tr key={s.staff_id} className="border-b border-border last:border-0">
                    <td className="py-2 pr-4 text-foreground">{s.staff_id}</td>
                    <td className="py-2 pr-4 text-foreground">{s.name ?? '—'}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{s.email}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{s.role}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{s.unit ?? '—'}</td>
                    <td className="py-2 pr-4">
                      <button type="button" onClick={() => handleToggleActive(s)}>
                        <Badge variant={s.is_active ? 'default' : 'outline'}>
                          {s.is_active ? 'Active' : 'Disabled'}
                        </Badge>
                      </button>
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground">{formatDate(s.created_at)}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{formatDate(s.last_login_at)}</td>
                    <td className="py-2 pr-4">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(s)}
                          aria-label={`Edit ${s.staff_id}`}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteTarget(s)}
                          aria-label={`Delete ${s.staff_id}`}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {staff && staff.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-4 text-center text-muted-foreground">
                      No staff accounts yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit staff account' : 'Add staff account'}</DialogTitle>
            <DialogDescription>
              {editing
                ? `Update details for ${editing.staff_id}.`
                : 'Create a new staff account and assign a role.'}
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-3" onSubmit={handleSave}>
            {!editing && (
              <div className="space-y-1.5">
                <Label htmlFor="staffId">Staff ID</Label>
                <Input
                  id="staffId"
                  value={form.staffId}
                  onChange={(e) => setForm((f) => ({ ...f, staffId: e.target.value }))}
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Unit</Label>
                <Select
                  value={form.unit || '__none'}
                  onValueChange={(v) => setForm((f) => ({ ...f, unit: v === '__none' ? '' : v }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">None</SelectItem>
                    {UNITS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">
                {editing ? 'New password (leave blank to keep current)' : 'Password'}
              </Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required={!editing}
              />
            </div>

            {formError && <p className="text-sm text-destructive">{formError}</p>}

            <DialogFooter className="px-0 pb-0">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete staff account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {deleteTarget?.staff_id} ({deleteTarget?.email}). This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
