// Use this import syntax to avoid TS error
import AddAlertIcon from 'material-ui-icons/AddAlert';
import AddBoxIcon from 'material-ui-icons/AddBox';
import AddCircleIcon from 'material-ui-icons/AddCircle';
import AddCircleOutlineIcon from 'material-ui-icons/AddCircleOutline';
import CloseIcon from 'material-ui-icons/Close';
import DeleteIcon from 'material-ui-icons/Delete';
import ErrorOutlineIcon from 'material-ui-icons/ErrorOutline';
import EventIcon from 'material-ui-icons/Event';
import ExpandLessIcon from 'material-ui-icons/ExpandLess';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import HighlightOffIcon from 'material-ui-icons/HighlightOff';
import HomeIcon from 'material-ui-icons/Home';
import ExpandArrowIcon from 'material-ui-icons/KeyboardArrowDown';
import KeyboardArrowLeftIcon from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import PauseCircleOutlineIcon from 'material-ui-icons/PauseCircleOutline';
import PhoneIcon from 'material-ui-icons/Phone';
import SearchIcon from 'material-ui-icons/Search';

// Add other components as needed from here, preserving name used in material icon
// Then add icon name to icon-types file to ensure only accepted icon names passed as icon props
const components = {
  addAlert: AddAlertIcon,
  addBox: AddBoxIcon,
  addCircle: AddCircleIcon,
  addCircleOutline: AddCircleOutlineIcon,
  close: CloseIcon,
  delete: DeleteIcon,
  errorOutline: ErrorOutlineIcon,
  event: EventIcon,
  expandArrow: ExpandArrowIcon,
  expandLess: ExpandLessIcon,
  expandMore: ExpandMoreIcon,
  highlightOff: HighlightOffIcon,
  home: HomeIcon,
  keyboardArrowLeft: KeyboardArrowLeftIcon,
  keyboardArrowRight: KeyboardArrowRightIcon,
  moreVert: MoreVertIcon,
  pauseCircleOutline: PauseCircleOutlineIcon,
  phone: PhoneIcon,
  search: SearchIcon,
};

export default components;
