import Dashboard from './Dashboard'
import DailySchedule from './DailySchedule'
import DailyPlanner from './DailyPlanner'
import Antiprocrastination from './Antiprocrastination'
import DysfunctionalThoughts from './DysfunctionalThoughts'
import PleasurePrediction from './PleasurePrediction'
import ButRebuttal from './ButRebuttal'
import SelfEndorsement from './SelfEndorsement'
import TicToc from './TicToc'
import LittleSteps from './LittleSteps'
import MotivationWithoutCoercion from './MotivationWithoutCoercion'
import Disarming from './Disarming'
import VisualizeSuccess from './VisualizeSuccess'
import CountWhatCounts from './CountWhatCounts'
import TestYourCants from './TestYourCants'
import CantLose from './CantLose'
import RiskReward from './RiskReward'
import RiskReward2 from './RiskReward2'
import WellnessRisk from './WellnessRisk'
import ProsCons from './ProsCons'

const pages = [
  { path: '/', label: 'Dashboard', component: Dashboard },
  { path: '/daily', label: 'Daily Schedule', component: DailySchedule },
  { path: '/planner', label: 'Daily Planner', component: DailyPlanner },
  { path: '/antiprocrastination', label: 'Antiprocrastination', component: Antiprocrastination },
  { path: '/dysfunctional', label: 'Dysfunctional Thoughts', component: DysfunctionalThoughts },
  { path: '/pleasure', label: 'Pleasure Prediction', component: PleasurePrediction },
  { path: '/but', label: 'But-Rebuttal', component: ButRebuttal },
  { path: '/self', label: 'Self-Endorsement', component: SelfEndorsement },
  { path: '/tictoc', label: 'Tic Toc', component: TicToc },
  { path: '/little', label: 'Little Steps', component: LittleSteps },
  { path: '/motivation', label: 'Motivation', component: MotivationWithoutCoercion },
  { path: '/disarming', label: 'Disarming', component: Disarming },
  { path: '/visualize', label: 'Visualize Success', component: VisualizeSuccess },
  { path: '/count', label: 'Count What Counts', component: CountWhatCounts },
  { path: '/testcants', label: "Test Your Can'ts", component: TestYourCants },
  { path: '/cantlose', label: "Can't Lose System", component: CantLose },
  { path: '/riskreward', label: 'Risk-Reward Calculation', component: RiskReward },
  { path: '/riskreward2', label: 'Risk-Reward Calculator v2', component: RiskReward2 },
  { path: '/wellnessrisk', label: 'Wellness Risk-Reward', component: WellnessRisk },
  { path: '/proscons', label: 'Pros & Cons Analysis', component: ProsCons },
]

export default pages
