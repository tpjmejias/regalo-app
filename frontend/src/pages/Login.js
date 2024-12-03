import { useState, useEffect, useRef } from 'react';
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
  const recaptchaContainerRef = useRef(null);
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const setupRecaptcha = async () => {
    try {
      if (!window.recaptchaVerifier && recaptchaContainerRef.current) {
        const verifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
          size: 'normal',
          callback: () => {
            console.log('reCAPTCHA resuelto');
          },
          'expired-callback': () => {
            setError('reCAPTCHA expirado. Por favor, intenta de nuevo.');
            window.recaptchaVerifier = null;
          }
        });

        await verifier.render();
        window.recaptchaVerifier = verifier;
      }
    } catch (error) {
      console.error('Error al configurar reCAPTCHA:', error);
      setError('Error al configurar la verificación. Por favor, recarga la página.');
    }
  };

  const sendVerificationCode = async () => {
    try {
      setLoading(true);
      setError('');
      
      let formattedPhone = phone;
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = `+${formattedPhone}`;
      }

      await setupRecaptcha();
      
      if (!window.recaptchaVerifier) {
        throw new Error('Error al inicializar reCAPTCHA');
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );
      
      setConfirmationResult(confirmation);
      setStep(2);
      setError('');
    } catch (error) {
      console.error('Error al enviar código:', error);
      setError('Error al enviar el código. Verifica el número e intenta de nuevo.');
      if (window.recaptchaVerifier) {
        try {
          await window.recaptchaVerifier.clear();
        } catch (e) {
          console.error('Error al limpiar reCAPTCHA:', e);
        }
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    try {
      setLoading(true);
      setError('');

      if (!confirmationResult) {
        throw new Error('No hay código de verificación pendiente');
      }
      
      await confirmationResult.confirm(verificationCode);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al verificar código:', error);
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
                helperText="Incluye el código de país (ej: +52 para México)"
              />
              <div 
                ref={recaptchaContainerRef}
                style={{ marginBottom: '1rem' }}
              />
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
                helperText="Ingresa el código de 6 dígitos que recibiste por SMS"
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