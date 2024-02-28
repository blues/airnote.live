export interface KratosIdentity {
  id: string;
  traits: {
    account_uid: string;
    full_name: string;
    email: string;
  };
  state: string;
  created_at: string;
  updated_at: string;
}
