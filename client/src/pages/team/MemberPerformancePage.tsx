import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/layout'
import {
  Avatar,
  Badge,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui'
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  GitPullRequest,
  ArrowLeft,
  Info,
  FileCheck,
  GitCommit,
  Layers,
} from 'lucide-react'
import { analyticsApi } from '@/lib/api'
import { MemberScorecardData } from '@/features/projects/types'

export function MemberPerformancePage() {
  const { memberId } = useParams<{ memberId: string }>()
  const navigate = useNavigate()
  const [data, setData] = React.useState<MemberScorecardData | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [showFormulaModal, setShowFormulaModal] = React.useState(false)

  const loadScorecard = React.useCallback(() => {
    if (!memberId) return
    setIsLoading(true)
    setError(null)
    analyticsApi
      .getMemberPerformance(memberId)
      .then((res) => {
        setData(res)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load member scorecard')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [memberId])

  React.useEffect(() => {
    loadScorecard()
  }, [loadScorecard])

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20'
    if (score >= 65) return 'text-blue-400 border-blue-500/30 bg-blue-950/20'
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-950/20'
    return 'text-rose-400 border-rose-500/30 bg-rose-950/20'
  }

  return (
    <PageContainer>
      <div className="space-y-6 pb-12 text-left">
        {/* Navigation Breadcrumbs / Back */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/team/performance')}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Team Performance
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFormulaModal(true)}
            leftIcon={<Info className="h-4 w-4" />}
          >
            How is this calculated?
          </Button>
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-[300px] text-slate-400 text-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3" />
            Loading member scorecard and activity timeline...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-6 text-center space-y-3">
            <AlertTriangle className="h-8 w-8 text-rose-400 mx-auto" />
            <div className="text-white font-semibold">{error}</div>
            <Button variant="outline" size="sm" onClick={loadScorecard}>
              Retry
            </Button>
          </div>
        )}

        {!isLoading && data && (
          <>
            {/* 1. Member Profile & Hero Scorecard Banner */}
            <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 shadow-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Member Profile */}
                <div className="flex items-center gap-4">
                  <Avatar name={data.member.name} size="lg" className="h-16 w-16 text-xl" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-black text-white">{data.member.name}</h1>
                      <Badge variant="outline" size="sm">
                        {data.member.role || 'Member'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">{data.member.email}</p>
                    <div className="text-[11px] text-blue-400 flex items-center gap-1.5 pt-0.5">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Verified Software Engineering Contributor</span>
                    </div>
                  </div>
                </div>

                {/* Accountability Score Hero Widget */}
                <div className="flex items-center gap-4 bg-slate-950/90 border border-slate-800 rounded-xl p-4 shrink-0">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-xl border text-2xl font-black ${getScoreColor(
                      data.accountabilityScore
                    )}`}
                  >
                    {data.accountabilityScore}%
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Accountability Score
                    </div>
                    <div className="text-sm font-bold text-white">
                      {data.accountabilityScore >= 85
                        ? 'High Accountability'
                        : data.accountabilityScore >= 65
                        ? 'Solid Accountability'
                        : 'Attention Recommended'}
                    </div>
                    <button
                      onClick={() => setShowFormulaModal(true)}
                      className="text-[11px] text-blue-400 hover:underline mt-0.5 flex items-center gap-1"
                    >
                      <Info className="h-3 w-3" />
                      <span>Transparent breakdown</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Score Breakdown Pills */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs text-slate-300">
                <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Completion</div>
                  <div className="font-bold text-white text-sm">
                    {data.scoreBreakdown.taskCompletion.score} / 30
                  </div>
                </div>

                <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">On-Time</div>
                  <div className="font-bold text-white text-sm">
                    {data.scoreBreakdown.onTimeDelivery.score} / 25
                  </div>
                </div>

                <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Reviews</div>
                  <div className="font-bold text-white text-sm">
                    {data.scoreBreakdown.reviewQuality.score} / 20
                  </div>
                </div>

                <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">GitHub Proof</div>
                  <div className="font-bold text-white text-sm">
                    {data.scoreBreakdown.githubEvidence.score} / 15
                  </div>
                </div>

                <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Check-ins</div>
                  <div className="font-bold text-white text-sm">
                    {data.scoreBreakdown.workUpdates.score} / 10
                  </div>
                </div>

                <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Deductions</div>
                  <div className="font-bold text-rose-400 text-sm">
                    -{data.scoreBreakdown.penalties.score} pts
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <Card className="border-slate-800 bg-slate-900/60 p-4 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Assigned Tasks</span>
                <div className="text-2xl font-black text-white">{data.metrics.assignedTasks}</div>
              </Card>

              <Card className="border-slate-800 bg-slate-900/60 p-4 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Completed</span>
                <div className="text-2xl font-black text-emerald-400">
                  {data.metrics.completedTasks}
                </div>
              </Card>

              <Card className="border-slate-800 bg-slate-900/60 p-4 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Overdue</span>
                <div
                  className={`text-2xl font-black ${
                    data.metrics.overdueTasks > 0 ? 'text-rose-400' : 'text-slate-400'
                  }`}
                >
                  {data.metrics.overdueTasks}
                </div>
              </Card>

              <Card className="border-slate-800 bg-slate-900/60 p-4 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">In Review</span>
                <div className="text-2xl font-black text-purple-400">
                  {data.metrics.inReviewTasks}
                </div>
              </Card>

              <Card className="border-slate-800 bg-slate-900/60 p-4 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">GitHub Verified</span>
                <div className="text-2xl font-black text-blue-400">
                  {data.metrics.githubVerificationRate}%
                </div>
              </Card>

              <Card className="border-slate-800 bg-slate-900/60 p-4 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Avg Duration</span>
                <div className="text-2xl font-black text-white">
                  {data.metrics.averageCompletionTimeHours}h
                </div>
              </Card>
            </div>

            {/* 3. Two Column Layout: Work & Reviews on Left, Visual Timeline on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column (2 Cols): Active Work & GitHub Proof & Reviews */}
              <div className="lg:col-span-2 space-y-6">
                {/* Active Work / Current Tasks */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="h-4 w-4 text-blue-400" />
                      <span>Current Work &amp; In-Flight Tasks ({data.currentWork.length})</span>
                    </h3>
                  </div>

                  {data.currentWork.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500">
                      No open tasks currently assigned.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-800/60">
                      {data.currentWork.map((t) => (
                        <div key={t.id} className="py-3 flex items-start justify-between gap-4">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-white truncate">
                                {t.title}
                              </span>
                              <Badge variant="outline" size="sm">
                                {t.status}
                              </Badge>
                            </div>
                            {t.dueDate && (
                              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Due: {new Date(t.dueDate).toLocaleDateString()}</span>
                              </div>
                            )}
                            {t.lastWorkUpdate && (
                              <p className="text-[11px] text-slate-300 italic truncate max-w-lg">
                                Latest update: &ldquo;{t.lastWorkUpdate.content}&rdquo;
                              </p>
                            )}
                          </div>
                          <Badge
                            variant={
                              String(t.evidenceStatus) === 'VERIFIED' || t.evidenceStatus === 'Verified'
                                ? 'success'
                                : String(t.evidenceStatus) === 'CHANGES_REQUESTED' || t.evidenceStatus === 'Changes Requested'
                                ? 'destructive'
                                : 'default'
                            }
                            size="sm"
                          >
                            {t.evidenceStatus}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* GitHub Evidence Contributions */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <GitPullRequest className="h-4 w-4 text-purple-400" />
                      <span>GitHub Proof Contributions ({data.githubContributions.length})</span>
                    </h3>
                    <span className="text-xs text-purple-400 font-medium">
                      {data.metrics.githubVerified} verified of {data.metrics.githubSubmitted} submitted
                    </span>
                  </div>

                  {data.githubContributions.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500">
                      No GitHub pull requests or commits submitted yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-800/60">
                      {data.githubContributions.map((gh) => (
                        <div key={gh.id} className="py-3 flex items-start justify-between gap-4">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {gh.prUrl ? (
                                <GitPullRequest className="h-4 w-4 text-purple-400 shrink-0" />
                              ) : (
                                <GitCommit className="h-4 w-4 text-blue-400 shrink-0" />
                              )}
                              <span className="text-xs font-semibold text-white truncate">
                                {gh.prTitle || gh.commitMessage || gh.repoName}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2">
                              <span>Repo: {gh.repoName}</span>
                              {gh.branch && <span>Branch: {gh.branch}</span>}
                              {gh.additions !== null && gh.additions !== undefined && (
                                <span className="text-emerald-400">+{gh.additions}</span>
                              )}
                              {gh.deletions !== null && gh.deletions !== undefined && (
                                <span className="text-rose-400">-{gh.deletions}</span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500">Task: {gh.taskTitle}</div>
                          </div>

                          <Badge
                            variant={
                              gh.verificationStatus === 'VERIFIED'
                                ? 'success'
                                : gh.verificationStatus === 'VERIFICATION_FAILED'
                                ? 'destructive'
                                : 'default'
                            }
                            size="sm"
                          >
                            {gh.verificationStatus}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Review History */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-indigo-400" />
                      <span>Review History &amp; Quality Signoffs ({data.reviewHistory.length})</span>
                    </h3>
                  </div>

                  {data.reviewHistory.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500">
                      No review decisions recorded.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-800/60">
                      {data.reviewHistory.map((r) => (
                        <div key={r.id} className="py-3 flex items-start justify-between gap-4">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-white">
                                {r.taskTitle}
                              </span>
                              <Badge
                                variant={r.decision === 'APPROVED' ? 'success' : 'warning'}
                                size="sm"
                              >
                                {r.decision}
                              </Badge>
                            </div>
                            {r.comment && (
                              <p className="text-[11px] text-slate-300 italic">
                                &ldquo;{r.comment}&rdquo;
                              </p>
                            )}
                            <div className="text-[10px] text-slate-500">
                              Reviewed by {r.reviewer.name} &bull; {new Date(r.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column (1 Col): Vertical Work Timeline */}
              <div className="space-y-6">
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Actual Work History</h3>
                    <Badge variant="outline" size="sm">
                      PostgreSQL Activity
                    </Badge>
                  </div>

                  {data.timeline.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500">
                      No activity events recorded yet.
                    </div>
                  ) : (
                    <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                      {data.timeline.map((event, idx) => (
                        <div key={event.id || idx} className="relative space-y-1">
                          <span className="absolute -left-[1.65rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-blue-500" />
                          <div className="text-xs font-medium text-white leading-tight">
                            <span className="text-slate-400">{event.action}</span>{' '}
                            <span className="font-semibold text-blue-400">{event.target}</span>
                          </div>
                          {event.projectName && (
                            <div className="text-[10px] text-slate-500">
                              Project: {event.projectName}
                            </div>
                          )}
                          <div className="text-[10px] text-slate-500">
                            {new Date(event.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
              Scorecard Transparency &amp; Calculation Rules
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Detailed breakdown of how this engineer's accountability score is computed.
            </DialogDescription>
          </DialogHeader>

          {data && (
            <div className="space-y-3 text-xs text-slate-300 py-2">
              <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 space-y-1">
                <div className="flex justify-between font-semibold text-white">
                  <span>Task Completion</span>
                  <span className="text-blue-400">
                    {data.scoreBreakdown.taskCompletion.score} / 30 pts
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {data.scoreBreakdown.taskCompletion.explanation}
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 space-y-1">
                <div className="flex justify-between font-semibold text-white">
                  <span>On-Time Delivery</span>
                  <span className="text-blue-400">
                    {data.scoreBreakdown.onTimeDelivery.score} / 25 pts
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {data.scoreBreakdown.onTimeDelivery.explanation}
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 space-y-1">
                <div className="flex justify-between font-semibold text-white">
                  <span>Review Quality</span>
                  <span className="text-blue-400">
                    {data.scoreBreakdown.reviewQuality.score} / 20 pts
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {data.scoreBreakdown.reviewQuality.explanation}
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 space-y-1">
                <div className="flex justify-between font-semibold text-white">
                  <span>GitHub Evidence Verification</span>
                  <span className="text-blue-400">
                    {data.scoreBreakdown.githubEvidence.score} / 15 pts
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {data.scoreBreakdown.githubEvidence.explanation}
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 space-y-1">
                <div className="flex justify-between font-semibold text-white">
                  <span>Check-ins &amp; Consistency</span>
                  <span className="text-blue-400">
                    {data.scoreBreakdown.workUpdates.score} / 10 pts
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {data.scoreBreakdown.workUpdates.explanation}
                </p>
              </div>

              <div className="rounded-lg border border-rose-500/20 bg-rose-950/20 p-3 space-y-1">
                <div className="flex justify-between font-semibold text-rose-300">
                  <span>Penalties &amp; Deductions</span>
                  <span className="text-rose-400">
                    -{data.scoreBreakdown.penalties.score} pts
                  </span>
                </div>
                <p className="text-rose-300/80 text-[11px]">
                  {data.scoreBreakdown.penalties.explanation}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
