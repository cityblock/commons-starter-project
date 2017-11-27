// Use this import syntax to avoid TS error
import EventIcon = require('react-icons/lib/md/event');

// Add other components as needed from here, preserving name used in material icon
// Then add icon name to icon-types file to ensure only accepted icon names passed as icon props
const components = {
  event: EventIcon,
};

export default components;
