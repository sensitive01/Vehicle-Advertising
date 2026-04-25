'use client';
import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Card, Box, Button, TextField, MenuItem, 
  IconButton, Autocomplete, CircularProgress, Stack 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function FleetCompleteProfile() {
  const [vehicles, setVehicles] = useState([{ 
    registrationNumber: '', 
    vehicleType: '', 
    vehicleModel: '', 
    parkingLocation: '', 
    images: [] as string[] 
  }]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  // Location Search States
  const [locationOptions, setLocationOptions] = useState<any[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const handleAddRow = () => {
    setVehicles([...vehicles, { registrationNumber: '', vehicleType: '', vehicleModel: '', parkingLocation: '', images: [] }]);
  };

  const handleRemoveRow = (index: number) => {
    const list = [...vehicles];
    list.splice(index, 1);
    setVehicles(list);
  };

  const handleInputChange = (index: number, field: string, value: any) => {
    const list = [...vehicles] as any;
    list[index][field] = value;
    setVehicles(list);
  };

  // Search Locations using OpenStreetMap Nominatim
  const searchLocations = async (query: string) => {
    if (!query || query.length < 3) return;
    setLoadingLocations(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      setLocationOptions(data.map((item: any) => ({
        label: item.display_name,
        value: item.display_name,
        lat: item.lat,
        lon: item.lon
      })));
    } catch (err) {
      console.error('Location search failed:', err);
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    const uploadedUrls: string[] = [];
    setUploadingIndex(index);
    
    await Promise.all(files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fleet/upload`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      } catch (err) {
        console.error('Upload error:', err);
      }
    }));
    
    setUploadingIndex(null);
    
    if (uploadedUrls.length > 0) {
      setVehicles((prev: any) => {
        const list = [...prev];
        list[index].images = [...(list[index].images || []), ...uploadedUrls];
        return list;
      });
    }
  };

  const handleRemoveImage = (vIndex: number, iIndex: number) => {
    const list = [...vehicles] as any;
    if (list[vIndex].images) {
      list[vIndex].images.splice(iIndex, 1);
    }
    setVehicles(list);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fleet/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ vehicles })
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = '/fleet/dashboard';
      } else {
        alert(data.message || 'Failed to register vehicles.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-start min-h-screen pt-4 pb-20 px-6 bg-[#050505] text-white">
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 0.5, textTransform: 'uppercase', textAlign: 'center' }}>
          Complete Your <span style={{ color: '#FACC15' }}>Fleet Profile</span>
        </Typography>
        <Typography sx={{ color: 'zinc.400', textAlign: 'center', mb: 6 }}>
          You must specify your vehicle data before accessing the dashboard. Add your fleet below.
        </Typography>

        <Card sx={{ bgcolor: '#121212', p: 4, border: '1px solid #333', borderRadius: 1.5, display: 'flex', flexDirection: 'column', gap: 3, backgroundImage: 'none' }}>
          {vehicles.map((vehicle: any, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#0A0A0A', p: 3, borderRadius: 2, border: '1px solid #222', position: 'relative' }}>
               
               {/* New Robust Row Layout using Stack instead of Grid */}
               <Stack 
                direction={{ xs: 'column', md: 'row' }} 
                spacing={2} 
                sx={{ width: '100%', alignItems: 'flex-start' }}
               >
                 <Box sx={{ flex: 1, width: '100%' }}>
                   <TextField 
                     fullWidth
                     label="Registration Number" 
                     variant="outlined" 
                     value={vehicle.registrationNumber}
                     onChange={(e) => handleInputChange(index, 'registrationNumber', e.target.value)}
                     placeholder="e.g. KL-01-AB-1234"
                     sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#121212' } }}
                   />
                 </Box>
                 
                 <Box sx={{ flex: 1, width: '100%' }}>
                   <TextField 
                     fullWidth
                     label="Vehicle Type" 
                     select
                     value={vehicle.vehicleType}
                     onChange={(e) => handleInputChange(index, 'vehicleType', e.target.value)}
                     sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#121212' } }}
                   >
                     <MenuItem value="Auto Rickshaw">Auto Rickshaw</MenuItem>
                     <MenuItem value="City Bus">City Bus</MenuItem>
                     <MenuItem value="Private Cab">Private Cab</MenuItem>
                     <MenuItem value="Truck / Tempo">Truck / Tempo</MenuItem>
                   </TextField>
                 </Box>

                 <Box sx={{ flex: 1, width: '100%' }}>
                   <TextField 
                     fullWidth
                     label="Vehicle Model" 
                     variant="outlined" 
                     value={vehicle.vehicleModel}
                     onChange={(e) => handleInputChange(index, 'vehicleModel', e.target.value)}
                     placeholder="e.g. Innova"
                     sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#121212' } }}
                   />
                 </Box>

                 <Box sx={{ flex: 2, width: '100%' }}> {/* Location gets more space */}
                   <Autocomplete
                      fullWidth
                      freeSolo
                      options={locationOptions}
                      loading={loadingLocations}
                      ListboxProps={{
                        sx: {
                          '&::-webkit-scrollbar': { display: 'none' },
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none',
                          bgcolor: '#121212',
                          color: 'white',
                          '& .MuiAutocomplete-option': {
                            borderBottom: '1px solid #222',
                            fontSize: '0.85rem',
                            py: 1.5
                          }
                        }
                      }}
                      onInputChange={(e, value) => {
                        handleInputChange(index, 'parkingLocation', value);
                        searchLocations(value);
                      }}
                      onChange={(e, value: any) => {
                        if (value) handleInputChange(index, 'parkingLocation', typeof value === 'string' ? value : value.label);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          label="Parking Location"
                          placeholder="Search address..."
                          sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#121212' } }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loadingLocations ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                   />
                 </Box>
               </Stack>

               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                 <Button 
                   variant="outlined" 
                   component="label" 
                   disabled={uploadingIndex === index} 
                   startIcon={<CloudUploadIcon />}
                   sx={{ color: 'white', borderColor: '#333', textTransform: 'none', px: 3, bgcolor: '#111', '&:hover': { bgcolor: '#222' } }}
                 >
                   {uploadingIndex === index ? 'Uploading...' : 'Upload Images'}
                   <input type="file" hidden multiple accept="image/*" onChange={(e) => handleImageUpload(index, e)} />
                 </Button>
                 <Typography variant="body2" sx={{ color: 'zinc.500', fontWeight: 600 }}>{vehicle.images?.length || 0} images attached</Typography>
               </Box>

               {vehicle.images && vehicle.images.length > 0 && (
                 <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                   {vehicle.images.map((img, iIndex) => (
                     <Box key={iIndex} sx={{ position: 'relative', width: 80, height: 60, borderRadius: 1, overflow: 'hidden', border: '1px solid #333' }}>
                       <img src={img} alt="Vehicle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                       <IconButton size="small" onClick={() => handleRemoveImage(index, iIndex)} sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', p: 0.2 }}>
                         <DeleteIcon sx={{ fontSize: 14 }} />
                       </IconButton>
                     </Box>
                   ))}
                 </Box>
               )}
               
               {vehicles.length > 1 && (
                 <IconButton onClick={() => handleRemoveRow(index)} sx={{ color: '#EF4444', position: 'absolute', top: -10, right: -10, bgcolor: '#0A0A0A', border: '1px solid #333', '&:hover': { bgcolor: '#222' } }}>
                   <DeleteIcon />
                 </IconButton>
               )}
            </Box>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 3, borderTop: '1px solid #333' }}>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddRow} sx={{ color: '#FACC15', borderColor: '#FACC15', fontWeight: 700, px: 3, borderRadius: 2 }}>
              Add Another Vehicle
            </Button>
            <Button variant="contained" onClick={handleSubmit} disabled={submitting} sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 800, px: 6, borderRadius: 2, height: 48, fontSize: '1rem' }}>
              {submitting ? 'Saving Profile...' : 'Submit & Continue'}
            </Button>
          </Box>
        </Card>
      </Container>
    </main>
  );
}
