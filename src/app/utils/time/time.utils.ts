/**
 * converti un timecode en secondes
 * exemple '0:01:50.350' => 110.350 (number)
 * @param timeCode format {h}:{min}:{sec}.{ms}
 */
export function timeCodeToSeconde(timeCode: string): number {
  if (!timeCode) {
    return 0;
  }

  const splittedTime = timeCode.split(':');
  if (splittedTime.length > 3 || splittedTime.length < 1 || splittedTime.find(v => isNaN(parseFloat(v)))) {
    console.error(`le time code ${timeCode} est mal formaté`);
    return null;
  }

  let timeInSec;
  if (splittedTime.length === 1) {
    timeInSec = +splittedTime[0];
  } else if (splittedTime.length === 2) {
    const [min, sec] = splittedTime;
    timeInSec = +min * 60 + +sec;
  } else if (splittedTime.length === 3) {
    const [hour, min, sec] = splittedTime;
    timeInSec = +hour * 3600 + +min * 60 + +sec;
  }

  return timeInSec;
}

export function secondToTimeCode(seconds: number): string {
  if (!seconds && seconds !== 0) {
    return undefined;
  }
  return formatDuration(seconds, '{h}:{min}:{sec}.{ms}');
}

export function formatTimeCode(timeCode: string, format: string): string {
  return formatDuration(timeCodeToSeconde(timeCode), format);
}

/**
 * format example : '{h}:{min}:{sec}.{ms}', '{min}:{sec}', 'Début dans {min} minute(s) et {sec} seconde(s)'
 * any text between {} must be 'h', 'min', 'sec' or 'ms'
 * any characters outside of {} will be reuse as is
 * and will be replaced by corresponding value
 * 400.25 sec + format '{min}' => '6'
 * 400.25 sec + format '{min}:{sec}' => '6:20'
 * 400.25 sec + format '{sec}:{ms}' => '400.25'
 * 4000.25 sec + format '{h}:{min}:{sec}:{ms}' => '1:06:20.25'
 */
// todo nice to have make field optional with '?'
export function formatDuration(seconds: number, format: string): string {
  if (!format) {
    console.error('See JSDoc for format !');
    return '';
  } else if (!seconds && seconds !== 0) {
    return '';
  }

  if (format.indexOf('{h}') !== -1) {
    const hour = Math.floor(seconds / 3600);
    seconds = seconds - hour * 3600;
    format = format.replace('{h}', hour.toString().padStart(1, '0'));
  }
  if (format.indexOf('{min}') !== -1) {
    const min = Math.floor(seconds / 60);
    seconds = seconds - min * 60;
    const charBefore = format[format.indexOf('{min}') - 1];
    const padStartLength = charBefore === undefined ? 1 : 2;
    format = format.replace('{min}', min.toString().padStart(padStartLength, '0'));
  }
  if (format.indexOf('{sec}') !== -1) {
    const sec = Math.floor(seconds);
    seconds = seconds - sec;
    const charBefore = format[format.indexOf('{sec}') - 1];
    const padStartLength = charBefore === undefined ? 1 : 2;
    format = format.replace('{sec}', sec.toString().padStart(padStartLength, '0'));
  }
  if (format.indexOf('{ms}') !== -1) {
    const ms = Math.floor(seconds * 1000);
    const charBefore = format[format.indexOf('{ms}') - 1];
    const padStartLength = charBefore === undefined ? 1 : 3;
    format = format.replace('{ms}', ms.toString().padStart(padStartLength, '0'));
  }

  return format;
}

export function decomposeDateAndTime(dateTimeStamp: string): { time: string; date: Date } {
  if (!dateTimeStamp) {
    return null;
  }
  const date = new Date(dateTimeStamp);

  // time
  // seconds and milliseconds are irrelevant
  const strHours = date
    .getHours()
    .toString()
    .padStart(2, '0');
  const strMinutes = date
    .getMinutes()
    .toString()
    .padStart(2, '0');

  date.setHours(0);
  date.setMinutes(0);
  return { date, time: `${strHours}:${strMinutes}:00.000` };
}

export function getDateAndTime(dateISO: string, time: string /* timeCode ex: 00:00:00.000 */): string {
  if (!dateISO) {
    return null;
  }

  const dateWithTimeZone = new Date(dateISO);
  const msTimeZoneOffset = dateWithTimeZone.getTimezoneOffset() * 60 * 1000;
  const msTime = timeCodeToSeconde(time) * 1000;
  return new Date(dateWithTimeZone.getTime() - msTimeZoneOffset + msTime).toISOString();
}

export function getISOStringWithoutTimeZone(time: any) {
  return new Date(time.getTime() - time.getTimezoneOffset() * 60000).toISOString();
}
