import type {
    ColumnType,
    Generated,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
} from 'kysely'

export interface Database {
 
  temperature_sensor: TemperatureSensorTable
  thresholds: thresholdsTable
}


export interface TemperatureSensorTable {
  id: Generated<number>
  value: number
  state: string
  created_at:  ColumnType<Date, string | undefined, never>
}   

export interface TemperatureSensorTable {
  id: Generated<number>
  value: number
  state: string
  created_at:  ColumnType<Date, string | undefined, never>
}      

export interface thresholdsTable {
  value: number
  state: string
}  

export type TemperatureSensor = Selectable<TemperatureSensorTable>
export type NewTemperatureSensor = Insertable<TemperatureSensorTable>
export type TemperatureSensorUpdate = Updateable<TemperatureSensorTable>