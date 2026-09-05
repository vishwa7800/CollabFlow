import * as React from 'react'
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Badge,
  Avatar,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Separator,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  Tooltip,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Skeleton,
  EmptyState,
  ErrorState,
  useToast,
  Sidebar,
  TopNav,
} from '@/components/ui'
import {
  Sparkles,
  Plus,
  Trash2,
  Settings,
  MoreVertical,
  CheckCircle,
  FolderKanban,
  CheckSquare,
  Users,
  LayoutDashboard,
  Search,
  ExternalLink,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export function DesignSystemPage() {
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [checkboxChecked, setCheckboxChecked] = React.useState(false)
  const [isRetrying, setIsRetrying] = React.useState(false)

  const handleRetry = () => {
    setIsRetrying(true)
    setTimeout(() => {
      setIsRetrying(false)
      toast({
        title: 'Retried successfully',
        description: 'Connection re-established with mock server.',
        variant: 'success',
      })
    }, 1500)
  }

  const sampleSidebarGroups = [
    {
      label: 'Main Navigation',
      items: [
        { label: 'Dashboard', href: '/app/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
        { label: 'Projects', href: '/app/projects', icon: <FolderKanban className="h-4 w-4" />, badge: '5' },
        { label: 'Tasks', href: '#', icon: <CheckSquare className="h-4 w-4" />, badge: '12' },
        { label: 'Team', href: '#', icon: <Users className="h-4 w-4" /> },
      ],
    },
    {
      label: 'System',
      items: [
        { label: 'Settings', href: '#', icon: <Settings className="h-4 w-4" /> },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Demo Banner */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <h1 className="text-xl font-bold tracking-tight text-white">
                CollabFlow Design System Showcase
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Internal component library verification & interactive preview (Phase 2)
            </p>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
              Back to App
            </Button>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-10 space-y-16">
        {/* 1. COLOR & DESIGN TOKENS */}
        <section className="space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-lg font-semibold text-white">1. Color System & Design Tokens</h2>
            <p className="text-xs text-slate-400">Tokens defined for backgrounds, text hierarchy, borders, brand, and semantic states.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-xs">
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-1">
              <div className="h-10 rounded bg-[#090d16] border border-slate-800" />
              <p className="font-semibold text-slate-200">App Background</p>
              <p className="text-[10px] text-slate-500">#090d16</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-1">
              <div className="h-10 rounded bg-[#101726] border border-slate-800" />
              <p className="font-semibold text-slate-200">Surface (Card)</p>
              <p className="text-[10px] text-slate-500">#101726</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-1">
              <div className="h-10 rounded bg-blue-600" />
              <p className="font-semibold text-slate-200">Brand Primary</p>
              <p className="text-[10px] text-slate-500">#2563eb</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-1">
              <div className="h-10 rounded bg-emerald-600" />
              <p className="font-semibold text-slate-200">Success</p>
              <p className="text-[10px] text-slate-500">#10b981</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-1">
              <div className="h-10 rounded bg-amber-500" />
              <p className="font-semibold text-slate-200">Warning</p>
              <p className="text-[10px] text-slate-500">#f59e0b</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-1">
              <div className="h-10 rounded bg-red-600" />
              <p className="font-semibold text-slate-200">Destructive</p>
              <p className="text-[10px] text-slate-500">#ef4444</p>
            </div>
          </div>
        </section>

        {/* 2. TYPOGRAPHY */}
        <section className="space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-lg font-semibold text-white">2. Typography Hierarchy</h2>
            <p className="text-xs text-slate-400">Standardized scale for consistent visual rhythm.</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
            <div>
              <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Display & Hero Heading (36px / Bold)
              </p>
              <p className="text-xs text-slate-500 mt-1">Used for hero headers and main dashboard focus</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Page Heading (24px / Bold)
              </h2>
              <p className="text-xs text-slate-500 mt-1">Used for top-level page titles</p>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold text-white">
                Section Heading (18px / SemiBold)
              </h3>
              <p className="text-xs text-slate-500 mt-1">Used for major panel & modal section headings</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-slate-200 leading-relaxed">
                Body text (14px / Regular) — CollabFlow provides small agile teams with a clean, structured workspace to manage projects, assign tasks, collaborate on Kanban boards, and track real-time progress.
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Secondary & metadata text (12px / Regular) — Last updated 2 minutes ago by Vishwa Patel
              </p>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-2">
                Caption / Label (11px / SemiBold Upper)
              </p>
            </div>
          </div>
        </section>

        {/* 3. BUTTONS */}
        <section className="space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-lg font-semibold text-white">3. Buttons</h2>
            <p className="text-xs text-slate-400">All variants, sizes, icon slots, and interactive loading/disabled states.</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
            {/* Variants */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Variants</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            <Separator />

            {/* Sizes */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Sizes</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small (sm)</Button>
                <Button size="md">Default (md)</Button>
                <Button size="lg">Large (lg)</Button>
                <Button size="icon" aria-label="Add project">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* States & Icons */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">States & Icons</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button leftIcon={<Sparkles className="h-4 w-4" />}>
                  With Left Icon
                </Button>
                <Button variant="secondary" rightIcon={<Plus className="h-4 w-4" />}>
                  With Right Icon
                </Button>
                <Button isLoading>Loading State</Button>
                <Button disabled>Disabled Button</Button>
                <Button variant="destructive" leftIcon={<Trash2 className="h-4 w-4" />}>
                  Delete Item
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FORM CONTROLS */}
        <section className="space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-lg font-semibold text-white">4. Form Controls</h2>
            <p className="text-xs text-slate-400">Accessible form inputs, textareas, selects, checkboxes, and validation states.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Standard Inputs</CardTitle>
                <CardDescription>Inputs with labels, icons, helper text, and placeholders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Project Title"
                  required
                  placeholder="e.g. Website Redesign Q3"
                  helperText="Choose a descriptive name for your team workspace."
                />
                <Input
                  label="Search Tasks"
                  placeholder="Filter tasks by name..."
                  leftIcon={<Search className="h-4 w-4" />}
                />
                <Input
                  label="Disabled Field"
                  disabled
                  value="owner@collabflow.dev"
                  helperText="This field is managed by the system."
                />
              </CardContent>
              <CardFooter className="justify-between">
                <span className="text-xs text-slate-500">Auto-saved draft</span>
                <Button size="sm" variant="ghost">Reset</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Textarea & Select & Validation</CardTitle>
                <CardDescription>Extended form controls and error state rendering</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="Project Role"
                  required
                  options={[
                    { value: 'owner', label: 'Owner (Full Access)' },
                    { value: 'manager', label: 'Manager (Manage Tasks & Members)' },
                    { value: 'member', label: 'Member (Edit Assigned Tasks)' },
                    { value: 'viewer', label: 'Viewer (Read-Only)' },
                  ]}
                  helperText="Assign the appropriate permission tier."
                />
                <Textarea
                  label="Task Description"
                  placeholder="Provide context, acceptance criteria, or technical details..."
                  rows={2}
                />
                <Input
                  label="Validation Error State"
                  defaultValue="invalid-email-format"
                  error="Please enter a valid work email address."
                />
              </CardContent>
            </Card>
          </div>

          {/* Checkboxes */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Checkboxes</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Checkbox
                label="Notify team members"
                description="Send email notifications when tasks are assigned."
                checked={checkboxChecked}
                onChange={(e) => setCheckboxChecked(e.target.checked)}
              />
              <Checkbox
                label="Require review before completion"
                description="Managers must approve before status moves to Done."
                defaultChecked
              />
              <Checkbox
                label="Disabled option"
                description="This option cannot be toggled at this permission level."
                disabled
              />
            </div>
          </div>
        </section>

        {/* 5. BADGES & AVATARS */}
        <section className="space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-lg font-semibold text-white">5. Badges & Avatars</h2>
            <p className="text-xs text-slate-400">Visual indicators for roles, task statuses, priorities, and user profiles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Badges</CardTitle>
                <CardDescription>Semantic badges with optional status dots and pulse animations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success" dot pulseDot>In Progress</Badge>
                  <Badge variant="warning" dot>Medium Priority</Badge>
                  <Badge variant="destructive" dot>High / Overdue</Badge>
                  <Badge variant="info" dot>Todo</Badge>
                  <Badge variant="outline">Viewer</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge size="sm" variant="success">Completed (sm)</Badge>
                  <Badge size="sm" variant="destructive">Urgent (sm)</Badge>
                  <Badge size="sm" variant="info">Owner (sm)</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Avatars</CardTitle>
                <CardDescription>Initials generator, fallback color hashing, and size variants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar name="Alex Rivera" size="sm" />
                  <Avatar name="Sarah Connor" size="md" />
                  <Avatar name="David Chen" size="lg" />
                  <Avatar name="Vishwa Patel" size="xl" />
                </div>
                <div className="flex items-center gap-3">
                  <Avatar name="Tech Lead" size="md" />
                  <Avatar name="Frontend Dev" size="md" />
                  <Avatar name="Product Manager" size="md" />
                  <Avatar name="QA Engineer" size="md" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 6. DIALOG, DROPDOWN & TOOLTIP */}
        <section className="space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-lg font-semibold text-white">6. Interactive Overlays (Dialog, Dropdown, Tooltip)</h2>
            <p className="text-xs text-slate-400">Accessible popovers, focus trap handling, keyboard Esc dismiss, and backdrops.</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 flex flex-wrap items-center gap-4">
            {/* Modal Dialog Trigger */}
            <Button variant="primary" onClick={() => setDialogOpen(true)}>
              Open Modal Dialog
            </Button>

            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" rightIcon={<MoreVertical className="h-4 w-4" />}>
                  Project Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="left">
                <DropdownMenuLabel>Project Options</DropdownMenuLabel>
                <DropdownMenuItem icon={<CheckCircle className="h-3.5 w-3.5" />}>
                  Mark all tasks complete
                </DropdownMenuItem>
                <DropdownMenuItem icon={<Settings className="h-3.5 w-3.5" />}>
                  Project settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  destructive
                  icon={<Trash2 className="h-3.5 w-3.5" />}
                  onClick={() => toast({ title: 'Delete requested', description: 'Action recorded.', variant: 'destructive' })}
                >
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tooltips */}
            <Tooltip content="Quick shortcut: Press Ctrl+K to search" position="top">
              <Button variant="secondary" size="sm">Hover Tooltip (Top)</Button>
            </Tooltip>
            <Tooltip content="Requires Manager or Owner role" position="bottom">
              <Button variant="secondary" size="sm">Hover Tooltip (Bottom)</Button>
            </Tooltip>

            {/* Modal Dialog Content */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Provide project details to initialize a centralized workspace for your team.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <Input label="Project Name" placeholder="e.g. Infrastructure Migration" autoFocus />
                  <Textarea label="Project Scope" placeholder="Brief overview of project goals..." rows={3} />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setDialogOpen(false)
                      toast({
                        title: 'Project Created',
                        description: 'Your project workspace has been created.',
                        variant: 'success',
                      })
                    }}
                  >
                    Create Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* 7. TABS & TABLE */}
        <section className="space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-lg font-semibold text-white">7. Tabs & Responsive Table</h2>
            <p className="text-xs text-slate-400">Structured data presentation with tabs for view switching.</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
            <Tabs defaultValue="all">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All Tasks (3)</TabsTrigger>
                  <TabsTrigger value="assigned">Assigned to Me (1)</TabsTrigger>
                  <TabsTrigger value="completed">Completed (1)</TabsTrigger>
                </TabsList>
                <span className="text-xs text-slate-500 hidden sm:inline">Showing sample items</span>
              </div>

              <TabsContent value="all">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium text-white">
                        Design centralized API communication client
                      </TableCell>
                      <TableCell>
                        <Badge variant="success" dot>Done</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive" size="sm">High</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar name="Vishwa Patel" size="sm" />
                          <span>Vishwa Patel</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-white">
                        Implement responsive Kanban board drag & drop
                      </TableCell>
                      <TableCell>
                        <Badge variant="info" dot pulseDot>In Progress</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="warning" size="sm">Medium</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar name="Alex Rivera" size="sm" />
                          <span>Alex Rivera</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-white">
                        Configure PostgreSQL database migrations
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" dot>Todo</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" size="sm">Low</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar name="Sarah Connor" size="sm" />
                          <span>Sarah Connor</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="assigned">
                <p className="text-xs text-slate-400 p-4 border border-dashed border-slate-800 rounded-lg">
                  Tab filter active: 1 assigned task.
                </p>
              </TabsContent>
              <TabsContent value="completed">
                <p className="text-xs text-slate-400 p-4 border border-dashed border-slate-800 rounded-lg">
                  Tab filter active: 1 completed task.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* 8. APPLICATION STATES (LOADING, EMPTY, ERROR, TOASTS) */}
        <section className="space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-lg font-semibold text-white">8. Application States & Feedback</h2>
            <p className="text-xs text-slate-400">Loading skeletons, empty placeholders, error recovery, and toast notifications.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Loading Skeleton */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Skeleton Loading</CardTitle>
                <CardDescription>Pulse placeholders while fetching</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full" />
                <div className="flex justify-end gap-2 pt-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>

            {/* Empty State */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Empty State</CardTitle>
                <CardDescription>When no data exists yet</CardDescription>
              </CardHeader>
              <CardContent>
                <EmptyState
                  title="No tasks found"
                  description="Get started by creating your first task in this project."
                  primaryAction={<Button size="sm">+ New Task</Button>}
                />
              </CardContent>
            </Card>

            {/* Error State */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Error State</CardTitle>
                <CardDescription>User-friendly error & retry action</CardDescription>
              </CardHeader>
              <CardContent>
                <ErrorState
                  title="Failed to load project members"
                  description="Network connection timed out. Check your internet connection."
                  onRetry={handleRetry}
                  isRetrying={isRetrying}
                />
              </CardContent>
            </Card>
          </div>

          {/* Toast Notification Triggers */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trigger Toasts</h4>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast({ title: 'Task Created', description: 'Task #104 has been added to the board.', variant: 'success' })}
              >
                Success Toast
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast({ title: 'Action Failed', description: 'You do not have permission to delete this project.', variant: 'destructive' })}
              >
                Error Toast
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast({ title: 'Unsaved Changes', description: 'You have modified task details without saving.', variant: 'warning' })}
              >
                Warning Toast
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast({ title: 'New Comment', description: 'Alex Rivera commented on your task.', variant: 'info' })}
              >
                Info Toast
              </Button>
            </div>
          </div>
        </section>

        {/* 9. NAVIGATION (SIDEBAR & TOPNAV FOUNDATION) */}
        <section className="space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-lg font-semibold text-white">9. Navigation Architecture</h2>
            <p className="text-xs text-slate-400">Desktop collapsible sidebar, mobile drawer, and top navigation header preview.</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
            {/* TopNav Component Demo */}
            <TopNav
              title="CollabFlow Workspace"
              notificationsCount={3}
              actions={
                <Button size="sm" variant="primary">+ Create Task</Button>
              }
            />

            {/* Sidebar + Content Mock Frame */}
            <div className="flex h-[320px] bg-slate-950">
              <Sidebar
                groups={sampleSidebarGroups}
                footer={
                  <div className="flex items-center gap-2 px-2 py-1 text-xs text-slate-400">
                    <Avatar name="Vishwa Patel" size="sm" />
                    <span className="truncate">Vishwa Patel</span>
                  </div>
                }
              />
              <div className="flex-1 p-6 bg-slate-900/20 overflow-y-auto">
                <div className="max-w-xl space-y-3">
                  <h3 className="text-sm font-semibold text-white">Main Application Workspace Area</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    This demonstrates how the reusable Sidebar and TopNav wrap subsequent application views (Dashboard, Projects, Kanban board, Task Details).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
