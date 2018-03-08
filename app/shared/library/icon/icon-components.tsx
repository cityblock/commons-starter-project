import { IconName } from './icon-types';

type IconComponents = { [K in IconName]: React.ComponentType<SvgIconProps> };

import AccessAlarmsIcon from 'material-ui-icons/AccessAlarms';
import AccountBoxIcon from 'material-ui-icons/AccountBox';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import AddAlertIcon from 'material-ui-icons/AddAlert';
import AddBoxIcon from 'material-ui-icons/AddBox';
import AddCircleIcon from 'material-ui-icons/AddCircle';
import AddCircleOutlineIcon from 'material-ui-icons/AddCircleOutline';
import AlarmIcon from 'material-ui-icons/Alarm';
import AppsIcon from 'material-ui-icons/Apps';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import AssignmentIndIcon from 'material-ui-icons/AssignmentInd';
import AssignmentTurnedInIcon from 'material-ui-icons/AssignmentTurnedIn';
import CheckIcon from 'material-ui-icons/Check';
import CheckCircleIcon from 'material-ui-icons/CheckCircle';
import CloseIcon from 'material-ui-icons/Close';
import Create from 'material-ui-icons/Create';
import DeleteIcon from 'material-ui-icons/Delete';
import ErrorIcon from 'material-ui-icons/Error';
import ErrorOutlineIcon from 'material-ui-icons/ErrorOutline';
import EventIcon from 'material-ui-icons/Event';
import EventNoteIcon from 'material-ui-icons/EventNote';
import ExpandLessIcon from 'material-ui-icons/ExpandLess';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import FlagIcon from 'material-ui-icons/Flag';
import GestureIcon from 'material-ui-icons/Gesture';
import HighlightOffIcon from 'material-ui-icons/HighlightOff';
import HomeIcon from 'material-ui-icons/Home';
import InboxIcon from 'material-ui-icons/Inbox';
import InfoOutlineIcon from 'material-ui-icons/InfoOutline';
import ExpandArrowIcon from 'material-ui-icons/KeyboardArrowDown';
import KeyboardArrowLeftIcon from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight';
import LabelOutlineIcon from 'material-ui-icons/LabelOutline';
import LockOutlineIcon from 'material-ui-icons/LockOutline';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import NotificationsIcon from 'material-ui-icons/Notifications';
import PauseCircleOutlineIcon from 'material-ui-icons/PauseCircleOutline';
import PeopleIcon from 'material-ui-icons/People';
import PhoneIcon from 'material-ui-icons/Phone';
import PictureAsPDFIcon from 'material-ui-icons/PictureAsPdf';
import PlaylistAddIcon from 'material-ui-icons/PlaylistAdd';
import ReportIcon from 'material-ui-icons/Report';
import RotateRightIcon from 'material-ui-icons/RotateRight';
import SearchIcon from 'material-ui-icons/Search';
import StarsIcon from 'material-ui-icons/Stars';
import SyncProblemIcon from 'material-ui-icons/SyncProblem';
import TextSmsIcon from 'material-ui-icons/Textsms';
import WarningIcon from 'material-ui-icons/Warning';
import { SvgIconProps } from 'material-ui/SvgIcon';

// Add other components as needed from here, preserving name used in material icon
// Then add icon name to icon-types file to ensure only accepted icon names passed as icon props
const components: IconComponents = {
  accessAlarms: AccessAlarmsIcon,
  accountBox: AccountBoxIcon,
  accountCircle: AccountCircleIcon,
  addAlert: AddAlertIcon,
  addBox: AddBoxIcon,
  addCircle: AddCircleIcon,
  addCircleOutline: AddCircleOutlineIcon,
  alarm: AlarmIcon,
  apps: AppsIcon,
  arrowBack: ArrowBackIcon,
  assignmentInd: AssignmentIndIcon,
  assignmentTurnedIn: AssignmentTurnedInIcon,
  check: CheckIcon,
  checkCircle: CheckCircleIcon,
  close: CloseIcon,
  create: Create,
  delete: DeleteIcon,
  error: ErrorIcon,
  errorOutline: ErrorOutlineIcon,
  event: EventIcon,
  eventNote: EventNoteIcon,
  expandArrow: ExpandArrowIcon,
  expandLess: ExpandLessIcon,
  expandMore: ExpandMoreIcon,
  flag: FlagIcon,
  gesture: GestureIcon,
  highlightOff: HighlightOffIcon,
  home: HomeIcon,
  inbox: InboxIcon,
  infoOutline: InfoOutlineIcon,
  keyboardArrowLeft: KeyboardArrowLeftIcon,
  keyboardArrowRight: KeyboardArrowRightIcon,
  labelOutline: LabelOutlineIcon,
  lockOutline: LockOutlineIcon,
  moreVert: MoreVertIcon,
  notifications: NotificationsIcon,
  pauseCircleOutline: PauseCircleOutlineIcon,
  people: PeopleIcon,
  phone: PhoneIcon,
  pictureAsPDF: PictureAsPDFIcon,
  playlistAdd: PlaylistAddIcon,
  report: ReportIcon,
  rotateRight: RotateRightIcon,
  search: SearchIcon,
  stars: StarsIcon,
  syncProblem: SyncProblemIcon,
  textSms: TextSmsIcon,
  warning: WarningIcon,
};

export default components;
