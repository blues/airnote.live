export type PotentiallyNullDeviceDetails = string | (string | null)[];

export interface AirnoteDevice {
  deviceUID: string;
  productUID: PotentiallyNullDeviceDetails;
  pin: PotentiallyNullDeviceDetails;
  internalNav?: PotentiallyNullDeviceDetails | null;
}
