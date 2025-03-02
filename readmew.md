model Station {
id String @id @default(cuid())
name String @unique
desc String?
isActive Boolean @default(true)

// Graph connections between stations
outgoingConnections Connection[] @relation("FromStation")
incomingConnections Connection[] @relation("ToStation")
}

model Connection {
id String @id @default(cuid())
fromStationId String
fromStation Station @relation("FromStation", fields: [fromStationId], references: [id])
toStationId String
toStation Station @relation("ToStation", fields: [toStationId], references: [id])
distance Float // distance in kilometers
isActive Boolean @default(true)

@@unique([fromStationId, toStationId])
}

model Train {
id String @id @default(cuid())
name String
number String @unique
trainLines TrainLine[]
isActive Boolean @default(true)
}

model TrainClass {
id String @id @default(cuid())
name String // e.g., "Economy", "Business", "First Class"
pricePerKm Float // base price per kilometer
trainLines TrainLine[] @relation("TrainLineClasses")
tickets Ticket[]
}

model TrainLine {
id String @id @default(cuid())
trainId String
train Train @relation(fields: [trainId], references: [id])
name String // e.g., "Algiers-Oran Express"
classes TrainClass[] @relation("TrainLineClasses")
schedules TrainSchedule[]
isActive Boolean @default(true)
}

model TrainSchedule {
id String @id @default(cuid())
trainLineId String
trainLine TrainLine @relation(fields: [trainLineId], references: [id])
dayOfWeek Int? // null means daily
departureTime DateTime // time only (no date)
stationStops StationStop[]
tickets Ticket[]
}

model StationStop {
id String @id @default(cuid())
trainScheduleId String
trainSchedule TrainSchedule @relation(fields: [trainScheduleId], references: [id])
stationId String
station Station @relation(fields: [stationId], references: [id])
arrivalTime DateTime? // null for origin station
departureTime DateTime? // null for final destination
stopOrder Int // sequence number in the route

@@unique([trainScheduleId, stationId])
@@unique([trainScheduleId, stopOrder])
}

model Ticket {
id String @id @default(cuid())
referenceNumber String @unique
trainScheduleId String
trainSchedule TrainSchedule @relation(fields: [trainScheduleId], references: [id])
trainClassId String
trainClass TrainClass @relation(fields: [trainClassId], references: [id])
originStopId String // references StationStop.id
destinationStopId String // references StationStop.id
journeyDate DateTime // specific date of travel
passengerName String
passengerEmail String?
seatNumber String?
status String // "valid", "used", "cancelled", "refunded"
price Float
purchaseDate DateTime @default(now())
validUntil DateTime
}

model AuditLog {
id String @id @default(cuid())
userId String
user User @relation(fields: [userId], references: [id])
action String
details String?
ipAddress String?
createdAt DateTime @default(now())
}
