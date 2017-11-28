// Use this import syntax to avoid TS error
import AddAlertIcon = require('react-icons/lib/md/add-alert');
import AddCircleOutlineIcon = require('react-icons/lib/md/add-circle-outline');
import EventIcon = require('react-icons/lib/md/event');
import MoreVertIcon = require('react-icons/lib/md/more-vert');

// Add other components as needed from here, preserving name used in material icon
// Then add icon name to icon-types file to ensure only accepted icon names passed as icon props
const components = {
  addAlert: AddAlertIcon,
  addCircleOutline: AddCircleOutlineIcon,
  event: EventIcon,
  moreVert: MoreVertIcon,
};

export default components;
