export function formatFrenchRDVDisplay(input: string): string {
  const [datePart, timePart] = input.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const months: Record<number, string> = {
    1: "janv",
    2: "févr",
    3: "mars",
    4: "avr",
    5: "mai",
    6: "juin",
    7: "juil",
    8: "août",
    9: "sept",
    10: "oct",
    11: "nov",
    12: "déc",
  };

  return `(${day} ${months[month]} à ${hour}h:${minute
    .toString()
    .padStart(2, "0")})`;
}
