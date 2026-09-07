import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageContainer, PageHeader } from '@/components/layout'
import {
  Avatar,
  Badge,
  Button,
  Card,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui'
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  GitPullRequest,
  Users,
  ArrowUpDown,
  ChevronRight,
  TrendingUp,
  Info,
  Search,
} from 'lucide-react'
import { analyticsApi } from '@/lib/api'
import { TeamPerformanceData } from '@/features/projects/types'

type SortField = 'score' | 'completion' | 'overdue' | 'github' | 'assigned'

export function TeamPerformancePage() {
  const navigate = useNavigate()
  const [data, setData] = React.useState<TeamPerformanceData | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [sortField, setSortField] = React.useState<SortField>('score')
  const [sortAsc, setSortAsc] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [showFormulaModal, setShowFormulaModal] = React.useState(false)

  const loadData = React.useCallback(() => {
    setIsLoading(true)
    setError(null)
    analyticsApi
      .getTeamPerformance()
      .then((res) => {
        setData(res)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load team performance analytics')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  const sortedMembers = React.useMemo(() => {
    if (!data?.members) return []
    let list = [...data.members]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (m) =>
          m.member.name.toLowerCase().includes(q) ||
          m.member.email.toLowerCase().includes(q) ||
          (m.member.role && m.member.role.toLowerCase().includes(q))
      )
    }

    list.sort((a, b) => {
      let valA = 0
      let valB = 0
      switch (sortField) {
        case 'score':
          valA = a.accountabilityScore
          valB = b.accountabilityScore
          break
        case 'completion':
          valA = a.assignedTasks > 0 ? (a.completedTasks / a.assignedTasks) * 100 : 0
          valB = b.assignedTasks > 0 ? (b.completedTasks / b.assignedTasks) * 100 : 0
          break
        case 'overdue':
          valA = a.overdueTasks
          valB = b.overdueTasks
          break
        case 'github':
          valA = a.githubVerificationRate
          valB = b.githubVerificationRate
          break
        case 'assigned':
          valA = a.assignedTasks
          valB = b.assignedTasks
          break
      }
      return sortAsc ? valA - valB : valB - valA
    })

    return list
  }, [data, sortField, sortAsc, searchQuery])

  const getScoreBadge = (score: number) => {
    if (score >= 85) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    if (score >= 65) return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    if (score >= 50) return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  }

  return (
    <PageContainer>
      <div className="space-y-6 pb-12">
        {/* Page Header */}
        <PageHeader
          title="Team Performance & Accountability"
          description="Real-time engineering metrics, deterministic accountability scores, GitHub verification, and peer review outcomes."
          breadcrumbs={[
            { label: 'Workspace', href: '/app/dashboard' },
            { label: 'Team', href: '/app/team' },
            { label: 'Performance Analytics' },
          ]}
          primaryAction={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFormulaModal(true)}
                leftIcon={<Info className="h-4 w-4" />}
              >
                Scoring Formula
              </Button>
              <Link to="/app/team">
                <Button variant="secondary" size="sm" leftIcon={<Users className="h-4 w-4" />}>
                  Members List
                </Button>
              </Link>
            </div>
          }
        />

        {/* Loading / Error States */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-[300px] text-slate-400 text-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3" />
            Loading performance analytics from PostgreSQL...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-6 text-center space-y-3">
            <AlertTriangle className="h-8 w-8 text-rose-400 mx-auto" />
            <div className="text-white font-semibold">{error}</div>
            <Button variant="outline" size="sm" onClick={loadData}>
              Try Again
            </Button>
          </div>
        )}

        {!isLoading && data && (
          <>
            {/* 1. Overview Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Card 1: Team Score */}
              <Card className="border-slate-800 bg-slate-900/70 p-5 space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Team Score</span>
                  <ShieldCheck className="h-4 w-4 text-blue-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">
                    {data.overview.teamAccountabilityScore}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">/ 100</span>
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <TrendingUp className="h-3 w-3" />
                  <span>Deterministic composite</span>
                </div>
              </Card>

              {/* Card 2: Tasks Completed */}
              <Card className="border-slate-800 bg-slate-900/70 p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Tasks Completed</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">
                    {data.overview.tasksCompleted}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    / {data.overview.tasksTotal} total
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{
                      width: `${
                        data.overview.tasksTotal > 0
                          ? Math.round(
                              (data.overview.tasksCompleted / data.overview.tasksTotal) * 100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </Card>

              {/* Card 3: Tasks Overdue */}
              <Card className="border-slate-800 bg-slate-900/70 p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Tasks Overdue</span>
                  <Clock className="h-4 w-4 text-rose-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-3xl font-black ${
                      data.overview.tasksOverdue > 0 ? 'text-rose-400' : 'text-white'
                    }`}
                  >
                    {data.overview.tasksOverdue}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">need attention</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {data.overview.tasksOverdue === 0
                    ? 'All tasks on schedule'
                    : 'Affects on-time penalty'}
                </div>
              </Card>

              {/* Card 4: GitHub Verification Rate */}
              <Card className="border-slate-800 bg-slate-900/70 p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">GitHub Verified</span>
                  <GitPullRequest className="h-4 w-4 text-purple-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">
                    {data.overview.githubVerificationRate}%
                  </span>
                  <span className="text-xs font-semibold text-slate-500">pass rate</span>
                </div>
                <div className="text-[11px] text-purple-400 font-medium">
                  Automated SHA / PR proofs
                </div>
              </Card>

              {/* Card 5: Review Approval Rate */}
              <Card className="border-slate-800 bg-slate-900/70 p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Review Approval</span>
                  <ShieldCheck className="h-4 w-4 text-indigo-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">
                    {data.overview.reviewApprovalRate}%
                  </span>
                  <span className="text-xs font-semibold text-slate-500">first-time</span>
                </div>
                <div className="text-[11px] text-indigo-400 font-medium">
                  Manager &amp; peer signoffs
                </div>
              </Card>
            </div>

            {/* 2. Risk & Attention System Section */}
            {data.attentionItems && data.attentionItems.length > 0 && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
                    <h3 className="text-sm font-bold text-white">
                      Attention Required ({data.attentionItems.length})
                    </h3>
                  </div>
                  <span className="text-xs text-amber-400/80 font-medium">
                    Rule-based automated triggers
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                  {data.attentionItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 space-y-1.5 hover:border-amber-500/40 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-white truncate">
                          {item.title}
                        </span>
                        <Badge
                          variant={item.severity === 'high' ? 'destructive' : 'warning'}
                          size="sm"
                        >
                          {item.severity}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
                      {item.memberName && (
                        <div className="text-[10px] text-blue-400 font-medium pt-1">
                          Engineer: {item.memberName}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Visual Analytics Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Chart 1: Team Score Comparison */}
              <Card className="border-slate-800 bg-slate-900/60 p-5 space-y-4 lg:col-span-2 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Member Accountability Comparison
                    </h3>
                    <p className="text-xs text-slate-400">
                      Transparent 0–100 score distribution across all active engineers
                    </p>
                  </div>
                  <Badge variant="outline" size="sm">
                    {data.members.length} Members
                  </Badge>
                </div>

                <div className="space-y-3 pt-2">
                  {data.members.slice(0, 6).map((m) => (
                    <div
                      key={m.member.id}
                      onClick={() => navigate(`/app/team/performance/${m.member.id}`)}
                      className="group p-2 rounded-lg hover:bg-slate-800/40 cursor-pointer transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Avatar name={m.member.name} size="sm" className="h-5 w-5 text-[10px]" />
                          <span className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {m.member.name}
                          </span>
                          <span className="text-slate-500 text-[10px]">
                            ({m.completedTasks}/{m.assignedTasks} completed)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{m.accountabilityScore}%</span>
                          <ChevronRight className="h-3 w-3 text-slate-500 group-hover:text-white transition-colors" />
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full transition-all ${
                            m.accountabilityScore >= 80
                              ? 'bg-emerald-500'
                              : m.accountabilityScore >= 60
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${m.accountabilityScore}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Chart 2: Status & Evidence Meter */}
              <Card className="border-slate-800 bg-slate-900/60 p-5 space-y-4 text-left flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Quality &amp; Proof Distribution</h3>
                  <p className="text-xs text-slate-400">
                    Breakdown of peer review and GitHub verification outcomes
                  </p>
                </div>

                {/* SVG Visual Ring / Donut Representation */}
                <div className="py-4 flex items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-36 h-36 transform -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="58"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-slate-800"
                        fill="transparent"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="58"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeDasharray={364}
                        strokeDashoffset={
                          364 - (364 * data.overview.githubVerificationRate) / 100
                        }
                        strokeLinecap="round"
                        className="text-purple-500 transition-all duration-700"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <div className="text-2xl font-black text-white">
                        {data.overview.githubVerificationRate}%
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        Verified Proof
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                      GitHub Verification
                    </span>
                    <span className="font-bold text-white">
                      {data.overview.githubVerificationRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                      Review Approval
                    </span>
                    <span className="font-bold text-white">
                      {data.overview.reviewApprovalRate}%
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* 4. Team Performance Table */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-lg text-left">
              <div className="px-5 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Team Performance Ranking</h3>
                  <p className="text-xs text-slate-400">
                    Click on any member to view their complete accountability scorecard &amp; work
                    timeline
                  </p>
                </div>

                <div className="w-full sm:w-64">
                  <Input
                    placeholder="Search engineer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="h-4 w-4 text-slate-500" />}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Member</th>
                      <th className="py-3 px-3 font-semibold">Role</th>
                      <th
                        className="py-3 px-3 font-semibold text-center cursor-pointer hover:text-white"
                        onClick={() => handleSort('assigned')}
                      >
                        <div className="inline-flex items-center gap-1">
                          Assigned <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th
                        className="py-3 px-3 font-semibold text-center cursor-pointer hover:text-white"
                        onClick={() => handleSort('completion')}
                      >
                        <div className="inline-flex items-center gap-1">
                          Completed <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th
                        className="py-3 px-3 font-semibold text-center cursor-pointer hover:text-white"
                        onClick={() => handleSort('overdue')}
                      >
                        <div className="inline-flex items-center gap-1">
                          Overdue <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="py-3 px-3 font-semibold text-center">In Review</th>
                      <th
                        className="py-3 px-3 font-semibold text-center cursor-pointer hover:text-white"
                        onClick={() => handleSort('github')}
                      >
                        <div className="inline-flex items-center gap-1">
                          GitHub Verified <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th
                        className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-white"
                        onClick={() => handleSort('score')}
                      >
                        <div className="inline-flex items-center justify-end gap-1">
                          Score <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {sortedMembers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-500">
                          No members match your criteria.
                        </td>
                      </tr>
                    ) : (
                      sortedMembers.map((m) => (
                        <tr
                          key={m.member.id}
                          onClick={() => navigate(`/app/team/performance/${m.member.id}`)}
                          className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <Avatar name={m.member.name} size="sm" />
                              <div>
                                <div className="font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                                  <span>{m.member.name}</span>
                                  {m.attentionFlags && m.attentionFlags.includes('OVERDUE_TASKS') && (
                                    <span
                                      className="inline-block h-2 w-2 rounded-full bg-rose-500"
                                      title="Has overdue tasks"
                                    />
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500">{m.member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <Badge variant="outline" size="sm">
                              {m.member.role || 'Member'}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-center font-medium">{m.assignedTasks}</td>
                          <td className="py-3 px-3 text-center font-medium text-emerald-400">
                            {m.completedTasks}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {m.overdueTasks > 0 ? (
                              <span className="text-rose-400 font-bold">{m.overdueTasks}</span>
                            ) : (
                              <span className="text-slate-500">0</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center font-medium text-purple-400">
                            {m.inReviewTasks}
                          </td>
                          <td className="py-3 px-3 text-center font-medium text-blue-400">
                            {m.githubEvidenceVerified} / {m.githubEvidenceSubmitted} (
                            {m.githubVerificationRate}%)
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border ${getScoreBadge(
                                m.accountabilityScore
                              )}`}
                            >
                              {m.accountabilityScore}%
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Formula Transparency Dialog */}
      <Dialog open={showFormulaModal} onOpenChange={setShowFormulaModal}>
        <DialogContent className="max-w-xl text-left">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
              Deterministic Accountability Scoring Formula
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Every score in CollabFlow is derived deterministically from real PostgreSQL events.
              No black-box algorithms or arbitrary estimations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-xs text-slate-300 py-2">
            <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 space-y-1">
              <div className="flex justify-between font-semibold text-white">
                <span>1. Task Completion</span>
                <span className="text-blue-400">30 pts max</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Calculated as (completed / assigned) &times; 30. Measures actual deliverables
                shipped to completion.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 space-y-1">
              <div className="flex justify-between font-semibold text-white">
                <span>2. On-Time Delivery</span>
                <span className="text-blue-400">25 pts max</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Calculated as (onTime / completed) &times; 25. Rewards completion on or before the
                task deadline.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 space-y-1">
              <div className="flex justify-between font-semibold text-white">
                <span>3. Review Quality &amp; Approval</span>
                <span className="text-blue-400">20 pts max</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Calculated as (approvals / reviewsTotal) &times; 20. Evaluates work approved without
                excessive rework or change requests.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 space-y-1">
              <div className="flex justify-between font-semibold text-white">
                <span>4. GitHub Evidence Verification</span>
                <span className="text-blue-400">15 pts max</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Calculated as (verifiedProofs / submittedProofs) &times; 15. Validates commit SHAs,
                PR branches, additions, and deletions against repository state.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 space-y-1">
              <div className="flex justify-between font-semibold text-white">
                <span>5. Work Updates &amp; Consistency</span>
                <span className="text-blue-400">10 pts max</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Rewards engineering check-ins, blocker reporting, and active communication.
              </p>
            </div>

            <div className="rounded-lg border border-rose-500/20 bg-rose-950/20 p-3 space-y-1">
              <div className="flex justify-between font-semibold text-rose-300">
                <span>6. Penalty Deductions</span>
                <span className="text-rose-400">-20 pts max</span>
              </div>
              <p className="text-rose-300/80 text-[11px]">
                -5 pts per overdue task, -5 pts per blocked task, -5 pts for tasks requiring
                repeated re-reviews (&ge; 2 change requests).
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
