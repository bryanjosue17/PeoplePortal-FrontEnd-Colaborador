import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SaveIcon from '@mui/icons-material/Save';
import { Alert, Box, Button, Card, Chip, Divider, Grid, Skeleton, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { getMyProfile, updateMyProfile } from '../../api/employees';

const validationSchema = yup.object({
  emergencyContact: yup.string(),
  emergencyPhone: yup.string(),
  phone: yup.string(),
  site: yup.string(),
});

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);

  const formik = useFormik({
    initialValues: { emergencyContact: '', emergencyPhone: '', phone: '', site: '' },
    onSubmit: async (values) => {
      try {
        const res = await updateMyProfile(values);
        setProfile(res.data);
        setEditing(false);
        toast.success('Perfil actualizado exitosamente');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error al actualizar perfil');
      }
    },
    validationSchema,
  });

  useEffect(() => {
    getMyProfile()
      .then(res => {
        const p = res.data;
        setProfile(p);
        formik.setValues({
          emergencyContact: p.emergencyContact || '',
          emergencyPhone: p.emergencyPhone || '',
          phone: p.phone || '',
          site: p.site || '',
        });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = () => {
    formik.setValues({
      emergencyContact: profile?.emergencyContact || '',
      emergencyPhone: profile?.emergencyPhone || '',
      phone: profile?.phone || '',
      site: profile?.site || '',
    });
    setEditing(false);
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error al cargar el perfil: {error}
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 3 }}>
          <AccountCircleIcon color="primary" />
          <Typography variant="h5" fontWeight={600}>Mi Perfil</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid size={{ md: 4, xs: 12 }}>
            <Skeleton variant="rounded" height={300} />
          </Grid>
        <Grid size={{ md: 8, xs: 12 }}>
            <Skeleton variant="rounded" height={300} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  const fullName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || profile?.email || 'Usuario';

  return (
    <Box>
      <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 3 }}>
        <AccountCircleIcon color="primary" />
        <Typography variant="h5" fontWeight={600}>Mi Perfil</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ md: 4, xs: 12 }}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{
              alignItems: 'center',
              background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
              borderRadius: '50%',
              color: '#fff',
              display: 'flex',
              fontSize: 40,
              fontWeight: 700,
              height: 90,
              justifyContent: 'center',
              mb: 2,
              mx: 'auto',
              width: 90,
              boxShadow: '0 8px 24px rgba(96,165,250,0.35)',
            }}>
              {(profile?.firstName?.charAt(0) || 'U').toUpperCase()}
            </Box>
            <Typography variant="h6" fontWeight={700}>{fullName}</Typography>
            <Chip label={profile?.status || 'Activo'} color={profile?.status === 'Activo' ? 'success' : 'default'} size="small" sx={{ mt: 1 }} />
            <Divider sx={{ my: 2 }} />
            <Box sx={{ textAlign: 'left' }}>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1.5 }}>
                <BadgeIcon fontSize="small" color="primary" />
                <Typography variant="body2">{profile?.documentType || ''}: {profile?.documentNumber || ''}</Typography>
              </Box>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1.5 }}>
                <EmailIcon fontSize="small" color="primary" />
                <Typography variant="body2">{profile?.email || ''}</Typography>
              </Box>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                <BusinessIcon fontSize="small" color="primary" />
                <Typography variant="body2">{profile?.site || 'No asignado'}</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ md: 8, xs: 12 }}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>Información de Contacto</Typography>
              {!editing && (
                <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setEditing(true)}>
                  Editar
                </Button>
              )}
            </Box>

            <Box component="form" onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid size={{ sm: 6, xs: 12 }}>
                  <TextField fullWidth label="Teléfono" name="phone" value={formik.values.phone}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    disabled={!editing}
                    InputProps={{ startAdornment: <PhoneIcon fontSize="small" sx={{ color: 'action.active', mr: 1 }} /> }} />
                </Grid>
                <Grid size={{ sm: 6, xs: 12 }}>
                  <TextField fullWidth label="Sitio / Ubicación" name="site" value={formik.values.site}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.site && Boolean(formik.errors.site)}
                    helperText={formik.touched.site && formik.errors.site}
                    disabled={!editing}
                    InputProps={{ startAdornment: <BusinessIcon fontSize="small" sx={{ color: 'action.active', mr: 1 }} /> }} />
                </Grid>
                <Grid size={{ sm: 6, xs: 12 }}>
                  <TextField fullWidth label="Contacto de Emergencia" name="emergencyContact" value={formik.values.emergencyContact}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.emergencyContact && Boolean(formik.errors.emergencyContact)}
                    helperText={formik.touched.emergencyContact && formik.errors.emergencyContact}
                    disabled={!editing} />
                </Grid>
                <Grid size={{ sm: 6, xs: 12 }}>
                  <TextField fullWidth label="Teléfono de Emergencia" name="emergencyPhone" value={formik.values.emergencyPhone}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.emergencyPhone && Boolean(formik.errors.emergencyPhone)}
                    helperText={formik.touched.emergencyPhone && formik.errors.emergencyPhone}
                    disabled={!editing} />
                </Grid>
                {editing && (
                  <Grid size={12}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="contained" startIcon={<SaveIcon />} onClick={formik.handleSubmit} disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? 'Guardando...' : 'Guardar'}
                      </Button>
                      <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCancel} disabled={formik.isSubmitting}>
                        Cancelar
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>

    </Box>
  );
}

export default Profile;
