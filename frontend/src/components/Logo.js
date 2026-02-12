import React from 'react';

const Logo = ({ size = 'medium', variant = 'default', showTagline = true }) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { iconSize: 40, titleSize: 16, taglineSize: 11 };
      case 'large':
        return { iconSize: 80, titleSize: 42, taglineSize: 18 };
      default: // medium
        return { iconSize: 60, titleSize: 32, taglineSize: 14 };
    }
  };

  const sizeStyles = getSizeStyles();

  const getColors = () => {
    return {
      teal: '#0d9488',
      navy: '#1e3a5f',
      lightTeal: '#14b8a6',
    };
  };

  const colors = getColors();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      {/* Main Logo with Icon and Text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* CURANODE Icon - Stylized Network Cross */}
        <svg
          width={sizeStyles.iconSize}
          height={sizeStyles.iconSize}
          viewBox="0 0 100 100"
          style={{ minWidth: sizeStyles.iconSize }}
        >
          {/* Center cross network design */}
          
          {/* Top vertical segments */}
          <rect x="38" y="8" width="12" height="16" rx="6" fill={colors.teal} />
          <rect x="38" y="28" width="12" height="14" rx="6" fill={colors.navy} />
          
          {/* Right side segments */}
          <rect x="60" y="38" width="16" height="12" rx="6" fill={colors.navy} />
          <rect x="80" y="38" width="12" height="12" rx="6" fill={colors.teal} />
          
          {/* Bottom vertical segments */}
          <rect x="38" y="58" width="12" height="14" rx="6" fill={colors.teal} />
          <rect x="38" y="76" width="12" height="16" rx="6" fill={colors.navy} />
          
          {/* Left side segments */}
          <rect x="8" y="38" width="12" height="12" rx="6" fill={colors.teal} />
          <rect x="24" y="38" width="16" height="12" rx="6" fill={colors.navy} />
          
          {/* Center circle */}
          <circle cx="50" cy="50" r="8" fill={colors.navy} />
        </svg>

        {/* Text Section */}
        <div style={{ lineHeight: '1.1' }}>
          <div
            style={{
              fontSize: `${sizeStyles.titleSize}px`,
              fontWeight: '800',
              color: colors.navy,
              letterSpacing: '-1px',
              margin: '0',
            }}
          >
            CURANODE
          </div>
          {showTagline && (
            <div
              style={{
                fontSize: `${sizeStyles.taglineSize}px`,
                color: colors.teal,
                fontWeight: '600',
                letterSpacing: '2px',
                margin: '0',
              }}
            >
              WHERE CARE CONNECTS.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logo;
