import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import NavBar from './NavBar.jsx'
import { useAuth, logout } from '@/lib/useAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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

const MODULES = ['WELFARE', 'MEDICAL']
// Mirrors ASSIGNABLE_ROLES in server/routes/funds.js.
const ASSIGNABLE_ROLES = ['SYSTEM_ADMIN', 'SD_STAFF', 'CL_STAFF', 'SRD_STAFF', 'HOD', 'DD', 'CEO', 'BOARD']

const EMPTY_FORM = {
  module: '',
  code: '',
  name: '',
  amountLabel: '',
  notes: '',
  requiredDocuments: '',
  recommenderRoles: [],
  approverRoles: [],
  sortOrder: '0',
}

const toggleRole = (roles, role) =>
  roles.includes(role) ? roles.filter((r) => r !== role) : [...roles, role]

const documentsToText = (docs) => (Array.isArray(docs) ? docs.map((d) => d.label).join('\n') : '')
const textToDocuments = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((label) => ({ label }))

export default function ManageFunds() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [funds, setFunds] = useState(null)
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

  const loadFunds = () => {
    fetch('/api/admin/funds', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setFunds(data.funds))
      .catch(() => setError('Failed to load funds.'))
  }

  useEffect(() => {
    if (user?.role !== 'SYSTEM_ADMIN') return
    loadFunds()
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

  const openEdit = (f) => {
    setEditing(f)
    setForm({
      module: f.module,
      code: f.code,
      name: f.name,
      amountLabel: f.amount_label ?? '',
      notes: f.notes ?? '',
      requiredDocuments: documentsToText(f.required_documents),
      recommenderRoles: Array.isArray(f.recommender_roles) ? f.recommender_roles : [],
      approverRoles: Array.isArray(f.approver_roles) ? f.approver_roles : [],
      sortOrder: String(f.sort_order ?? 0),
    })
    setFormError(null)
    setDialogOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!form.module || !form.code || !form.name) {
      setFormError('Module, code and name are required.')
      return
    }
    const requiredDocuments = textToDocuments(form.requiredDocuments)
    if (requiredDocuments.length === 0) {
      setFormError('At least one required document is needed (one per line).')
      return
    }
    if (form.approverRoles.length === 0) {
      setFormError('At least one approver role is needed.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(editing ? `/api/admin/funds/${editing.id}` : '/api/admin/funds', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          module: form.module,
          code: form.code,
          name: form.name,
          amountLabel: form.amountLabel || null,
          notes: form.notes || null,
          requiredDocuments,
          recommenderRoles: form.recommenderRoles,
          approverRoles: form.approverRoles,
          sortOrder: Number(form.sortOrder) || 0,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setFormError(data.error ?? 'Something went wrong.')
        return
      }
      setDialogOpen(false)
      loadFunds()
    } catch {
      setFormError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (f) => {
    await fetch(`/api/admin/funds/${f.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isActive: !f.is_active }),
    })
    loadFunds()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const res = await fetch(`/api/admin/funds/${deleteTarget.id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (res.ok) {
      setDeleteTarget(null)
      loadFunds()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Failed to delete fund.')
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
            <h1 className="text-2xl font-semibold text-foreground">Manage Funds</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Add, edit, or remove Welfare and Medical fund categories.
            </p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={openCreate}>
            <Plus className="size-4" />
            Add fund
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
                  <th className="py-2 pr-4 font-medium">Module</th>
                  <th className="py-2 pr-4 font-medium">Code</th>
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Amount</th>
                  <th className="py-2 pr-4 font-medium">Recommenders</th>
                  <th className="py-2 pr-4 font-medium">Approvers</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {funds?.map((f) => (
                  <tr key={f.id} className="border-b border-border last:border-0">
                    <td className="py-2 pr-4 text-foreground">{f.module}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{f.code}</td>
                    <td className="py-2 pr-4 text-foreground">{f.name}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{f.amount_label ?? '—'}</td>
                    <td className="py-2 pr-4 text-muted-foreground">
                      {Array.isArray(f.recommender_roles) && f.recommender_roles.length > 0
                        ? f.recommender_roles.join(', ')
                        : '—'}
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground">
                      {Array.isArray(f.approver_roles) && f.approver_roles.length > 0
                        ? f.approver_roles.join(', ')
                        : '—'}
                    </td>
                    <td className="py-2 pr-4">
                      <button type="button" onClick={() => handleToggleActive(f)}>
                        <Badge variant={f.is_active ? 'default' : 'outline'}>
                          {f.is_active ? 'Active' : 'Disabled'}
                        </Badge>
                      </button>
                    </td>
                    <td className="py-2 pr-4">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(f)}
                          aria-label={`Edit ${f.name}`}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteTarget(f)}
                          aria-label={`Delete ${f.name}`}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {funds && funds.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-4 text-center text-muted-foreground">
                      No funds yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg">{editing ? 'Edit fund' : 'Add fund'}</DialogTitle>
            <DialogDescription>
              {editing ? `Update details for ${editing.name}.` : 'Create a new Welfare or Medical fund category.'}
            </DialogDescription>
          </DialogHeader>

          <form
            className="max-h-[75vh] space-y-6 overflow-y-auto px-0.5 py-1"
            onSubmit={handleSave}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Module</Label>
                <Select value={form.module} onValueChange={(v) => setForm((f) => ({ ...f, module: v }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODULES.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  placeholder="e.g. living-allowance"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amountLabel">Amount label</Label>
                <Input
                  id="amountLabel"
                  placeholder="e.g. Up to RM500"
                  value={form.amountLabel}
                  onChange={(e) => setForm((f) => ({ ...f, amountLabel: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requiredDocuments">Required documents (one per line)</Label>
              <Textarea
                id="requiredDocuments"
                rows={3}
                placeholder={'Bank account / statement\nDeath certificate'}
                value={form.requiredDocuments}
                onChange={(e) => setForm((f) => ({ ...f, requiredDocuments: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <div>
                  <Label>Recommender roles</Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Staff roles allowed to recommend this fund (optional).
                  </p>
                </div>
                <div className="space-y-2 rounded-lg border border-border p-3">
                  {ASSIGNABLE_ROLES.map((role) => (
                    <label key={role} className="flex items-center gap-2 text-sm text-foreground">
                      <input
                        type="checkbox"
                        className="size-3.5 rounded border-input"
                        checked={form.recommenderRoles.includes(role)}
                        onChange={() =>
                          setForm((f) => ({ ...f, recommenderRoles: toggleRole(f.recommenderRoles, role) }))
                        }
                      />
                      {role}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <Label>Approver roles</Label>
                  <p className="mt-1 text-xs text-muted-foreground">Staff roles allowed to approve this fund.</p>
                </div>
                <div className="space-y-2 rounded-lg border border-border p-3">
                  {ASSIGNABLE_ROLES.map((role) => (
                    <label key={role} className="flex items-center gap-2 text-sm text-foreground">
                      <input
                        type="checkbox"
                        className="size-3.5 rounded border-input"
                        checked={form.approverRoles.includes(role)}
                        onChange={() =>
                          setForm((f) => ({ ...f, approverRoles: toggleRole(f.approverRoles, role) }))
                        }
                      />
                      {role}
                    </label>
                  ))}
                </div>
              </div>
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
            <AlertDialogTitle>Delete fund?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {deleteTarget?.name}. This action cannot be undone. If
              students have already applied to this fund, delete will be blocked — disable it
              instead.
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
