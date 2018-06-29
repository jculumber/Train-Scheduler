# Train-Scheduler

## Overview
This is a train schedule application that incorporates Firebase to host arrival and departure data. The app retrieves and manipulates the information with Moment.js. The website provides up-to-date information about various trains, namely their arrival times and how many minutes remain until they arrive at their station.

When adding trains, users are able to submit the following:

- Train Name

- Destination

- First Train Time -- in military time

- Frequency -- in minutes

The app uses this information to calculate when the next train will arrive and the minutes away from arrival; this is in relation to the current time.