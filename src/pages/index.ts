import Dashboard from './Dashboard'
import DailySchedule from './DailySchedule'
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

const pages = [
  { path: '/', label: 'Dashboard', component: Dashboard },
  { path: '/daily', label: 'Daily Schedule', component: DailySchedule },
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
]

export default pages
