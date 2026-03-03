import type { ServiceDataBase } from "./types";
import { toRoutineData } from "./toRoutineData";
import { toDeepData } from "./toDeepData";
import { toMovingData } from "./toMovingData";
import { toPostConstructionData } from "./toPostConstructionData";
import { toAirbnbData } from "./toAirbnbData";
import { toCommercialData } from "./toCommercialData";
import { toExtrasData } from "./toExtrasData";
import { toOtherCommercialData } from "./toOtherCommercialData";

export type TemplateSlug =
  | "routine-cleaning"
  | "deep-cleaning"
  | "moving-cleaning"
  | "post-construction-cleaning"
  | "airbnb-cleaning"
  | "office-cleaning"
  | "gym-cleaning"
  | "medical-cleaning"
  | "retail-cleaning"
  | "school-cleaning"
  | "property-cleaning"
  | "extras"
  | "other-commercial";

const TRANSFORM_MAP: Record<
  string,
  (data: ServiceDataBase) => Record<string, any>
> = {
  "routine-cleaning": toRoutineData,
  "deep-cleaning": toDeepData,
  "moving-cleaning": toMovingData,
  "post-construction-cleaning": toPostConstructionData,
  "airbnb-cleaning": toAirbnbData,
  "office-cleaning": toCommercialData,
  "gym-cleaning": toCommercialData,
  "medical-cleaning": toCommercialData,
  "retail-cleaning": toCommercialData,
  "school-cleaning": toCommercialData,
  "property-cleaning": toCommercialData,
  extras: toExtrasData,
  "other-commercial": toOtherCommercialData,
  "other-commercial-cleaning": toOtherCommercialData,
};

export function transformServiceData(
  slug: string,
  data: ServiceDataBase
): Record<string, any> {
  const transform = TRANSFORM_MAP[slug];
  if (transform) {
    return transform(data);
  }
  return toCommercialData(data);
}

export {
  toRoutineData,
  toDeepData,
  toMovingData,
  toPostConstructionData,
  toAirbnbData,
  toCommercialData,
  toExtrasData,
  toOtherCommercialData,
};
