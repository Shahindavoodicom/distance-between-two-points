const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Objects with initial coordinates
const object_one = { x: 100, y: 200 };
const object_two = { x: 400, y: 300 };

const SNAP_THRESHOLD = 20; // Threshold for snapping points

let dragging = false;
let dragPoint = null;

let snappingActive = false; // Variable to track snapping state

// Function to calculate the distance between two points
function distance(object_one, object_two) {
  const a = Math.pow(object_two.x - object_one.x, 2);
  const b = Math.pow(object_two.y - object_one.y, 2);
  const c = Math.sqrt(a + b);
  return c;
}

// Draw a point on the canvas
function drawPoint(x, y, color = "red") {
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

// Draw a line between two points
function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
}

// Draw the distance text above the line
function drawDistanceText(text, x, y) {
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(text, x, y);
}

// Draw coordinates of each point at the bottom left of the canvas
function drawCoordinates() {
  ctx.font = "14px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(
    `Object One (x, y): (${object_one.x}, ${object_one.y})`,
    10,
    canvas.height - 30
  );
  ctx.fillText(
    `Object Two (x, y): (${object_two.x}, ${object_two.y})`,
    10,
    canvas.height - 10
  );
}

// Clear and redraw everything on the canvas
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the two points
  drawPoint(object_one.x, object_one.y, "red");
  drawPoint(object_two.x, object_two.y, "green");

  // Draw the line between the points
  drawLine(object_one.x, object_one.y, object_two.x, object_two.y);

  // Calculate the midpoint for the distance text
  const midX = (object_one.x + object_two.x) / 2;
  const midY = (object_one.y + object_two.y) / 2;

  // Calculate and draw the distance
  const distanceValue = distance(object_one, object_two);
  drawDistanceText(`Distance: ${distanceValue.toFixed(2)}`, midX, midY - 10);

  // Draw the coordinates of each point
  drawCoordinates();

  // Draw the snapping message if active
  if (snappingActive) {
    ctx.font = "16px Arial";
    ctx.fillStyle = "green";
    ctx.fillText("Snapping Activated!", canvas.width - 150, canvas.height - 20);
  }

  // Draw the copyright notice at the center bottom of the canvas
  ctx.font = "14px Arial";
  ctx.fillStyle = "black";
  const copyrightText = "© Shahindavoodi";
  const textWidth = ctx.measureText(copyrightText).width;
  ctx.fillText(
    copyrightText,
    (canvas.width - textWidth) / 2,
    canvas.height - 10
  );
}

// Check if a point is clicked for dragging
function isPointClicked(point, mouseX, mouseY) {
  const dx = point.x - mouseX;
  const dy = point.y - mouseY;
  return Math.sqrt(dx * dx + dy * dy) < 8;
}

// Snapping logic to make a straight line when close
function applySnapIfClose(draggedPoint) {
  const otherPoint = draggedPoint === object_one ? object_two : object_one;
  const xDifference = Math.abs(otherPoint.x - draggedPoint.x);
  const yDifference = Math.abs(otherPoint.y - draggedPoint.y);

  // Check if the difference is within the snap threshold
  if (xDifference <= SNAP_THRESHOLD || yDifference <= SNAP_THRESHOLD) {
    // Snap dragged point's coordinates to the other point's coordinates
    if (xDifference <= SNAP_THRESHOLD) {
      draggedPoint.x = otherPoint.x; // Move dragged point to the other point's x
    }
    if (yDifference <= SNAP_THRESHOLD) {
      draggedPoint.y = otherPoint.y; // Move dragged point to the other point's y
    }

    snappingActive = true; // Set snapping state to true
  } else {
    snappingActive = false; // Set snapping state to false
  }
}

// Mouse event handlers
canvas.addEventListener("mousedown", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Check if we clicked on any of the points
  if (isPointClicked(object_one, mouseX, mouseY)) {
    dragging = true;
    dragPoint = object_one;
  } else if (isPointClicked(object_two, mouseX, mouseY)) {
    dragging = true;
    dragPoint = object_two;
  }
});

canvas.addEventListener("mousemove", (event) => {
  if (dragging && dragPoint) {
    const rect = canvas.getBoundingClientRect();
    dragPoint.x = event.clientX - rect.left;
    dragPoint.y = event.clientY - rect.top;

    // Apply snapping logic for the dragged point
    applySnapIfClose(dragPoint); // Pass the dragged point to the snapping function

    draw(); // Re-draw on movement
  }
});

canvas.addEventListener("mouseup", () => {
  dragging = false;
  dragPoint = null;
});

// Draw the initial setup
draw();
