export interface DeviceEnvVars {
  _sn: string | FormDataEntryValue | null;
  _air_mins?: string | FormDataEntryValue | null;
  air_mins?: string | FormDataEntryValue | null; // V3 Airnote env var
  _air_indoors?: string | FormDataEntryValue | null;
  air_indoors?: string | FormDataEntryValue | null; // V3 Airnote env var
  _air_status?: string | FormDataEntryValue | null;
  air_status?: string | FormDataEntryValue | null; // V3 Airnote env var
  _contact_name: string | FormDataEntryValue | null;
  _contact_email: string | FormDataEntryValue | null;
  _contact_affiliation: string | FormDataEntryValue | null;
}
