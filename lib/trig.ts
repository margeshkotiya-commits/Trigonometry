export const SPECIAL_ANGLES_DATA = [
  { deg: 0, rad: '0', sin: '0', cos: '1', tan: '0' },
  { deg: 30, rad: 'π/6', sin: '1/2', cos: '√3/2', tan: '√3/3' },
  { deg: 45, rad: 'π/4', sin: '√2/2', cos: '√2/2', tan: '1' },
  { deg: 60, rad: 'π/3', sin: '√3/2', cos: '1/2', tan: '√3' },
  { deg: 90, rad: 'π/2', sin: '1', cos: '0', tan: 'Undefined' },
  { deg: 120, rad: '2π/3', sin: '√3/2', cos: '-1/2', tan: '-√3' },
  { deg: 135, rad: '3π/4', sin: '√2/2', cos: '-√2/2', tan: '-1' },
  { deg: 150, rad: '5π/6', sin: '1/2', cos: '-√3/2', tan: '-√3/3' },
  { deg: 180, rad: 'π', sin: '0', cos: '-1', tan: '0' },
  { deg: 210, rad: '7π/6', sin: '-1/2', cos: '-√3/2', tan: '√3/3' },
  { deg: 225, rad: '5π/4', sin: '-√2/2', cos: '-√2/2', tan: '1' },
  { deg: 240, rad: '4π/3', sin: '-√3/2', cos: '-1/2', tan: '√3' },
  { deg: 270, rad: '3π/2', sin: '-1', cos: '0', tan: 'Undefined' },
  { deg: 300, rad: '5π/3', sin: '-√3/2', cos: '1/2', tan: '-√3' },
  { deg: 315, rad: '7π/4', sin: '-√2/2', cos: '√2/2', tan: '-1' },
  { deg: 330, rad: '11π/6', sin: '-1/2', cos: '√3/2', tan: '-√3/3' },
  { deg: 360, rad: '2π', sin: '0', cos: '1', tan: '0' },
];

export type Mode = 'explore' | 'practice' | 'concept';
