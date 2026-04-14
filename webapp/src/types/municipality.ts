export type MunicipalityData = {
  slug: string;
  displayName: string;
};

export type MunicipalitiesResponse = {
  default: string | null;
  municipalities: MunicipalityData[];
};
