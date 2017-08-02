export default {

  // Get x and y coordinates for point along a circle
  pointOnCircle(options) {
    let radians = (options.angle / 180) * Math.PI;

    if (options.offsetAngle) {
      radians -= (options.offsetAngle / 180) * Math.PI;
    }

    const x = options.cx + Math.cos(radians) * options.radius;
    const y = options.cy + Math.sin(radians) * options.radius;

    return { x, y };
  },

  // Creates SVG arc string
  arc(attributes) {
    const defaults = {
      xAxisRotation: 0, // Pointless?!
      largeArcFlag: 0, // More than 180 degrees set to true
      sweepFlag: 1, // 1 - Clockwise, 0 - Anticlockwise
      absolute: true,
    };
    const options = Object.assign({}, defaults, attributes);

    // Start arc path
    let arc = options.absolute ? 'A' : 'a';

    // Set radiuds as rx and ry
    arc += `${options.radius},${options.radius} `;

    // Set options
    arc += `${options.xAxisRotation} `;
    arc += `${options.largeArcFlag} ${options.sweepFlag} `;

    // Set destination of arc
    arc += `${options.x},${options.y} `;

    return arc;
  },

  segment(options) {
    // Get total angle of segment
    const totalAngle = options.endAngle - options.startAngle;
    const sweepFlag = options.sweepFlag === undefined ? 1 : options.sweepFlag;
    let drawCaps;
    let start;
    let end;
    let arc;
    let path;

    // Calculate large arc flag option based on total angle
    const largeArcFlag = +(Math.abs(totalAngle) > 180);

    if (totalAngle >= 360) {
      // If total angle of segment is 360 degrees or more, dont drag caps/close
      // path to fix visual errors
      drawCaps = false;

      // Also clamp value to a total of 360
      options.endAngle -= (totalAngle - 360);

      // Minus 0.001 (to display correctly as SVG wont draw 360 degree arcs)
      options.endAngle -= 0.0001;
    } else {
      drawCaps = true;
    }

    // If a stroke width is passed, modify values to make segment
    // full width after stroke
    if (options.strokeWidth) {
      options.radius -= options.strokeWidth / 2;
      options.width += options.strokeWidth;
    }

    // If no width is passed, or just a strokeWidth, only draw one arc
    if (!options.width || options.width === options.strokeWidth) {
      start = this.pointOnCircle({
        cx: options.cx,
        cy: options.cy,
        radius: options.radius,
        angle: options.startAngle,
      });

      end = this.pointOnCircle({
        cx: options.cx,
        cy: options.cy,
        radius: options.radius,
        angle: options.endAngle,
      });

      arc = this.arc({
        x: end.x,
        y: end.y,
        radius: options.radius,
        largeArcFlag,
        sweepFlag,
      });

      // Move to start of path
      path = `M${start.x},${start.y} `;

      // Create curve
      path += arc;
    } else {
      // Calculate start points
      start = {
        inner: this.pointOnCircle({ cx: options.cx, cy: options.cy,
          radius: options.radius - options.width, angle: options.startAngle }),
        outer: this.pointOnCircle({ cx: options.cx, cy: options.cy,
          radius: options.radius, angle: options.startAngle }),
      };

      // Calculate end points
      end = {
        inner: this.pointOnCircle({ cx: options.cx, cy: options.cy,
          radius: options.radius - options.width, angle: options.endAngle }),
        outer: this.pointOnCircle({ cx: options.cx, cy: options.cy,
          radius: options.radius, angle: options.endAngle }),
      };

      // Calculate arcs
      arc = {
        inner: this.arc({ x: start.inner.x, y: start.inner.y,
          radius: options.radius - options.width,
          largeArcFlag, sweepFlag: +!sweepFlag,
        }),
        outer:
          this.arc({ x: end.outer.x, y: end.outer.y, radius: options.radius,
            largeArcFlag, sweepFlag,
        }),
      };

      // Move to start of path
      path = `M ${start.inner.x},${start.inner.y} `;

      // Draw start cap line (if drawing caps)
      if (drawCaps) {
        path += `L${start.outer.x},${start.outer.y} `;
      } else {
        path += `M${start.outer.x},${start.outer.y} `;
      }

      // Create outer curve
      path += `${arc.outer} `;

      // Draw end cap line (if drawing caps)
      if (drawCaps) {
        path += `L${end.inner.x},${end.inner.y} `;
      } else {
        path += `M${end.inner.x},${end.inner.y} `;
      }

      // Create inner curve
      path += `${arc.inner} z`;
    }

    return path;
  },

};
