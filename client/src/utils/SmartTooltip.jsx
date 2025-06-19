import { useState, useRef, useEffect } from 'react';

const SmartTooltip = ({ content, children, maxWidth = 300, delay = 300 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, placement: 'top' });
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);

  const calculatePosition = () => {
    if (!tooltipRef.current || !triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    const spacing = 8;
    let x = 0;
    let y = 0;
    let placement = 'top';

    // Calculate space in all directions
    const spaceAbove = triggerRect.top;
    const spaceBelow = viewport.height - triggerRect.bottom;
    const spaceLeft = triggerRect.left;
    const spaceRight = viewport.width - triggerRect.right;

    // Determine vertical placement
    if (spaceAbove >= tooltipRect.height + spacing && spaceAbove >= spaceBelow) {
      placement = 'top';
      y = triggerRect.top - tooltipRect.height - spacing;
    } else if (spaceBelow >= tooltipRect.height + spacing) {
      placement = 'bottom';
      y = triggerRect.bottom + spacing;
    } else {
      // Default to top if neither has enough space
      placement = spaceAbove > spaceBelow ? 'top' : 'bottom';
      y = placement === 'top'
        ? triggerRect.top - tooltipRect.height - spacing
        : triggerRect.bottom + spacing;
    }

    // Calculate horizontal centering
    const triggerCenter = triggerRect.left + triggerRect.width / 2;
    x = triggerCenter - tooltipRect.width / 2;

    // Adjust if tooltip would overflow viewport
    const padding = 16;
    if (x < padding) {
      x = padding;
    } else if (x + tooltipRect.width > viewport.width - padding) {
      x = viewport.width - tooltipRect.width - padding;
    }

    setPosition({ x, y, placement });
  };

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Recalculate position after showing
      requestAnimationFrame(calculatePosition);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();

      const handleScroll = () => calculatePosition();
      const handleResize = () => calculatePosition();

      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isVisible]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Don't render if no content
  if (!content || content.trim() === '') {
    return children;
  }

  const getArrowPosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return { left: '50%' };

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const triggerCenter = triggerRect.left + triggerRect.width / 2;
    const tooltipLeft = position.x;
    const arrowLeft = Math.max(12, Math.min(triggerCenter - tooltipLeft, maxWidth - 12));

    return { left: `${arrowLeft}px` };
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            maxWidth: `${maxWidth}px`,
            zIndex: 9999
          }}
          className={`
            transform transition-all duration-200 ease-out
            ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
        >
          <div className="relative">
            {/* Tooltip content */}
            <div className="bg-gray-900 text-white text-sm rounded-lg shadow-xl px-3 py-2 min-w-[200px]">
              <div className="max-h-40 overflow-y-auto break-words whitespace-normal leading-relaxed">
                {content}
              </div>
            </div>

            {/* Arrow */}
            <div
              style={getArrowPosition()}
              className={`
                absolute w-2 h-2 bg-gray-900 transform rotate-45
                ${position.placement === 'top'
                  ? 'top-full -mt-1'
                  : 'bottom-full -mb-1'
                }
              `}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SmartTooltip;