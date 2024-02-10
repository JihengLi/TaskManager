export interface CreateDeveloperInput {
  name: string;
  position: string;
  team: string;
  phone: string;
  email: string;
  password: string;
}

export interface EditDeveloperInput {
  position: string;
  team: string;
  phone: string;
}

export interface DeveloperLoginInput {
  email: string;
  password: string;
}

export interface DeveloperPayload {
  _id: string;
  email: string;
  name: string;
  position: string;
}
