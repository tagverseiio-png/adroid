import React from 'react';

const AdroitLogo = ({ width = 400, height = 150, textColor = "#111111", className = "" }) => {
  const cx = 200;
  const cy = 50;
  const r = 35;

  // Tilted Pentagon angles: Top-Right (18), Right (90), Bottom-Right (162), Bottom-Left (234), Top-Left (306)
  const angles = [18, 90, 162, 234, 306];
  const pts = angles.map(a => {
    const rad = (a - 90) * (Math.PI / 180);
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  });

  const innerR1 = r * 0.33;
  const ptsInner1 = angles.map(a => {
    const rad = (a - 90) * (Math.PI / 180);
    return { x: cx + innerR1 * Math.cos(rad), y: cy + innerR1 * Math.sin(rad) };
  });

  const innerR2 = r * 0.66;
  const ptsInner2 = angles.map(a => {
    const rad = (a - 90) * (Math.PI / 180);
    return { x: cx + innerR2 * Math.cos(rad), y: cy + innerR2 * Math.sin(rad) };
  });

  // Calculate arrow heads
  const arrowSize = 4;
  const arrows = angles.map(a => {
    const rad = (a - 90) * (Math.PI / 180);
    const tipX = cx + (r + arrowSize) * Math.cos(rad);
    const tipY = cy + (r + arrowSize) * Math.sin(rad);

    const leftRad = rad - Math.PI * 0.75;
    const rightRad = rad + Math.PI * 0.75;
    const lX = tipX + arrowSize * 1.5 * Math.cos(leftRad);
    const lY = tipY + arrowSize * 1.5 * Math.sin(leftRad);
    const rX = tipX + arrowSize * 1.5 * Math.cos(rightRad);
    const rY = tipY + arrowSize * 1.5 * Math.sin(rightRad);

    return `${tipX},${tipY} ${lX},${lY} ${rX},${rY}`;
  });

  return (
    <svg viewBox="0 0 400 150" width={width} height={height} className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Michroma&display=swap');`}
        </style>
      </defs>
      <g>
        {/* Green Triangle segment - between Bottom-Right (162deg, index 2) and Bottom-Left (234deg, index 3) */}
        <polygon points={`${cx},${cy} ${pts[2].x},${pts[2].y} ${pts[3].x},${pts[3].y}`} fill="#7ac142" />

        {/* Concentric pentagons */}
        <polygon points={ptsInner1.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#666" strokeWidth="0.75" />
        <polygon points={ptsInner2.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#666" strokeWidth="0.75" />
        <polygon points={pts.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#666" strokeWidth="0.75" />

        {/* Spokes */}
        {pts.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#666" strokeWidth="0.75" />
        ))}

        {/* Arrows at the end of spokes */}
        {arrows.map((points, i) => (
          <polygon key={i} points={points} fill="#999" />
        ))}

        {/* Orange Center */}
        <circle cx={cx} cy={cy} r="5" fill="#f58220" />
      </g>

      {/* Text with wide styling to match the logo */}
      <g transform="translate(200, 125)">
        <text
          x="0"
          y="0"
          fontFamily="'Michroma', sans-serif"
          fontSize="40"
          fontWeight="600"
          fill={textColor}
          stroke={textColor}
          strokeWidth="1"
          letterSpacing="8"
          textAnchor="middle"
        >
          ADROIT
        </text>
      </g>
    </svg>
  );
};

export default AdroitLogo;
