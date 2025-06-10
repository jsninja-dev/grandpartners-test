import {
  Button,
  Container,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function EmailAuth() {
  const [pin, setPin] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/auth');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    setCanResend(true);
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/v1/auth/login/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          pincode: Number.parseInt(pin),
        }),
      });

      if (response.ok) {
        const { data } = await response.json();
        login(data.session);
      } else {
        const error = await response.json();
        notifications.show({
          title: 'Error',
          message: error.error.message || 'Invalid PIN',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to verify PIN',
        color: 'red',
      });
    }
  };

  const handleResendPin = async () => {
    try {
      const response = await fetch('/v1/user/register/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          lang: 'en',
        }),
      });

      if (response.ok) {
        setCountdown(60);
        setCanResend(false);
        notifications.show({
          title: 'Success',
          message: 'PIN resent successfully',
          color: 'green',
        });
      } else {
        const error = await response.json();
        notifications.show({
          title: 'Error',
          message: error.error.message || 'Failed to resend PIN',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to resend PIN',
        color: 'red',
      });
    }
  };

  return (
    <Container size="xs" px="xs" py="xl">
      <Paper radius="md" p={{ base: 'md', sm: 'xl' }} withBorder>
        <Title order={2} mb="md" ta="center">
          Enter PIN
        </Title>

        <Text size="sm" ta="center" mb="xl">
          We've sent a 6-digit PIN to {email}
        </Text>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              required
              label="PIN Code"
              placeholder="Enter 6-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={6}
              pattern="\d{6}"
              size="md"
            />

            <Button type="submit" fullWidth mt="xl" size="md">
              Verify
            </Button>

            <Text size="sm" ta="center" mt="md">
              {canResend ? (
                <Button variant="subtle" onClick={handleResendPin} size="sm">
                  Resend PIN
                </Button>
              ) : (
                `Resend PIN in ${countdown}s`
              )}
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
