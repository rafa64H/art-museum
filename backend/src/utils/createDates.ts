export function create24HoursFromNowDate() {
  return new Date(Date.now() + 24 * 60 * 60 * 1000);
}

export function create30DaysNumber() {
  return 30 * 24 * 60 * 60 * 1000;
}
