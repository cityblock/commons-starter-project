// Use this import syntax to avoid TS error
import AddAlertIcon = require('react-icons/lib/md/add-alert');
import AddCircleIcon = require('react-icons/lib/md/add-circle');
import AddCircleOutlineIcon = require('react-icons/lib/md/add-circle-outline');
import CloseIcon = require('react-icons/lib/md/close');
import DeleteIcon = require('react-icons/lib/md/delete');
import ErrorOutlineIcon = require('react-icons/lib/md/error-outline');
import EventIcon = require('react-icons/lib/md/event');
import ExpandLessIcon = require('react-icons/lib/md/expand-less');
import ExpandMoreIcon = require('react-icons/lib/md/expand-more');
import HighlightOffIcon = require('react-icons/lib/md/highlight-off');
import ExpandArrowIcon = require('react-icons/lib/md/keyboard-arrow-down');
import MoreVertIcon = require('react-icons/lib/md/more-vert');
import PhoneIcon = require('react-icons/lib/md/phone');
import SearchIcon = require('react-icons/lib/md/search');

// Add other components as needed from here, preserving name used in material icon
// Then add icon name to icon-types file to ensure only accepted icon names passed as icon props
const components = {
  addAlert: AddAlertIcon,
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
  moreVert: MoreVertIcon,
  phone: PhoneIcon,
  search: SearchIcon,
};

export default components;
