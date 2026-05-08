export const HIERARCHY_LEVELS = ['country', 'region', 'state', 'territory', 'rm', 'asm', 'salesperson'];

export const DEFAULT_COUNTRY = 'India';

export const REGIONS = ['North', 'South', 'East', 'West', 'Central'];

export const STATES_BY_REGION = {
  North: ['Delhi', 'Punjab', 'Haryana', 'Uttar Pradesh'],
  South: ['Karnataka', 'Tamil Nadu', 'Telangana', 'Kerala'],
  East: ['West Bengal', 'Odisha', 'Bihar'],
  West: ['Maharashtra', 'Gujarat', 'Rajasthan'],
  Central: ['Madhya Pradesh', 'Chhattisgarh'],
};

export const TERRITORIES_BY_STATE = {
  Delhi: ['Delhi NCR'],
  Punjab: ['Punjab North', 'Punjab South'],
  Haryana: ['Gurugram', 'Faridabad'],
  'Uttar Pradesh': ['Noida', 'Lucknow'],
  Karnataka: ['Bengaluru', 'Mysuru'],
  'Tamil Nadu': ['Chennai', 'Coimbatore'],
  Telangana: ['Hyderabad'],
  Kerala: ['Kochi'],
  'West Bengal': ['Kolkata'],
  Odisha: ['Bhubaneswar'],
  Bihar: ['Patna'],
  Maharashtra: ['Mumbai', 'Pune'],
  Gujarat: ['Ahmedabad', 'Surat'],
  Rajasthan: ['Jaipur'],
  'Madhya Pradesh': ['Indore', 'Bhopal'],
  Chhattisgarh: ['Raipur'],
};

export const HIERARCHY_FILTER_FIELDS = [
  { id: 'region', label: 'Region' },
  { id: 'state', label: 'State' },
  { id: 'territory', label: 'Territory' },
  { id: 'rm', label: 'RM' },
  { id: 'asm', label: 'ASM' },
  { id: 'salesperson', label: 'Salesperson' },
];

export const RM_OPTIONS = ['Amit Sharma', 'Neha Iyer', 'Vikram Singh', 'Priya Nair'];
export const ASM_OPTIONS = ['Rahul Verma', 'Sneha Rao', 'Karan Mehta', 'Anita Das'];
export const SALESPERSON_OPTIONS = ['Rahul Verma', 'Sneha Rao', 'Karan Mehta', 'Anita Das', 'Manish Jain'];

export const getStatesForRegion = (region) => (region && region !== 'All' ? STATES_BY_REGION[region] || [] : Object.values(STATES_BY_REGION).flat());
export const getTerritoriesForState = (state) => (state && state !== 'All' ? TERRITORIES_BY_STATE[state] || [] : Object.values(TERRITORIES_BY_STATE).flat());

export const buildHierarchyMetadata = (record = {}) => ({
  country: record.country || DEFAULT_COUNTRY,
  region: record.region || record.zone || 'North',
  state: record.state || 'Delhi',
  territory: record.territory || 'Delhi NCR',
  rm: record.rm || 'Amit Sharma',
  asm: record.asm || record.salesperson || 'Rahul Verma',
  salesperson: record.salesperson || '',
});
