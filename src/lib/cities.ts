export const allTurkeyCityValue = "all";

export const cityOptions = [
  { id: 34, label: "İstanbul" },
  { id: 35, label: "İzmir" },
  { id: 16, label: "Bursa" },
  { id: 6, label: "Ankara" },
] as const;

export type CityId = (typeof cityOptions)[number]["id"];
export type CitySelectValue = typeof allTurkeyCityValue | `${CityId}`;

const cityIds = new Set<number>(cityOptions.map((city) => city.id));

export function isCityId(value: number): value is CityId {
  return cityIds.has(value);
}

export function parseCityId(value: string | undefined): CityId | undefined {
  if (!value) {
    return undefined;
  }

  const cityId = Number(value);

  return Number.isInteger(cityId) && isCityId(cityId) ? cityId : undefined;
}

export function toCitySelectValue(cityId: CityId | undefined): CitySelectValue {
  return cityId === undefined ? allTurkeyCityValue : `${cityId}`;
}
