'use client';

import React, { useState } from 'react';
import { 
  TextField, Button, Select, MenuItem, FormControl, InputLabel, 
  Checkbox, FormControlLabel, Divider, Typography, Card
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

export default function FleetRegistrationForm() {
  const [vehicles, setVehicles] = useState([{ id: 1, type: '', passengerType: '' }]);

  const addVehicle = () => {
    setVehicles([...vehicles, { id: Date.now(), type: '', passengerType: '' }]);
  };

  const removeVehicle = (id: number) => {
    setVehicles(vehicles.filter((v) => v.id !== id));
  };

  const updateVehicle = (id: number, field: string, value: string) => {
    setVehicles(vehicles.map((v) => v.id === id ? { ...v, [field]: value } : v));
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-0">
      <div className="mb-10 text-center">
        <Typography variant="h2" className="text-white mb-3">Fleet Registration</Typography>
        <Typography className="text-zinc-400">Provide your operational details to connect with tier-one advertisers.</Typography>
      </div>
      
      <Card className="p-8 sm:p-12 mb-8 bg-[#121212] border-zinc-800" elevation={0}>
        <form className="space-y-12">
          
          {/* Owner Details Section */}
          <section>
            <Typography variant="h4" className="text-white flex items-center" sx={{ mb: 5 }}>
              <span className="bg-[#FACC15] text-black rounded-lg p-2 mr-3 text-sm font-bold">01</span>
              Primary Contact
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mt-4">
              <TextField label="Full Legal Name" fullWidth required />
              <TextField label="Contact Number" fullWidth required />
              <TextField label="Professional Email" fullWidth />
              <TextField label="Designated Parking Location" fullWidth required />
              <div className="md:col-span-2 mt-4">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Proof of Ownership / Registration</label>
                <div className="border-2 border-dashed border-zinc-700 rounded-xl p-6 flex flex-col items-center justify-center bg-zinc-900/50 hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-400">
                  <svg className="w-8 h-8 mb-2 text-[#FACC15]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <span className="text-sm font-medium">Click to upload documents (PDF, JPG, PNG)</span>
                </div>
              </div>
            </div>
          </section>

          <Divider />

          {/* Vehicles Array Section */}
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <Typography variant="h4" className="text-white flex items-center" sx={{ mb: 0 }}>
                <span className="bg-[#FACC15] text-black rounded-lg p-2 mr-3 text-sm font-bold">02</span>
                Vehicle Assets
              </Typography>
            </div>

            <div className="space-y-8 mt-4">
              {vehicles.map((vehicle, index) => (
                <div key={vehicle.id} className="relative bg-zinc-900/50 border border-zinc-800 p-6 sm:p-8 rounded-2xl group transition-all hover:border-[#FACC15]">
                  <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
                    <Typography variant="h4" className="text-white text-lg font-bold" sx={{ mb: 0 }}>
                      Asset #{index + 1}
                    </Typography>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small"
                      onClick={() => removeVehicle(vehicle.id)} 
                      startIcon={<DeleteOutlineIcon />}
                      disabled={vehicles.length === 1}
                      sx={{ textTransform: 'none', borderRadius: '8px' }}
                    >
                      Delete Asset
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    <TextField label="Brand / Manufacturer" placeholder="e.g. Tata, Mahindra" fullWidth required />
                    <TextField label="Model & Variant" fullWidth required />
                    <TextField label="Registration Number (RC)" fullWidth required />
                    <TextField label="Exterior Color" fullWidth required />

                    <FormControl fullWidth>
                      <InputLabel>Fuel Engine Type</InputLabel>
                      <Select label="Fuel Engine Type" defaultValue="">
                        {['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'].map(f => (
                          <MenuItem key={f} value={f}>{f}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Primary Travel Routine</InputLabel>
                      <Select label="Primary Travel Routine" defaultValue="">
                        <MenuItem value="City ride">City Local Fleet</MenuItem>
                        <MenuItem value="Outstation ride">Outstation / Regional</MenuItem>
                        <MenuItem value="state permit">State Wide Permit</MenuItem>
                        <MenuItem value="All India ride">National Route</MenuItem>
                      </Select>
                    </FormControl>

                    {/* Type Logic */}
                    <div className="md:col-span-2 mt-4">
                      <Typography className="text-sm font-medium text-zinc-300 mb-3">Asset Classification</Typography>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                        <FormControl fullWidth>
                          <InputLabel>Asset Class</InputLabel>
                          <Select value={vehicle.type} label="Asset Class" onChange={(e) => updateVehicle(vehicle.id, 'type', e.target.value)}>
                            <MenuItem value="Passenger">Passenger Transport</MenuItem>
                            <MenuItem value="Goods">Goods Carrier</MenuItem>
                          </Select>
                        </FormControl>

                        {vehicle.type === 'Passenger' && (
                          <FormControl fullWidth>
                            <InputLabel>Passenger Vehicle Type</InputLabel>
                            <Select value={vehicle.passengerType} label="Passenger Vehicle Type" onChange={(e) => updateVehicle(vehicle.id, 'passengerType', e.target.value)}>
                              <MenuItem value="Auto">Auto Rickshaw</MenuItem>
                              <MenuItem value="car/jeep">Car / SUV</MenuItem>
                              <MenuItem value="TT">Tempo Traveller</MenuItem>
                              <MenuItem value="Bus">Omnibus</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                        {vehicle.type === 'Passenger' && vehicle.passengerType === 'car/jeep' && (
                          <FormControl fullWidth className="sm:col-span-2">
                            <InputLabel>Chassis Layout</InputLabel>
                            <Select defaultValue="" label="Chassis Layout">
                              <MenuItem value="Hatchback">Compact Hatchback</MenuItem>
                              <MenuItem value="Sedan">Sedan</MenuItem>
                              <MenuItem value="SUV">SUV Segment</MenuItem>
                            </Select>
                          </FormControl>
                        )}

                        {vehicle.type === 'Goods' && (
                          <FormControl fullWidth>
                            <InputLabel>Goods Carrier Size</InputLabel>
                            <Select defaultValue="" label="Goods Carrier Size">
                              <MenuItem value="Auto">Three-Wheeler Payload</MenuItem>
                              <MenuItem value="Mini Truck">Mini Truck / Pickup</MenuItem>
                              <MenuItem value="Truck">Heavy Duty Truck</MenuItem>
                              <MenuItem value="Container">Container / Trailer</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-2 mt-6">
                      <Typography className="text-sm font-medium text-zinc-300 mb-3">Available Ad Inventory</Typography>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                        <FormControlLabel control={<Checkbox size="small" />} label={<Typography className="text-zinc-300">Left Side Doors</Typography>} />
                        <FormControlLabel control={<Checkbox size="small" />} label={<Typography className="text-zinc-300">Right Side Doors</Typography>} />
                        <FormControlLabel control={<Checkbox size="small" />} label={<Typography className="text-zinc-300">Front Bonnet</Typography>} />
                        <FormControlLabel control={<Checkbox size="small" />} label={<Typography className="text-zinc-300">Rear Tailgate</Typography>} />
                        <FormControlLabel control={<Checkbox size="small" />} label={<Typography className="text-zinc-300">Roof Cap</Typography>} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-start">
              <Button 
                variant="outlined" 
                startIcon={<AddCircleOutlineIcon />} 
                onClick={addVehicle}
                className="border-dashed"
                sx={{ 
                  color: '#FACC15', 
                  borderColor: '#FACC15',
                  '&:hover': { borderColor: '#FDE047', backgroundColor: 'rgba(250, 204, 21, 0.05)' },
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  borderRadius: '8px'
                }}
              >
                + Add Another Asset
              </Button>
            </div>
          </section>

          <Divider />

          <div className="flex justify-end pt-4">
            <Button 
              variant="contained" 
              size="large" 
              endIcon={<ArrowRightAltIcon />}
            >
              Submit Fleet Registration
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
