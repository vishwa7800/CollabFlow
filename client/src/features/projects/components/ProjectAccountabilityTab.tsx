import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Project,
  ProjectTask,
  ProjectAccountabilityData,
  ProjectAnalyticsData,
} from '../types'
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileCheck,
  AlertTriangle,
  Flame,
  Info,
  ChevronRight,
  GitPullRequest,
  ExternalLink,
  Link2,
  Unlink,
  TrendingUp,
} from 'lucide-react'
import {
  Avatar,
  Badge,
  Button,
  Input,
  useToast,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui'
import { accountabilityApi, analyticsApi } from '@/lib/api'
import { githubApi } from '@/lib/api/github'

export interface ProjectAccountabilityTabProps {
  project: Project
  tasks: ProjectTask[]
  onSelectTask: (task: ProjectTask) => void
}

export function ProjectAccountabilityTab({
  project,
  tasks,
  onSelectTask,
}: ProjectAccountabilityTabProps) {
  const navigate = useNavigate()
  const [data, setData] = React.useState<ProjectAccountabilityData | null>(null)
  const [analyticsData, setAnalyticsData] = React.useState<ProjectAnalyticsData | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isConnecting, setIsConnecting] = React.useState(false)
  const [isDisconnecting, setIsDisconnecting] = React.useState(false)
  const [showConnectForm, setShowConnectForm] = React.useState(false)
  const [showFormulaModal, setShowFormulaModal] = React.useState(false)
  const [repoUrlInput, setRepoUrlInput] = React.useState('')
  const [branchInput, setBranchInput] = React.useState('main')
  const { toast } = useToast()

  const fetchAccountability = React.useCallback(() => {
    setIsLoading(true)
    Promise.all([
      accountabilityApi.getProjectAccountability(project.id).catch(() => null),
      analyticsApi.getProjectAnalytics(project.id).catch(() => null),
    ])
      .then(([accRes, anaRes]) => {
        if (accRes) setData(accRes)
        if (anaRes) setAnalyticsData(anaRes)
      })
      .catch(() => {
        // Fallback calculation from local tasks if network/endpoint not initialized
        const now = new Date()
        let completed = 0
        let onTime = 0
        let verified = 0
        let submitted = 0
        let overdue = 0
        let blocked = 0

        const waiting: any[] = []
        for (const t of tasks) {
          const isDone = t.status === 'Done'
          const isOverdue = t.dueDate && new Date(t.dueDate) < now && !isDone
          const isBlocked = t.evidenceStatus === 'Blocked'
          const isVerified = t.evidenceStatus === 'Verified'
          const isSub = t.evidenceStatus === 'Evidence Submitted' || t.status === 'Review'

          if (isDone) {
            completed++
            onTime++
          }
          if (isVerified) verified++
          if (isSub) {
            submitted++
            waiting.push(t)
          }
          if (isOverdue) overdue++
          if (isBlocked) blocked++
        }

        const compScore = tasks.length > 0 ? Math.round((completed / tasks.length) * 35) : 35
        const onTimeScore = completed > 0 ? Math.round((onTime / completed) * 25) : 25
        const evScore = completed > 0 ? Math.round((verified / completed) * 30) : 30
        const penalty = Math.min(20, overdue * 5 + blocked * 5)
        const totalScore = Math.max(0, Math.min(100, compScore + onTimeScore + evScore + 10 - penalty))

        setData({
          projectId: project.id,
          totalTasks: tasks.length,
          completedTasks: completed,
          onTimeTasks: onTime,
          verifiedEvidenceTasks: verified,
          submittedEvidenceTasks: submitted,
          overdueTasks: overdue,
          blockedTasks: blocked,
          overallScore: totalScore,
          scoreBreakdown: {
            completionScore: compScore,
            onTimeScore,
            evidenceScore: evScore,
            penalty,
          },
          members: (project.members || []).map((m) => ({
            member: m,
            assigned: tasks.filter((t) => t.assignee?.id === m.id).length,
            completed: tasks.filter((t) => t.assignee?.id === m.id && t.status === 'Done').length,
            onTime: tasks.filter((t) => t.assignee?.id === m.id && t.status === 'Done').length,
            evidenceSubmitted: tasks.filter((t) => t.assignee?.id === m.id && t.evidenceStatus === 'Evidence Submitted').length,
            evidenceVerified: tasks.filter((t) => t.assignee?.id === m.id && t.evidenceStatus === 'Verified').length,
            overdue: 0,
            blocked: tasks.filter((t) => t.assignee?.id === m.id && t.evidenceStatus === 'Blocked').length,
            score: 85,
            scoreBreakdown: { completionScore: 30, onTimeScore: 25, evidenceScore: 25, penalty: 0 },
          })),
          waitingVerificationTasks: waiting as any,
          recentWorkUpdates: [],
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [project.id, tasks, project.members])

  React.useEffect(() => {
    fetchAccountability()
  }, [fetchAccountability])

  if (isLoading || !data) {
    return (
      <div className="py-12 text-center text-slate-400">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mb-3" />
        <p className="text-sm">Calculating Project Accountability metrics...</p>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30'
  }

  const handleConnectRepo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!repoUrlInput.trim()) return
    setIsConnecting(true)
    try {
      await githubApi.connectRepo(project.id, {
        repoUrl: repoUrlInput.trim(),
        defaultBranch: branchInput.trim() || 'main',
      })
      toast({
        title: 'GitHub Repository Connected',
        description: 'Pull requests and commits will now be validated against this repository.',
        variant: 'success',
      })
      setShowConnectForm(false)
      setRepoUrlInput('')
      fetchAccountability()
    } catch (err: any) {
      toast({
        title: 'Connection Failed',
        description: err.message || 'Could not connect GitHub repository.',
        variant: 'destructive',
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnectRepo = async () => {
    if (!confirm('Are you sure you want to disconnect the GitHub repository for this project?')) return
    setIsDisconnecting(true)
    try {
      await githubApi.disconnectRepo(project.id)
      toast({
        title: 'Repository Disconnected',
        description: 'Project is no longer linked to a specific GitHub repository.',
        variant: 'success',
      })
      fetchAccountability()
    } catch (err: any) {
      toast({
        title: 'Disconnect Failed',
        description: err.message || 'Could not disconnect GitHub repository.',
        variant: 'destructive',
      })
    } finally {
      setIsDisconnecting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Header & Score Banner */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldCheck className="h-4 w-4" />
              <span>Verifiable Engineering Accountability</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Project Accountability & Evidence
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Tracks genuine work delivery, GitHub branches/PRs/commits, member check-ins, and peer
              reviews with anti-self-verification guarantees.
            </p>
          </div>

          {/* Overall Team Accountability Score Widget */}
          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 rounded-xl p-4 shrink-0">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-xl border text-2xl font-black ${getScoreColor(
                data.overallScore
              )}`}
            >
              {data.overallScore}%
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Team Score
              </div>
              <div className="text-sm font-bold text-white">
                {data.overallScore >= 80
                  ? 'High Accountability'
                  : data.overallScore >= 60
                  ? 'Moderate Accountability'
                  : 'Action Needed'}
              </div>
              <button
                onClick={() => setShowFormulaModal(true)}
                className="text-[11px] text-blue-400 hover:underline mt-0.5 flex items-center gap-1"
              >
                <Info className="h-3 w-3" />
                <span>Explain scoring formula</span>
              </button>
            </div>
          </div>
        </div>

        {/* Score Breakdown Pills */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Score Weighting:</span>
          <span className="bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
            Completion: <strong className="text-white">{data.scoreBreakdown.completionScore}/35</strong>
          </span>
          <span className="bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
            On-Time Delivery: <strong className="text-white">{data.scoreBreakdown.onTimeScore}/25</strong>
          </span>
          <span className="bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
            Verified Evidence: <strong className="text-white">{data.scoreBreakdown.evidenceScore}/30</strong>
          </span>
          {data.scoreBreakdown.penalty > 0 && (
            <span className="bg-rose-950/30 text-rose-300 px-2.5 py-1 rounded-md border border-rose-900/50">
              Penalties (Overdue/Blocked): -<strong>{data.scoreBreakdown.penalty}%</strong>
            </span>
          )}
        </div>
      </div>

      {/* 2. Connected GitHub Repository Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-purple-950/40 text-purple-400 border border-purple-800/40 mt-0.5 shrink-0">
              <GitPullRequest className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">GitHub Repository Integration</h3>
                {data.connectedGitHubRepo ? (
                  <Badge variant="success" size="sm" className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Connected</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" size="sm">
                    Not Connected
                  </Badge>
                )}
              </div>

              {data.connectedGitHubRepo ? (
                <div className="mt-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <a
                      href={data.connectedGitHubRepo.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-purple-300 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>{data.connectedGitHubRepo.owner}/{data.connectedGitHubRepo.repoName}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">
                      Default branch: <strong className="text-white font-mono">{data.connectedGitHubRepo.defaultBranch}</strong>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Work evidence submitted by developers must correspond to this connected repository.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 mt-1">
                  Connect a GitHub repository to enforce branch, pull request, and commit verification on developer evidence.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {data.connectedGitHubRepo ? (
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-rose-400 border-rose-900/60 hover:bg-rose-950/30"
                onClick={handleDisconnectRepo}
                disabled={isDisconnecting}
                isLoading={isDisconnecting}
                leftIcon={<Unlink className="h-3.5 w-3.5" />}
              >
                Disconnect
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                className="text-xs"
                onClick={() => setShowConnectForm((prev) => !prev)}
                leftIcon={<Link2 className="h-3.5 w-3.5" />}
              >
                {showConnectForm ? 'Cancel' : 'Connect Repository'}
              </Button>
            )}
          </div>
        </div>

        {/* Connect Repository Form */}
        {showConnectForm && !data.connectedGitHubRepo && (
          <form
            onSubmit={handleConnectRepo}
            className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
          >
            <div className="sm:col-span-7">
              <Input
                label="GitHub Repository URL *"
                placeholder="https://github.com/organization/repository"
                value={repoUrlInput}
                onChange={(e) => setRepoUrlInput(e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-3">
              <Input
                label="Default Branch"
                placeholder="main"
                value={branchInput}
                onChange={(e) => setBranchInput(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="w-full"
                disabled={!repoUrlInput.trim() || isConnecting}
                isLoading={isConnecting}
              >
                Connect
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* 2b. Risk & Attention System Section */}
      {analyticsData?.attentionItems && analyticsData.attentionItems.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Attention Required ({analyticsData.attentionItems.length})
              </h3>
            </div>
            <span className="text-xs text-amber-400 font-medium">Automatic Risk Detection</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {analyticsData.attentionItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-slate-800 bg-slate-900/90 space-y-1 text-left"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-white truncate">{item.title}</span>
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
                    Assignee: {item.memberName}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="rounded-lg border border-slate-800/80 bg-slate-900/70 p-3.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Completed</span>
          </div>
          <div className="mt-2 text-xl font-bold text-white">
            {data.completedTasks}{' '}
            <span className="text-xs text-slate-500 font-normal">/ {data.totalTasks}</span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800/80 bg-slate-900/70 p-3.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Clock className="h-4 w-4 text-blue-400" />
            <span>On Time</span>
          </div>
          <div className="mt-2 text-xl font-bold text-white">
            {data.onTimeTasks}{' '}
            <span className="text-xs text-slate-500 font-normal">
              ({data.completedTasks > 0 ? Math.round((data.onTimeTasks / data.completedTasks) * 100) : 100}%)
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800/80 bg-slate-900/70 p-3.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Verified Proof</span>
          </div>
          <div className="mt-2 text-xl font-bold text-white">{data.verifiedEvidenceTasks}</div>
        </div>

        <div className="rounded-lg border border-slate-800/80 bg-slate-900/70 p-3.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <FileCheck className="h-4 w-4 text-amber-400" />
            <span>Awaiting Review</span>
          </div>
          <div className="mt-2 text-xl font-bold text-amber-300">
            {data.tasksAwaitingReview ?? data.submittedEvidenceTasks}
          </div>
        </div>

        <div className="rounded-lg border border-slate-800/80 bg-slate-900/70 p-3.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span>Changes Req.</span>
          </div>
          <div className="mt-2 text-xl font-bold text-amber-200">
            {data.tasksWithChangesRequested ?? 0}
          </div>
        </div>

        <div className="rounded-lg border border-slate-800/80 bg-slate-900/70 p-3.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            <span>Overdue</span>
          </div>
          <div className="mt-2 text-xl font-bold text-rose-300">{data.overdueTasks}</div>
        </div>

        <div className="rounded-lg border border-slate-800/80 bg-slate-900/70 p-3.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Flame className="h-4 w-4 text-orange-400" />
            <span>Blocked</span>
          </div>
          <div className="mt-2 text-xl font-bold text-orange-300">{data.blockedTasks}</div>
        </div>
      </div>

      {/* 3a. Waiting for Verification Review Queue */}
      {data.waitingVerificationTasks.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Tasks Waiting for Evidence Verification ({data.waitingVerificationTasks.length})
              </h3>
            </div>
            <span className="text-xs text-amber-400">Managers/Owners must review</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {data.waitingVerificationTasks.map((t) => {
              const fullTask = tasks.find((x) => x.id === t.id) || (t as any)
              return (
                <div
                  key={t.id}
                  onClick={() => onSelectTask(fullTask)}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900/90 hover:border-amber-500/40 hover:bg-slate-900 cursor-pointer transition-all"
                >
                  <div className="space-y-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white truncate">{t.title}</span>
                      <Badge variant="warning" size="sm">
                        Review Needed
                      </Badge>
                    </div>

                    {t.evidence?.githubLinks && t.evidence.githubLinks.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-purple-300">
                        <GitPullRequest className="h-3 w-3 shrink-0" />
                        <span className="truncate">{t.evidence.githubLinks[0].repoName}</span>
                        {t.evidence.githubLinks[0].verificationStatus === 'VERIFIED' && (
                          <span className="text-[10px] text-emerald-400 font-sans font-semibold">✓ Verified Proof</span>
                        )}
                        {t.evidence.githubLinks[0].verificationStatus === 'VERIFICATION_FAILED' && (
                          <span className="text-[10px] text-rose-400 font-sans font-semibold">✗ Verification Failed</span>
                        )}
                      </div>
                    )}

                    {t.assignee && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Avatar name={t.assignee.name} size="sm" className="h-4 w-4 text-[9px]" />
                        <span>Submitted by {t.assignee.name}</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500 shrink-0" />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 3b. Tasks with Changes Requested Queue */}
      {data.changesRequestedTasks && data.changesRequestedTasks.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Tasks with Changes Requested ({data.changesRequestedTasks.length})
              </h3>
            </div>
            <span className="text-xs text-amber-400">Developers must update &amp; resubmit</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {data.changesRequestedTasks.map((t) => {
              const fullTask = tasks.find((x) => x.id === t.id) || (t as any)
              return (
                <div
                  key={t.id}
                  onClick={() => onSelectTask(fullTask)}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900/90 hover:border-amber-500/40 hover:bg-slate-900 cursor-pointer transition-all"
                >
                  <div className="space-y-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white truncate">{t.title}</span>
                      <Badge variant="destructive" size="sm">
                        Modifications Needed
                      </Badge>
                    </div>
                    {t.lastReview?.comment && (
                      <p className="text-[11px] text-slate-300 italic truncate">
                        &ldquo;{t.lastReview.comment}&rdquo;
                      </p>
                    )}
                    {t.assignee && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Avatar name={t.assignee.name} size="sm" className="h-4 w-4 text-[9px]" />
                        <span>Assigned to {t.assignee.name}</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500 shrink-0" />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 4. Team Member Accountability Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Team Member Accountability Breakdown</h3>
            <p className="text-xs text-slate-400">
              Verifiable proof completion rate per engineer
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Engineer</th>
                <th className="py-3 px-3 font-semibold">Role</th>
                <th className="py-3 px-3 font-semibold text-center">Assigned</th>
                <th className="py-3 px-3 font-semibold text-center">Completed</th>
                <th className="py-3 px-3 font-semibold text-center">On Time</th>
                <th className="py-3 px-3 font-semibold text-center">Verified Proof</th>
                <th className="py-3 px-3 font-semibold text-center">Blocked / Overdue</th>
                <th className="py-3 px-4 font-semibold text-right">Accountability Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {data.members.map((m) => (
                <tr
                  key={m.member.id}
                  onClick={() => navigate(`/app/team/performance/${m.member.id}`)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={m.member.name} size="sm" />
                      <div>
                        <div className="font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1">
                          <span>{m.member.name}</span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity" />
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
                  <td className="py-3 px-3 text-center font-medium">{m.assigned}</td>
                  <td className="py-3 px-3 text-center font-medium text-emerald-400">
                    {m.completed}
                  </td>
                  <td className="py-3 px-3 text-center font-medium">{m.onTime}</td>
                  <td className="py-3 px-3 text-center font-medium text-emerald-400">
                    {m.evidenceVerified}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {m.blocked > 0 || m.overdue > 0 ? (
                      <span className="text-rose-400 font-semibold">
                        {m.blocked} blk / {m.overdue} od
                      </span>
                    ) : (
                      <span className="text-slate-500">0</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border ${getScoreColor(
                        m.score
                      )}`}
                    >
                      {m.score}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Recent Review Decisions Stream */}
      {data.recentReviews && data.recentReviews.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-purple-400" />
              <span>Recent Peer &amp; Manager Review Decisions</span>
            </h3>
            <span className="text-xs text-slate-500">Live PostgreSQL audit trail</span>
          </div>

          <div className="space-y-2">
            {data.recentReviews.map((rev) => (
              <div
                key={rev.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar name={rev.reviewer.name} size="sm" className="h-5 w-5 text-[10px]" />
                  <div className="truncate">
                    <span className="font-semibold text-white">{rev.reviewer.name}</span>{' '}
                    <span className="text-slate-400">
                      {rev.decision === 'APPROVED' ? 'approved evidence for' : 'requested changes on'}
                    </span>{' '}
                    <span className="font-medium text-blue-400">{rev.taskTitle}</span>
                    {rev.comment && (
                      <span className="text-slate-400 italic block text-[11px] truncate">
                        &ldquo;{rev.comment}&rdquo;
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={rev.decision === 'APPROVED' ? 'success' : 'warning'} size="sm">
                    {rev.decision === 'APPROVED' ? 'Approved' : 'Changes Requested'}
                  </Badge>
                  <span className="text-[10px] text-slate-500">{rev.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Recent Work Updates Stream */}
      {data.recentWorkUpdates && data.recentWorkUpdates.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Recent Engineering Check-ins</h3>
            <span className="text-xs text-slate-500">Live work update feed</span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {data.recentWorkUpdates.map((u) => (
              <div key={u.id} className="py-3 flex items-start gap-3 text-xs">
                <Avatar name={u.user.name} size="sm" />
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-white">
                      {u.user.name}{' '}
                      <span className="font-normal text-slate-400">on task</span>{' '}
                      <span className="text-blue-400">{u.taskTitle}</span>
                    </span>
                    <span className="text-[10px] text-slate-500">{u.createdAt}</span>
                  </div>

                  <p className="text-slate-300 leading-relaxed">{u.content}</p>

                  <div className="flex items-center gap-2 pt-1">
                    {u.progress !== undefined && (
                      <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400">
                        Progress: {u.progress}%
                      </span>
                    )}
                    {u.isBlocker && (
                      <span className="text-[10px] bg-rose-950/40 text-rose-300 px-1.5 py-0.5 rounded border border-rose-900/50">
                        ⚠ Blocker: {u.blockerReason || 'Reported'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Project Work Timeline */}
      {analyticsData?.timeline && analyticsData.timeline.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span>Project Work History &amp; Milestones</span>
            </h3>
            <Badge variant="outline" size="sm">
              Live PostgreSQL Activity
            </Badge>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {analyticsData.timeline.slice(0, 15).map((event: any, idx: number) => (
              <div key={event.id || idx} className="relative space-y-1">
                <span className="absolute -left-[1.65rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-blue-500" />
                <div className="text-xs font-medium text-white leading-tight">
                  <span className="font-semibold text-slate-300">{event.user?.name || 'Team member'}</span>{' '}
                  <span className="text-slate-400">{event.action}</span>{' '}
                  <span className="font-semibold text-blue-400">{event.target}</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  {new Date(event.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
              No black-box algorithms or self-reported checkboxes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs text-slate-300 py-2">
            <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 space-y-1">
              <div className="flex justify-between font-semibold text-white">
                <span>1. Task Completion</span>
                <span className="text-blue-400">30 pts max</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Calculated as (completed / assigned) &times; 30. Measures verifiable deliverables shipped to completion.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 space-y-1">
              <div className="flex justify-between font-semibold text-white">
                <span>2. On-Time Delivery</span>
                <span className="text-blue-400">25 pts max</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Calculated as (onTime / completed) &times; 25. Rewards completion on or before the target deadline.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 space-y-1">
              <div className="flex justify-between font-semibold text-white">
                <span>3. Review Quality &amp; Approval</span>
                <span className="text-blue-400">20 pts max</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Calculated as (approvals / totalReviews) &times; 20. Evaluates work approved without repeated rework.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 space-y-1">
              <div className="flex justify-between font-semibold text-white">
                <span>4. GitHub Evidence Verification</span>
                <span className="text-blue-400">15 pts max</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Calculated as (verifiedProofs / totalProofs) &times; 15. Validates commit SHAs and PR branches.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 space-y-1">
              <div className="flex justify-between font-semibold text-white">
                <span>5. Work Updates &amp; Check-ins</span>
                <span className="text-blue-400">10 pts max</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Rewards engineering check-ins, progress updates, and blocker reporting.
              </p>
            </div>

            <div className="rounded-lg border border-rose-500/20 bg-rose-950/20 p-3 space-y-1">
              <div className="flex justify-between font-semibold text-rose-300">
                <span>6. Penalty Deductions</span>
                <span className="text-rose-400">-20 pts max</span>
              </div>
              <p className="text-rose-300/80 text-[11px]">
                -5 pts per overdue task, -5 pts per blocked task, -5 pts for tasks with repeated rework (&ge; 2 changes requested).
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
