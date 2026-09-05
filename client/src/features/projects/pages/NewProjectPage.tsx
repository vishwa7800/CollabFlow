import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer, PageHeader } from '@/components/layout'
import {
  Card,
  CardContent,
  Button,
  Input,
  Textarea,
  Select,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  useToast,
} from '@/components/ui'
import { Plus, ArrowLeft, AlertCircle } from 'lucide-react'
import { ProjectMemberSelector, ProjectTagSelector } from '../components'
import { ProjectMember, ProjectStatus, ProjectPriority, CreateProjectInput } from '../types'
import { WORKSPACE_MEMBERS } from '../data/mockProjects'

export function NewProjectPage() {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Form State
  const [formData, setFormData] = React.useState<CreateProjectInput>({
    name: '',
    description: '',
    status: 'Planning',
    priority: 'Medium',
    startDate: '',
    dueDate: '',
    members: [WORKSPACE_MEMBERS[0]], // Alex Morgan (Owner) by default
    tags: ['Design', 'Frontend'],
  })

  // Validation errors
  const [errors, setErrors] = React.useState<{
    name?: string
    dueDate?: string
  }>({})
  const [formError, setFormError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showDiscardDialog, setShowDiscardDialog] = React.useState(false)

  // Dirty detection
  const isDirty =
    formData.name.trim() !== '' ||
    formData.description.trim() !== '' ||
    formData.status !== 'Planning' ||
    formData.priority !== 'Medium' ||
    formData.startDate !== '' ||
    formData.dueDate !== '' ||
    formData.members.length > 1 ||
    formData.tags.length !== 2

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required.'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Project name must be at least 3 characters long.'
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Project name cannot exceed 100 characters.'
    }

    if (formData.startDate && formData.dueDate) {
      const start = new Date(formData.startDate).getTime()
      const due = new Date(formData.dueDate).getTime()
      if (due < start) {
        newErrors.dueDate = 'Due date cannot be earlier than the start date.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate short asynchronous project creation
    setTimeout(() => {
      setIsSubmitting(false)
      const generatedId = `proj-${Date.now()}`

      toast({
        title: 'Project created successfully',
        description: `"${formData.name}" workspace has been initialized.`,
        variant: 'success',
      })

      // Navigate to project detail route
      navigate(`/app/projects/${generatedId}`)
    }, 850)
  }

  const handleCancel = () => {
    if (isDirty) {
      setShowDiscardDialog(true)
    } else {
      navigate('/app/projects')
    }
  }

  const statusOptions = [
    { value: 'Planning', label: 'Planning' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'On Hold', label: 'On Hold' },
  ]

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
  ]

  return (
    <PageContainer maxWidth="2xl">
      {/* Page Header */}
      <PageHeader
        title="Create Project"
        description="Set up a new project workspace for your team."
        breadcrumbs={[
          { label: 'Workspace', href: '/app/dashboard' },
          { label: 'Projects', href: '/app/projects' },
          { label: 'New Project' },
        ]}
        secondaryActions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
          >
            Back to Projects
          </Button>
        }
      />

      {/* Main Creation Card */}
      <Card className="border-slate-800/90 bg-slate-900/70 shadow-xl backdrop-blur text-left">
        <CardContent className="p-6 sm:p-8 space-y-8">
          {formError && (
            <div
              role="alert"
              className="flex items-center gap-2.5 rounded-lg border border-red-900/60 bg-red-950/40 p-3.5 text-xs text-red-200"
            >
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* Section 1: Basic Information */}
            <div className="space-y-4">
              <div className="border-b border-slate-800/80 pb-2">
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Basic Information
                </h2>
                <p className="text-xs text-slate-400">
                  Primary details identifying your team workspace.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Project Name"
                  placeholder="e.g. Website Redesign & CMS Migration"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                  }}
                  error={errors.name}
                  helperText="A clear, recognizable title for your project."
                  required
                  disabled={isSubmitting}
                  autoFocus
                />

                <div className="space-y-1">
                  <Textarea
                    label="Description"
                    placeholder="Briefly describe project objectives, team deliverables, and target outcomes..."
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      if (e.target.value.length <= 500) {
                        setFormData((prev) => ({ ...prev, description: e.target.value }))
                      }
                    }}
                    rows={3}
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-end text-[11px] text-slate-500">
                    <span>{formData.description.length}/500 characters</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Project Settings */}
            <div className="space-y-4">
              <div className="border-b border-slate-800/80 pb-2">
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Project Settings
                </h2>
                <p className="text-xs text-slate-400">
                  Configure project delivery status, priority, and schedule.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Initial Status"
                  options={statusOptions}
                  value={formData.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as ProjectStatus,
                    }))
                  }
                  disabled={isSubmitting}
                />

                <Select
                  label="Priority"
                  options={priorityOptions}
                  value={formData.priority}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: e.target.value as ProjectPriority,
                    }))
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                  helperText="Planned kickoff date (optional)"
                  disabled={isSubmitting}
                />

                <Input
                  label="Target Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
                    if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: undefined }))
                  }}
                  error={errors.dueDate}
                  helperText="Target delivery milestone (optional)"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Section 3: Team Members */}
            <div className="space-y-4">
              <div className="border-b border-slate-800/80 pb-2">
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Team Members
                </h2>
                <p className="text-xs text-slate-400">
                  Assign teammates who will participate and collaborate on tasks.
                </p>
              </div>

              <ProjectMemberSelector
                selectedMembers={formData.members}
                onChange={(members: ProjectMember[]) =>
                  setFormData((prev) => ({ ...prev, members }))
                }
                disabled={isSubmitting}
              />
            </div>

            {/* Section 4: Organization & Tags */}
            <div className="space-y-4">
              <div className="border-b border-slate-800/80 pb-2">
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Organization
                </h2>
                <p className="text-xs text-slate-400">
                  Categorize your project with relevant labels and tags.
                </p>
              </div>

              <ProjectTagSelector
                selectedTags={formData.tags}
                onChange={(tags: string[]) =>
                  setFormData((prev) => ({ ...prev, tags }))
                }
                disabled={isSubmitting}
              />
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                leftIcon={<Plus className="h-4 w-4" />}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? 'Creating project...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Discard Changes Confirmation Dialog */}
      <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Discard unsaved changes?</DialogTitle>
            <DialogDescription>
              You have unsaved details in this project creation form. If you navigate away, these changes will be lost.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowDiscardDialog(false)}
            >
              Continue editing
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                setShowDiscardDialog(false)
                navigate('/app/projects')
              }}
            >
              Discard changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
