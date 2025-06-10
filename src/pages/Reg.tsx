import {
  Button,
  Container,
  Divider,
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

export default function Reg() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        navigate('/auth/email', { state: { email } });
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
  };

  const handleAnonymousSubmit = async () => {
    try {
      const response = await fetch('/v1/user/register/code', {
        method: 'POST',
      });

      if (response.ok) {
        const { data } = await response.json();
        navigate('/reg/code', { state: { login_code: data.login_code } });
      } else {
        const error = await response.json();
        notifications.show({
          title: 'Error',
          message: error.error.message || 'Failed to generate access code',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to generate access code',
        color: 'red',
      });
    }
  };

  return (
    <Container size="xs" px="xs" py="xl">
      <Paper radius="md" p={{ base: 'md', sm: 'xl' }} withBorder>
        <Title order={2} mb="md" ta="center">
          Create Account
        </Title>

        <form onSubmit={handleEmailSubmit}>
          <Stack gap="md">
            <TextInput
              required
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="md"
            />

            <Button type="submit" fullWidth mt="xl" size="md">
              Continue with Email
            </Button>

            <Divider label="or" labelPosition="center" />

            <Button
              variant="outline"
              onClick={handleAnonymousSubmit}
              fullWidth
              size="md"
            >
              Continue Anonymously
            </Button>

            <Text size="sm" ta="center" mt="md">
              Already have an account?{' '}
              <Button
                variant="subtle"
                onClick={() => navigate('/auth')}
                size="sm"
              >
                Login
              </Button>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
