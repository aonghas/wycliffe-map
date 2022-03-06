import { Home, Business, School, People } from '@vicons/ionicons5';
import { VolunteerActivismRound } from '@vicons/material';
import { Sport16Filled } from '@vicons/fluent';

import { MapMarkerAlt } from '@vicons/fa';

export const featureTypes = {
  Home: {
    name: 'Home',
    plural: 'Homes',
    icon: Home,
    color: '#F9A825',
  },
  Work: {
    name: 'Work',
    plural: 'Workplaces',
    icon: Business,
    color: '#689F38',
  },
  School: {
    name: 'School',
    plural: 'Schools',
    icon: School,
    color: '#388E3C',
  },
  Sport: {
    name: 'Sport',
    icon: Sport16Filled,
    plural: 'Sport',
    color: '#0277BD',
  },
  Volunteering: {
    name: 'Volunteering',
    icon: VolunteerActivismRound,
    plural: 'Volunteering',
    color: '#FF5722',
  },
  Social: {
    name: 'Social',
    plural: 'Social',
    icon: People,
    color: '#FF4081',
  },
  Other: {
    name: 'Other',
    plural: 'Other',
    icon: MapMarkerAlt,
    color: '#333333',
  },
};
