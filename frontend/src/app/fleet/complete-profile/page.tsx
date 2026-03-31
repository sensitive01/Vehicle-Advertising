'use client';
import React, { useState } from 'react';
import { Container, Typography, Card, Box, Button, TextField, MenuItem, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function FleetCompleteProfile() {
  const [vehicles, setVehicles] = useState([{ registrationNumber: '', vehicleType: '', vehicleModel: '', images: [] as string[] }]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleAddRow = () => {
    setVehicles([...vehicles, { registrationNumber: '', vehicleType: '', vehicleModel: '', images: [] }]);
  };

  const handleRemoveRow = (index: number) => {
    const list = [...vehicles];
    list.splice(index, 1);
    setVehicles(list);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const list = [...vehicles] as any;
    list[index][field] = value;
    setVehicles(list);
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
        } else if (data.error) {
          alert('Backend Cloudinary Error: ' + data.error.message);
        }
      } catch (err) {
        console.error('Server upload proxy error:', err);
        alert('Network error while proxying to backend server.');
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
        // Update local storage if needed, then route to dashboard!
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
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen py-10 px-6 bg-[#050505] text-white">
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, textTransform: 'uppercase', textAlign: 'center' }}>
          Complete Your <span style={{ color: '#FACC15' }}>Fleet Profile</span>
        </Typography>
        <Typography sx={{ color: 'zinc.400', textAlign: 'center', mb: 6 }}>
          You must specify your vehicle data before accessing the dashboard. Add your fleet below.
        </Typography>

        <Card sx={{ bgcolor: '#121212', p: 6, border: '1px solid #333', borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {vehicles.map((vehicle, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#1A1A1A', p: 3, borderRadius: 2, border: '1px solid #222', position: 'relative' }}>
               <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexDirection: { xs: 'column', md: 'row' } }}>
                 <TextField 
                   fullWidth
                   label="Registration Number" 
                   variant="outlined" 
                   value={vehicle.registrationNumber}
                   onChange={(e) => handleInputChange(index, 'registrationNumber', e.target.value)}
                   placeholder="e.g. MH-01-AB-1234"
                 />
                 <TextField 
                   fullWidth
                   label="Vehicle Type" 
                   select
                   value={vehicle.vehicleType}
                   onChange={(e) => handleInputChange(index, 'vehicleType', e.target.value)}
                 >
                   <MenuItem value="Auto Rickshaw">Auto Rickshaw</MenuItem>
                   <MenuItem value="City Bus">City Bus</MenuItem>
                   <MenuItem value="Private Cab">Private Cab</MenuItem>
                   <MenuItem value="Truck / Tempo">Truck / Tempo</MenuItem>
                 </TextField>
                 <TextField 
                   fullWidth
                   label="Vehicle Model" 
                   variant="outlined" 
                   value={vehicle.vehicleModel}
                   onChange={(e) => handleInputChange(index, 'vehicleModel', e.target.value)}
                   placeholder="e.g. Bajaj RE"
                 />
               </Box>

               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                 <Button variant="outlined" component="label" disabled={uploadingIndex === index} sx={{ color: 'white', borderColor: '#555', textTransform: 'none' }}>
                   {uploadingIndex === index ? 'Uploading...' : 'Upload Images'}
                   <input type="file" hidden multiple accept="image/*" onChange={(e) => handleImageUpload(index, e)} />
                 </Button>
                 <Typography variant="body2" color="zinc.500">{vehicle.images?.length || 0} images attached</Typography>
               </Box>

               {vehicle.images && vehicle.images.length > 0 && (
                 <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                   {vehicle.images.map((img, iIndex) => (
                     <Box key={iIndex} sx={{ position: 'relative', width: 60, height: 60, borderRadius: 1, overflow: 'hidden', border: '1px solid #333' }}>
                       <img src={img} alt="Vehicle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                       <IconButton size="small" onClick={() => handleRemoveImage(index, iIndex)} sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', p: 0.2 }}>
                         <DeleteIcon sx={{ fontSize: 14 }} />
                       </IconButton>
                     </Box>
                   ))}
                 </Box>
               )}
               
               {vehicles.length > 1 && (
                 <IconButton onClick={() => handleRemoveRow(index)} sx={{ color: '#EF4444', position: 'absolute', top: -10, right: -10, bgcolor: '#1A1A1A', border: '1px solid #333', '&:hover': { bgcolor: '#222' } }}>
                   <DeleteIcon />
                 </IconButton>
               )}
            </Box>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddRow} sx={{ color: '#FACC15', borderColor: '#FACC15' }}>
              Add Another Vehicle
            </Button>
            <Button variant="contained" onClick={handleSubmit} disabled={submitting} sx={{ bgcolor: '#FACC15', color: 'black', fontWeight: 700, px: 4 }}>
              {submitting ? 'Saving...' : 'Submit & Continue'}
            </Button>
          </Box>
        </Card>
      </Container>
    </main>
  );
}
