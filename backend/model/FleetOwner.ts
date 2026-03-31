import mongoose, { Schema, Document } from 'mongoose';

const VehicleSchema = new Schema({
  registrationType: { type: String, enum: ['Personal', 'Yellow board'] },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Others'] },
  vehicleType: { type: String, enum: ['Passenger', 'Goods'] },
  
  // Conditionally required based on vehicleType
  passengerType: { type: String, enum: ['Auto', 'car/jeep', 'TT', 'Mini Bus', 'Bus', 'Others'] },
  seatingCapacity: { type: Number },
  goodsType: { type: String, enum: ['Auto', 'Jeep', 'Mini Truck', 'Truck', 'Container', 'Others'] },
  carJeepType: { type: String, enum: ['Hatchback', 'Sedan', 'Jeep', 'mid SUV', 'SUV'] },
  
  // Generic details
  brand: String,
  model: String,
  variant: String,
  color: String,
  vehicleNumber: String,
  travelRoutine: { type: String, enum: ['City ride', 'Outstation ride', 'state permit', 'All India ride', 'random'] },
  avgKmPerDay: Number,
  
  // Advertisement options
  adOptions: {
    leftDoors: Boolean,
    rightDoors: Boolean,
    frontBonnet: Boolean,
    rearDoor: Boolean,
    roofCarrierHandles: Boolean,
  }
});

const FleetOwnerSchema = new Schema({
  name: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String },
  vehicleProofUrl: { type: String },
  parkingLocation: { type: String },
  vehicles: [VehicleSchema] // Array to allow "add more vehicle"
}, { timestamps: true });

export default mongoose.model('FleetOwner', FleetOwnerSchema);
