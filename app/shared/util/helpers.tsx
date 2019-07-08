export function ToArray(enumme: any) {
  return Object.keys(enumme).map(key => enumme[key]);
}
