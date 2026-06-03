// A 24-hour clock suits an ops/server-room readout and stays compact in the dense history table.
// The formatter is built once and reused, rather than per row on every poll.
const time = new Intl.DateTimeFormat([], {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  // h23 pins midnight to 00:xx; hour12:false alone can render 24:xx on some locales.
  hourCycle: 'h23',
});

export const formatTime = (date: Date): string => time.format(date);
