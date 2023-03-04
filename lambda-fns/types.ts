export type Starship = {
  id: string
  name: string
  attributes: Attribute[]
}

export type Attribute = {
  name: string
  value: string
}

export type AppSyncEvent = {
  info: {
    fieldName: string
  }
  arguments: {
    starshipID: string
    createStarshipInput: CreateStarshipInput
    updateStarshipInput: UpdateStarshipInput
  }
}

export type CreateStarshipInput = Starship

export type UpdateStarshipInput = Optional<Starship, 'name' | 'attributes'>

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;