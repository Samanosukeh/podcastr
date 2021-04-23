export function convertDurationToTimeString(duration: number) {
    const hours = Math.floor(duration / 3600);//arredondando a hora pra baixo
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    const timeString = [hours, minutes, seconds]
    .map(unit => String(unit).padStart(2, '0'))//add 0 se retornar apenas 1 número, ex: 00:00
    .join(':');

    return timeString;
}