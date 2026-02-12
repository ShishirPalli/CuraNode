import React from 'react';

const Loader = ({ fullPage = false, text = 'Loading...', type = 'spinner' }) => {
  if (fullPage) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999,
        backdropFilter: 'blur(2px)',
      }}>
        <div style={{ textAlign: 'center' }}>
          {type === 'spinner' && (
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid var(--gray-200)',
              borderTop: '4px solid var(--primary-teal)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}></div>
          )}
          {type === 'pulse' && (
            <div style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-teal)',
                    animation: `pulse 1.4s infinite ease-in-out ${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          )}
          <p style={{
            margin: '0',
            color: 'var(--gray-600)',
            fontSize: '14px',
            fontWeight: '500',
          }}>
            {text}
          </p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 60%, 100% { opacity: 0.3; }
            30% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      gap: '16px',
    }}>
      {type === 'spinner' && (
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--gray-200)',
          borderTop: '3px solid var(--primary-teal)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}></div>
      )}
      {type === 'pulse' && (
        <div style={{
          display: 'flex',
          gap: '6px',
        }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-teal)',
                animation: `pulse 1.4s infinite ease-in-out ${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}
      {text && (
        <p style={{
          margin: '0',
          color: 'var(--gray-600)',
          fontSize: '13px',
        }}>
          {text}
        </p>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 60%, 100% { opacity: 0.3; }
          30% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Loader;
