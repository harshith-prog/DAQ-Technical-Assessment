import net from "net";
import { WebSocket, WebSocketServer } from "ws";

const OUT_OF_RANGE_LOG_WINDOW = 5000; 
const OUT_OF_RANGE_THRESHOLD = 3;
let outOfRangeTimestamps: number[] = [];

interface VehicleData {
  battery_temperature: number | string;
  timestamp: number;
}

const TCP_PORT = 12000;
const WS_PORT = 8080;
const tcpServer = net.createServer();
const websocketServer = new WebSocketServer({ port: WS_PORT });

tcpServer.on("connection", (socket) => {
  console.log("TCP client connected");

  socket.on("data", (msg) => {
    const message: string = msg.toString();

    console.log(`Received: ${message}`);

    let parsed: VehicleData;
    try {
      parsed = JSON.parse(message);
    } catch (e) {
      console.warn("Received invalid JSON, skipping:", message);
      return;
    }

    const temp = parsed.battery_temperature;
    const isValid =
      typeof temp === "number" &&
      !isNaN(temp) &&
      temp !== null &&
      temp !== undefined;

    if (isValid) {
      const now = Date.now();
      if (temp < 20 || temp > 80) {
        outOfRangeTimestamps.push(now);
        outOfRangeTimestamps = outOfRangeTimestamps.filter(
          (ts) => now - ts <= OUT_OF_RANGE_LOG_WINDOW
        );
        if (outOfRangeTimestamps.length > OUT_OF_RANGE_THRESHOLD) {
          console.error(
            `[${new Date(now).toISOString()}] WARNING: Battery temperature out of range more than ${OUT_OF_RANGE_THRESHOLD} times in last 5s!`
          );
        }
      }

      websocketServer.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsed));
        }
      });
    } else {
      console.warn("Invalid battery_temperature value, skipping:", temp);
    }
  });

  socket.on("end", () => {
    console.log("Closing connection with the TCP client");
  });

  socket.on("error", (err) => {
    console.log("TCP client error: ", err);
  });
});

websocketServer.on("listening", () =>
  console.log(`Websocket server started on port ${WS_PORT}`)
);

websocketServer.on("connection", async (ws: WebSocket) => {
  console.log("Frontend websocket client connected");
  ws.on("error", console.error);
});

tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP server listening on port ${TCP_PORT}`);
});
