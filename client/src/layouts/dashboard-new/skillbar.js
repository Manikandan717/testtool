import React from 'react';

const SkillBar = ({ percentage }) => {
  // Check if percentage is defined before using it
  if (percentage === undefined || percentage === null) {
    // Return null or an error message, depending on your requirements
    return null; // or return an error message
  }

  // Log the value of percentage
  // console.log('Percentage:', percentage);

  // Format the percentage to two decimal places
  const formattedPercentage = percentage.toFixed(2);

  // Calculate the width of the progress bar based on the percentage
  const barWidth = `${formattedPercentage}%`;

  // Customize the color of the bar based on the percentage
  let barColor;
  if (percentage >= 80) {
    barColor = 'green';
  } else if (percentage >= 50) {
    barColor = 'orange';
  } else {
    barColor = 'red';
  }

  return (
    <div style={{ width: '100%', backgroundColor: '#f0f0f0', borderRadius: '5px', padding: '0px', whiteSpace: 'nowrap' }}>
    <div
      style={{
        width: barWidth,
        backgroundColor: barColor,
        borderRadius: '5px',
        padding: '0px',
        fontSize: '10px',
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
      }}
    >
      {formattedPercentage}%
    </div>
  </div>
  );
};

export default SkillBar;
