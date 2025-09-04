# Brainstorming

This file is used to document your thoughts, approaches and research conducted across all tasks in the Technical Assessment.

## Firmware

## Spyder
So what i figured is often invalid strings go into the client..

1. To prevent invalid data from being sent:
    parse the data in json. Make sure only valid numbers are being sent and not invalid strings. Invalid valjues are skipped entirely and printed in console just as a safety mesh.
2. To get safe operating temperature:
    Create out of range threshold and set as 3. Append the timestamps to array and if this array length is greater than 3, print in console.
3. Connect/Disconnect button:
    Its not being updated based on actual connection status. The state is just set as 1 and doesnt change backend/server disconnects or reconnects automatically.
    solution: In front end code, listen to events such as onopen, onclose, onerror and store in usestate. Update UI.
4. Front end:
    First I made sure the temperature is being displayed upto 3 decimal places by modifying numeric.tsx 

    Added a function to select color based on the temperature in numeric.jsx. This function dynamically sets the css value based on the temperature value.
5. Data-wrapper.tsx:
    First created data-wrapper.tsx under custom. Then moved all websocket logic from page.tsx into this and created a react context that wraps numeric.tsx and any other that displays data. In the page.tsx, I removed all useWebSocket/useState/useEffect for temperature/connectionStatus.


## Cloud