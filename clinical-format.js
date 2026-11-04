/* Shared clinical display conventions. Date-only values never cross timezones. */
(function () {
  'use strict';
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function ordinal(day) {
    const teen = day % 100;
    return day + (teen >= 11 && teen <= 13 ? 'th' : ({1:'st',2:'nd',3:'rd'}[day % 10] || 'th'));
  }
  function isoParts(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
    if (!match) return null;
    const year = +match[1], month = +match[2], day = +match[3];
    if (year < 1000 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) return null;
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? {year,month,day} : null;
  }
  function displayDate(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    let parts = isoParts(text);
    // Explicit compatibility with this site's existing DD/MM/YYYY document fields.
    const legacy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(text);
    if (!parts && legacy) parts = isoParts(`${legacy[3]}-${legacy[2].padStart(2,'0')}-${legacy[1].padStart(2,'0')}`);
    return parts ? `${ordinal(parts.day)} ${months[parts.month - 1]}, ${parts.year}` : text;
  }
  function indiaNow(now = new Date()) {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(x => [x.type,x.value]));
    const date = `${p.year}-${p.month}-${p.day}`;
    return {date, display:displayDate(date), time:`${p.hour}:${p.minute}`};
  }
  function documentDateTime(value) {
    const text = String(value || '').trim();
    const date = text.match(/^(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}(?:st|nd|rd|th) [A-Z][a-z]{2}, \d{4})/);
    if (!date) return {date:text, time:''};
    const clock = text.slice(date[0].length).match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    let time = '';
    if (clock) {
      let hour = +clock[1];
      const minute = +clock[2];
      const validHour = clock[3] ? hour >= 1 && hour <= 12 : hour >= 0 && hour < 24;
      if (clock[3] && validHour) hour = hour % 12 + (clock[3].toUpperCase() === 'PM' ? 12 : 0);
      if (validHour && minute >= 0 && minute < 60) time = `${String(hour).padStart(2,'0')}:${clock[2]}`;
    }
    return {date:displayDate(date[0]),time};
  }
  function displayDateTime(value) {
    const parsed = documentDateTime(value);
    if (parsed.time) return `${parsed.date} ${parsed.time} IST`;
    const text=String(value || '').trim();
    const bare=/^(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}(?:st|nd|rd|th) [A-Z][a-z]{2}, \d{4})$/.test(text);
    return bare ? parsed.date : text; // Never discard an unrecognised/invalid entered time.
  }
  window.ClinicalFormat = Object.freeze({displayDate,displayDateTime,documentDateTime,indiaNow,ordinal});
})();
