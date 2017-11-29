// Use this import syntax to avoid TS error
import AddAlertIcon = require('react-icons/lib/md/add-alert');
import AddCircleOutlineIcon = require('react-icons/lib/md/add-circle-outline');
import CloseIcon = require('react-icons/lib/md/close');
import EventIcon = require('react-icons/lib/md/event');
import ExpandArrowIcon = require('react-icons/lib/md/keyboard-arrow-down');
import MoreVertIcon = require('react-icons/lib/md/more-vert');
import PhoneIcon = require('react-icons/lib/md/phone');

// Add other components as needed from here, preserving name used in material icon
// Then add icon name to icon-types file to ensure only accepted icon names passed as icon props
const components = {
  addAlert: AddAlertIcon,
  addCircleOutline: AddCircleOutlineIcon,
  close: CloseIcon,
  event: EventIcon,
  moreVert: MoreVertIcon,
  expandArrow: ExpandArrowIcon,
  phone: PhoneIcon,
};

export default components;
