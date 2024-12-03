import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper,
  CircularProgress
} from '@mui/material';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: teléfono, 2: código

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'normal',
        'callback': () => {
          // reCAPTCHA resuelto
        },
        'expired-callback': () => {
          setError('reCAPTCHA expirado. Por favor, intenta de nuevo.');
        }
      });
    }
  };

  const sendVerificationCode = async () => {
    try {
      setLoading(true);
      setError('');
      setupRecaptcha();
      
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      const confirmation = await signInWithPhoneNumber(
        auth, 
        formattedPhone, 
        window.recaptchaVerifier
      );
      
      setVerificationId(confirmation);
      setStep(2);
    } catch (error) {
      console.error(error);
      setError('Error al enviar el código. Verifica el número e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    try {
      setLoading(true);
      setError('');
      
      await verificationId.confirm(verificationCode);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setError('Código inválido. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Iniciar Sesión
          </Typography>

          {step === 1 ? (
            <>
              <TextField
                fullWidth
                label="Número de teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
                sx={{ mb: 2 }}
              />
              <div id="recaptcha-container" />
              <Button
                fullWidth
                variant="contained"
                onClick={sendVerificationCode}
                disabled={loading || !phone}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Enviar código'}
              </Button>
            </>
          ) : (
            <>
              <TextField
                fullWidth
                label="Código de verificación"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={verifyCode}
                disabled={loading || !verificationCode}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Verificar'}
              </Button>
            </>
          )}

          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;