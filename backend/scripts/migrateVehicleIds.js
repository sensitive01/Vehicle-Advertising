const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const VehicleSchema = new mongoose.Schema({
  vehicleId: String
}, { strict: false });

const Vehicle = mongoose.model('Vehicle', VehicleSchema);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vehicleAdDB';

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');

    const vehicles = await Vehicle.find({ $or: [{ vehicleId: { $exists: false } }, { vehicleId: null }, { vehicleId: "" }] });
    console.log(`Updating ${vehicles.length} vehicles with IDs`);

    for (const v of vehicles) {
      let isUnique = false;
      let newId = '';
      while (!isUnique) {
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        newId = `VF${randomNum}`;
        const collision = await Vehicle.findOne({ vehicleId: newId });
        if (!collision) isUnique = true;
      }
      await Vehicle.updateOne({ _id: v._id }, { $set: { vehicleId: newId } });
      console.log(`Updated ${v._id} -> ${newId}`);
    }

    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
