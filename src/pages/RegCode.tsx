import {
  Button,
  Code,
  Container,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useLocation, useNavigate } from 'react-router-dom';

export default function RegCode() {
  const location = useLocation();
  const navigate = useNavigate();
  const login_code = location.state?.login_code;

  if (!login_code) {
    navigate('/reg');
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(login_code);
      notifications.show({
        title: 'Success',
        message: 'Access code copied to clipboard',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to copy access code',
        color: 'red',
      });
    }
  };

  return (
    <Container size="xs" px="xs" py="xl">
      <Paper radius="md" p={{ base: 'md', sm: 'xl' }} withBorder>
        <Title order={2} mb="md" ta="center">
          Your Access Code
        </Title>

        <Stack align="center" gap="xl">
          <Text size="sm" ta="center">
            Save this code somewhere safe. You'll need it to log in later.
          </Text>

          <Code
            block
            style={{
              fontSize: '1.2rem',
              padding: '1rem',
              width: '100%',
              textAlign: 'center',
            }}
          >
            {login_code}
          </Code>

          <Button onClick={handleCopy} variant="light" size="md" fullWidth>
            Copy to Clipboard
          </Button>

          <Text size="sm" ta="center" mt="md">
            <Button
              variant="subtle"
              onClick={() => navigate('/auth')}
              size="sm"
            >
              Go to Login
            </Button>
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}
