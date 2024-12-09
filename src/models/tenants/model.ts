export type TenantContact = {
  type: string
  contact: string
}

export type Tenant = {
  id: string
  name: string
  contacts: TenantContact[]
  registration_code: string
  notes?: string
}

export type SearchTenant = {
  label: string
  value: string
}

export type SearchTenantRequest = {
  name?: string
  registration_code?: string
}

export type CreateTenantRequest = {
  name: string
  contacts: {
    type: string
    contact: string
  }[]
  registration_code: string
  notes?: string
  property_id?: string
}

export type CreateTenantResponse = {
  id: string
  name: string
  contacts: {
    type: string
    contact: string
  }[]
  registration_code: string
  notes?: string
}

export type ListTenantRequest = {
  name?: string
}
export type ListTenantResponse = {
  data: Tenant[]
}

export type GetTenantByRegistrationCodeRequest = {
  registration_code: string
}
