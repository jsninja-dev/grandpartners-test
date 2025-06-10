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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Auth() {
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if input is email or access code
    const isEmail = input.includes('@');

    if (isEmail) {
      try {
        const response = await fetch('/v1/user/register/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: input,
            lang: 'en',
          }),
        });

        if (response.ok) {
          navigate('/auth/email', { state: { email: input } });
        } else {
          const error = await response.json();
          notifications.show({
            title: 'Error',
            message: error.error.message || 'Invalid email format',
            color: 'red',
          });
        }
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to send PIN',
          color: 'red',
        });
      }
    } else {
      // Handle access code
      try {
        const response = await fetch('/v1/auth/login/code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ login_code: input }),
        });

        if (response.ok) {
          const { data } = await response.json();
          login(data.session);
        } else {
          const error = await response.json();
          notifications.show({
            title: 'Error',
            message: error.error.message || 'Invalid access code',
            color: 'red',
          });
        }
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to verify access code',
          color: 'red',
        });
      }
    }
  };

  return (
    <Container size="xs" px="xs" py="xl">
      <Paper radius="md" p={{ base: 'md', sm: 'xl' }} withBorder>
        <Title order={2} mb="md" ta="center">
          Welcome Back
        </Title>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              required
              label="Email or Access Code"
              placeholder="Enter your email or 16-digit access code"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              size="md"
            />

            <Button type="submit" fullWidth mt="xl" size="md">
              Continue
            </Button>

            <Text size="sm" ta="center" mt="md">
              Don't have an account?{' '}
              <Button
                variant="subtle"
                onClick={() => navigate('/reg')}
                size="sm"
              >
                Register
              </Button>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
